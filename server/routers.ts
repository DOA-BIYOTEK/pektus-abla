import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { getStripe, isStripeConfigured } from "./stripe";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Bu işlem için yetkiniz yok" });
  }
  return next({ ctx });
});

const orderStatusEnum = z.enum([
  "odeme_bekliyor",
  "odendi",
  "hazirlaniyor",
  "kargoda",
  "teslim_edildi",
  "iptal",
]);

const cartItemSchema = z.object({
  productId: z.number().int().positive(),
  variantId: z.number().int().positive().nullable(),
  quantity: z.number().int().min(1).max(20),
});

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  products: router({
    list: publicProcedure.query(async () => {
      const [productList, variants] = await Promise.all([
        db.listProducts(),
        db.listAllVariants(),
      ]);
      return productList.map(p => ({
        ...p,
        variants: variants.filter(v => v.productId === p.id && v.isActive),
      }));
    }),
    bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      const product = await db.getProductBySlug(input.slug);
      if (!product || !product.isActive) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Ürün bulunamadı" });
      }
      const variants = await db.listVariantsByProductId(product.id);
      return { ...product, variants: variants.filter(v => v.isActive) };
    }),
  }),

  orders: router({
    /** Sipariş oluşturur; Stripe yapılandırılmışsa checkout URL döner. */
    create: publicProcedure
      .input(
        z.object({
          customerName: z.string().min(2, "Ad Soyad gerekli").max(255),
          customerEmail: z.string().email("Geçerli bir e-posta girin"),
          customerPhone: z.string().min(7, "Geçerli bir telefon girin").max(32),
          shippingAddress: z.string().min(10, "Adres en az 10 karakter olmalı"),
          city: z.string().max(128).optional(),
          note: z.string().max(1000).optional(),
          items: z.array(cartItemSchema).min(1, "Sepetiniz boş"),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        // Fiyatları sunucu tarafında doğrula
        const [productList, variants] = await Promise.all([
          db.listProducts(),
          db.listAllVariants(),
        ]);

        let total = 0;
        const resolvedItems = input.items.map(item => {
          const product = productList.find(p => p.id === item.productId);
          if (!product) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Geçersiz ürün" });
          }
          let unitPrice = parseFloat(product.basePrice);
          let variantName: string | null = null;
          if (item.variantId) {
            const variant = variants.find(
              v => v.id === item.variantId && v.productId === product.id,
            );
            if (!variant) {
              throw new TRPCError({ code: "BAD_REQUEST", message: "Geçersiz ürün seçeneği" });
            }
            unitPrice = parseFloat(variant.price);
            variantName = variant.name;
          }
          total += unitPrice * item.quantity;
          return {
            productId: product.id,
            variantId: item.variantId,
            productName: product.name,
            variantName,
            unitPrice: unitPrice.toFixed(2),
            quantity: item.quantity,
            imageUrl: product.imageUrl,
          };
        });

        const orderNumber = `PA-${Date.now().toString(36).toUpperCase()}${nanoid(4).toUpperCase().replace(/[^A-Z0-9]/g, "X")}`;

        const orderId = await db.createOrder(
          {
            orderNumber,
            customerName: input.customerName,
            customerEmail: input.customerEmail,
            customerPhone: input.customerPhone,
            shippingAddress: input.shippingAddress,
            city: input.city,
            note: input.note,
            totalAmount: total.toFixed(2),
            status: "odeme_bekliyor",
          },
          resolvedItems.map(({ imageUrl: _img, ...rest }) => rest),
        );

        // Stripe yapılandırılmamışsa siparişi kaydet, ödeme adımını bilgilendir
        if (!isStripeConfigured()) {
          return {
            orderId,
            orderNumber,
            checkoutUrl: null as string | null,
            stripeConfigured: false,
          };
        }

        const stripe = getStripe();
        const origin = (ctx.req.headers.origin as string) || `https://${ctx.req.headers.host}`;
        const session = await stripe.checkout.sessions.create({
          mode: "payment",
          customer_email: input.customerEmail,
          client_reference_id: String(orderId),
          allow_promotion_codes: true,
          line_items: resolvedItems.map(item => ({
            quantity: item.quantity,
            price_data: {
              currency: "try",
              unit_amount: Math.round(parseFloat(item.unitPrice) * 100),
              product_data: {
                name: item.variantName
                  ? `${item.productName} — ${item.variantName}`
                  : item.productName,
              },
            },
          })),
          metadata: {
            order_id: String(orderId),
            order_number: orderNumber,
            customer_email: input.customerEmail,
            customer_name: input.customerName,
          },
          success_url: `${origin}/siparis-basarili?order=${orderNumber}`,
          cancel_url: `${origin}/siparis-iptal?order=${orderNumber}`,
        });

        await db.updateOrderStripeInfo(orderId, { stripeSessionId: session.id });

        return {
          orderId,
          orderNumber,
          checkoutUrl: session.url,
          stripeConfigured: true,
        };
      }),

    /** Sipariş numarasıyla sipariş durumunu sorgular (müşteri için). */
    track: publicProcedure
      .input(z.object({ orderNumber: z.string().min(4) }))
      .query(async ({ input }) => {
        const order = await db.getOrderByNumber(input.orderNumber);
        if (!order) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Sipariş bulunamadı" });
        }
        const items = await db.getOrderItems(order.id);
        return {
          orderNumber: order.orderNumber,
          status: order.status,
          totalAmount: order.totalAmount,
          createdAt: order.createdAt,
          items: items.map(i => ({
            productName: i.productName,
            variantName: i.variantName,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
          })),
        };
      }),
  }),

  contact: router({
    send: publicProcedure
      .input(
        z.object({
          name: z.string().min(2, "İsim gerekli").max(255),
          email: z.string().email("Geçerli bir e-posta girin"),
          phone: z.string().max(32).optional(),
          message: z.string().min(10, "Mesaj en az 10 karakter olmalı").max(5000),
        }),
      )
      .mutation(async ({ input }) => {
        await db.createContactMessage(input);
        return { success: true } as const;
      }),
  }),

  admin: router({
    orders: adminProcedure.query(async () => {
      const orderList = await db.listOrders();
      return orderList;
    }),
    orderDetail: adminProcedure
      .input(z.object({ orderId: z.number().int().positive() }))
      .query(async ({ input }) => {
        const order = await db.getOrderById(input.orderId);
        if (!order) throw new TRPCError({ code: "NOT_FOUND" });
        const items = await db.getOrderItems(order.id);
        return { ...order, items };
      }),
    updateOrderStatus: adminProcedure
      .input(z.object({ orderId: z.number().int().positive(), status: orderStatusEnum }))
      .mutation(async ({ input }) => {
        await db.updateOrderStatus(input.orderId, input.status);
        return { success: true } as const;
      }),
    contactMessages: adminProcedure.query(async () => db.listContactMessages()),
    markMessageRead: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        await db.markContactMessageRead(input.id);
        return { success: true } as const;
      }),
  }),
});

export type AppRouter = typeof appRouter;
