import type { Express, Request, Response } from "express";
import express from "express";
import { markOrderPaidBySessionId, updateOrderStripeInfo } from "./db";
import { getStripe, isStripeConfigured } from "./stripe";

/**
 * Stripe webhook endpoint'i. express.json()'dan ÖNCE kaydedilmelidir,
 * çünkü imza doğrulaması ham gövde (raw body) gerektirir.
 */
export function registerStripeWebhook(app: Express) {
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req: Request, res: Response) => {
      if (!isStripeConfigured()) {
        return res.status(503).json({ error: "Stripe is not configured" });
      }

      const stripe = getStripe();
      const signature = req.headers["stripe-signature"] as string | undefined;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      let event;
      try {
        if (webhookSecret && signature) {
          event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
        } else {
          event = JSON.parse(req.body.toString());
        }
      } catch (err) {
        console.error("[Stripe Webhook] Signature verification failed:", err);
        return res.status(400).json({ error: "Invalid signature" });
      }

      // Test eventleri doğrulama yanıtı bekler
      if (event.id?.startsWith("evt_test_")) {
        console.log("[Stripe Webhook] Test event detected, returning verification response");
        return res.json({ verified: true });
      }

      try {
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as {
              id: string;
              payment_intent?: string | null;
              metadata?: Record<string, string>;
            };
            console.log(
              `[Stripe Webhook] checkout.session.completed — session=${session.id}, order=${session.metadata?.order_number}`,
            );
            await markOrderPaidBySessionId(
              session.id,
              typeof session.payment_intent === "string" ? session.payment_intent : undefined,
            );
            break;
          }
          case "checkout.session.expired": {
            const session = event.data.object as { id: string; metadata?: Record<string, string> };
            const orderId = session.metadata?.order_id;
            if (orderId) {
              await updateOrderStripeInfo(Number(orderId), { status: "iptal" });
            }
            break;
          }
          default:
            console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
        }
        return res.json({ received: true });
      } catch (err) {
        console.error("[Stripe Webhook] Handler error:", err);
        return res.status(500).json({ error: "Webhook handler failed" });
      }
    },
  );
}
