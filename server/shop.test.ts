import { describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";
import { appRouter } from "./routers";

vi.mock("./db", () => ({
  listProducts: vi.fn(async () => [
    {
      id: 1,
      slug: "vakum-bell-cihazi",
      name: "Pektus Abla Vakum Bell Cihazı",
      category: "vakum",
      shortDescription: "kısa",
      description: "uzun",
      imageUrl: "/manus-storage/vakum.jpg",
      basePrice: "4500.00",
      isActive: true,
      createdAt: new Date(),
    },
  ]),
  listAllVariants: vi.fn(async () => [
    { id: 10, productId: 1, name: "S (7-11 yaş / 19 cm)", price: "4500.00", isActive: true },
    { id: 11, productId: 1, name: "M (12-15 yaş / 22 cm)", price: "4750.00", isActive: true },
  ]),
  getProductBySlug: vi.fn(async (slug: string) =>
    slug === "vakum-bell-cihazi"
      ? {
          id: 1,
          slug: "vakum-bell-cihazi",
          name: "Pektus Abla Vakum Bell Cihazı",
          category: "vakum",
          shortDescription: "kısa",
          description: "uzun",
          imageUrl: "/manus-storage/vakum.jpg",
          basePrice: "4500.00",
          isActive: true,
          createdAt: new Date(),
        }
      : undefined,
  ),
  listVariantsByProductId: vi.fn(async () => [
    { id: 10, productId: 1, name: "S (7-11 yaş / 19 cm)", price: "4500.00", isActive: true },
  ]),
  createOrder: vi.fn(async () => 42),
  updateOrderStripeInfo: vi.fn(async () => undefined),
  getOrderByNumber: vi.fn(async () => undefined),
  getOrderById: vi.fn(async () => undefined),
  getOrderItems: vi.fn(async () => []),
  listOrders: vi.fn(async () => []),
  updateOrderStatus: vi.fn(async () => undefined),
  markOrderPaidBySessionId: vi.fn(async () => undefined),
  createContactMessage: vi.fn(async () => undefined),
  listContactMessages: vi.fn(async () => []),
  markContactMessageRead: vi.fn(async () => undefined),
}));

function createContext(user: TrpcContext["user"]): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: { origin: "https://test.local" } } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as unknown as TrpcContext["res"],
  };
}

const publicCtx = createContext(null);

describe("products", () => {
  it("lists active products with their variants", async () => {
    const caller = appRouter.createCaller(publicCtx);
    const result = await caller.products.list();
    expect(result).toHaveLength(1);
    expect(result[0].variants).toHaveLength(2);
    expect(result[0].name).toContain("Vakum Bell");
  });

  it("returns product by slug", async () => {
    const caller = appRouter.createCaller(publicCtx);
    const result = await caller.products.bySlug({ slug: "vakum-bell-cihazi" });
    expect(result.slug).toBe("vakum-bell-cihazi");
    expect(result.variants).toHaveLength(1);
  });

  it("throws NOT_FOUND for unknown slug", async () => {
    const caller = appRouter.createCaller(publicCtx);
    await expect(caller.products.bySlug({ slug: "olmayan-urun" })).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
  });
});

describe("orders.create", () => {
  it("creates an order without Stripe configured and returns order number", async () => {
    const caller = appRouter.createCaller(publicCtx);
    const result = await caller.orders.create({
      customerName: "Ayşe Yılmaz",
      customerEmail: "ayse@example.com",
      customerPhone: "05551234567",
      shippingAddress: "Örnek Mah. Test Sok. No:1 D:2",
      city: "İstanbul",
      items: [{ productId: 1, variantId: 10, quantity: 2 }],
    });
    expect(result.orderId).toBe(42);
    expect(result.orderNumber).toMatch(/^PA-/);
    expect(result.stripeConfigured).toBe(false);
    expect(result.checkoutUrl).toBeNull();
  });

  it("rejects an invalid variant", async () => {
    const caller = appRouter.createCaller(publicCtx);
    await expect(
      caller.orders.create({
        customerName: "Ayşe Yılmaz",
        customerEmail: "ayse@example.com",
        customerPhone: "05551234567",
        shippingAddress: "Örnek Mah. Test Sok. No:1 D:2",
        items: [{ productId: 1, variantId: 999, quantity: 1 }],
      }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejects an empty cart", async () => {
    const caller = appRouter.createCaller(publicCtx);
    await expect(
      caller.orders.create({
        customerName: "Ayşe Yılmaz",
        customerEmail: "ayse@example.com",
        customerPhone: "05551234567",
        shippingAddress: "Örnek Mah. Test Sok. No:1 D:2",
        items: [],
      }),
    ).rejects.toThrow();
  });
});

describe("admin authorization", () => {
  const baseUser = {
    id: 1,
    openId: "user-1",
    email: "u@example.com",
    name: "User",
    loginMethod: "manus",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  it("forbids non-admin users from listing orders", async () => {
    const caller = appRouter.createCaller(createContext({ ...baseUser, role: "user" }));
    await expect(caller.admin.orders()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("allows admin users to list orders", async () => {
    const caller = appRouter.createCaller(createContext({ ...baseUser, role: "admin" }));
    const result = await caller.admin.orders();
    expect(Array.isArray(result)).toBe(true);
  });

  it("rejects unauthenticated access to admin orders", async () => {
    const caller = appRouter.createCaller(publicCtx);
    await expect(caller.admin.orders()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});

describe("contact.send", () => {
  it("accepts a valid contact message", async () => {
    const caller = appRouter.createCaller(publicCtx);
    const result = await caller.contact.send({
      name: "Mehmet",
      email: "mehmet@example.com",
      message: "Vakum bell boyutu hakkında bilgi almak istiyorum.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects too-short messages", async () => {
    const caller = appRouter.createCaller(publicCtx);
    await expect(
      caller.contact.send({ name: "M", email: "gecersiz", message: "kısa" }),
    ).rejects.toThrow();
  });
});
