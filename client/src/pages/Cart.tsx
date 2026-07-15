import SiteLayout from "@/components/SiteLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { formatTL } from "@shared/products";
import {
  ArrowRight,
  CreditCard,
  Loader2,
  Lock,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, totalAmount } = useCart();
  const [, navigate] = useLocation();
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    city: "",
    note: "",
  });

  const createOrder = trpc.orders.create.useMutation({
    onSuccess: data => {
      if (data.checkoutUrl) {
        toast.success("Güvenli ödeme sayfasına yönlendiriliyorsunuz...");
        clearCart();
        window.open(data.checkoutUrl, "_blank");
        navigate(`/siparis-basarili?order=${data.orderNumber}&pending=1`);
      } else {
        clearCart();
        toast.success("Siparişiniz alındı!");
        navigate(`/siparis-basarili?order=${data.orderNumber}&nopay=1`);
      }
    },
    onError: err => toast.error(err.message || "Sipariş oluşturulamadı, lütfen tekrar deneyin."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Sepetiniz boş");
      return;
    }
    createOrder.mutate({
      ...form,
      city: form.city || undefined,
      note: form.note || undefined,
      items: items.map(i => ({
        productId: i.productId,
        variantId: i.variantId,
        quantity: i.quantity,
      })),
    });
  };

  if (items.length === 0) {
    return (
      <SiteLayout>
        <div className="container py-24 text-center max-w-md mx-auto">
          <div className="h-20 w-20 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="h-9 w-9 text-primary" />
          </div>
          <h1 className="text-2xl font-extrabold mb-3">Sepetiniz şu an boş</h1>
          <p className="text-muted-foreground mb-8">
            Size uygun vakum bell veya ortez ürününü keşfetmek için ürünler sayfamıza göz atın.
          </p>
          <Link href="/urunler">
            <Button size="lg" className="rounded-full px-8 font-bold">
              Ürünleri Keşfet <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="container py-10">
        <Badge className="mb-3 bg-primary/10 text-primary rounded-full px-4 py-1.5 font-bold">
          Sepet & Sipariş
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8">Sepetim</h1>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-start">
          {/* Sepet ürünleri + form */}
          <div className="space-y-8">
            <div className="space-y-4">
              {items.map(item => (
                <Card key={`${item.productId}-${item.variantId}`} className="rounded-3xl">
                  <CardContent className="p-4 sm:p-5 flex gap-4">
                    <div className="h-24 w-24 rounded-2xl overflow-hidden bg-secondary shrink-0">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-extrabold leading-tight">{item.productName}</h3>
                      {item.variantName && (
                        <p className="text-xs text-muted-foreground font-semibold mt-0.5">
                          {item.variantName}
                        </p>
                      )}
                      <p className="text-primary font-extrabold mt-1">{formatTL(item.unitPrice)}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() =>
                              updateQuantity(item.productId, item.variantId, item.quantity - 1)
                            }>
                            <Minus className="h-3.5 w-3.5" />
                          </Button>
                          <span className="font-extrabold w-6 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() =>
                              updateQuantity(item.productId, item.variantId, item.quantity + 1)
                            }>
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive rounded-full"
                          onClick={() => removeItem(item.productId, item.variantId)}
                          aria-label="Ürünü sepetten çıkar">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Sipariş formu */}
            <Card className="rounded-3xl">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-xl font-extrabold mb-6">Teslimat Bilgileri</h2>
                <form id="order-form" onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="customerName" className="font-bold mb-2 block">
                        Ad Soyad *
                      </Label>
                      <Input
                        id="customerName"
                        required
                        minLength={2}
                        value={form.customerName}
                        onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
                        placeholder="Adınız Soyadınız"
                        className="rounded-xl h-11 bg-background"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerPhone" className="font-bold mb-2 block">
                        Telefon *
                      </Label>
                      <Input
                        id="customerPhone"
                        type="tel"
                        required
                        minLength={7}
                        value={form.customerPhone}
                        onChange={e => setForm(f => ({ ...f, customerPhone: e.target.value }))}
                        placeholder="05xx xxx xx xx"
                        className="rounded-xl h-11 bg-background"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="customerEmail" className="font-bold mb-2 block">
                      E-posta *
                    </Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      required
                      value={form.customerEmail}
                      onChange={e => setForm(f => ({ ...f, customerEmail: e.target.value }))}
                      placeholder="ornek@eposta.com"
                      className="rounded-xl h-11 bg-background"
                    />
                  </div>
                  <div className="grid sm:grid-cols-[1fr_auto] gap-5">
                    <div>
                      <Label htmlFor="shippingAddress" className="font-bold mb-2 block">
                        Teslimat Adresi *
                      </Label>
                      <Textarea
                        id="shippingAddress"
                        required
                        minLength={10}
                        rows={3}
                        value={form.shippingAddress}
                        onChange={e => setForm(f => ({ ...f, shippingAddress: e.target.value }))}
                        placeholder="Mahalle, sokak, bina no, daire..."
                        className="rounded-xl bg-background"
                      />
                    </div>
                    <div className="sm:w-44">
                      <Label htmlFor="city" className="font-bold mb-2 block">
                        Şehir
                      </Label>
                      <Input
                        id="city"
                        value={form.city}
                        onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                        placeholder="İstanbul"
                        className="rounded-xl h-11 bg-background"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="note" className="font-bold mb-2 block">
                      Sipariş Notu (isteğe bağlı)
                    </Label>
                    <Textarea
                      id="note"
                      rows={2}
                      value={form.note}
                      onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                      placeholder="Eklemek istediğiniz bir not varsa yazın..."
                      className="rounded-xl bg-background"
                    />
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sipariş özeti */}
          <Card className="rounded-3xl sticky top-28">
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-xl font-extrabold mb-5">Sipariş Özeti</h2>
              <div className="space-y-3 text-sm">
                {items.map(item => (
                  <div
                    key={`${item.productId}-${item.variantId}`}
                    className="flex justify-between gap-3">
                    <span className="text-muted-foreground">
                      {item.productName}
                      {item.variantName ? ` (${item.variantName})` : ""} × {item.quantity}
                    </span>
                    <span className="font-bold whitespace-nowrap">
                      {formatTL(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Kargo</span>
                <span className="font-bold text-primary">Ücretsiz</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="font-extrabold text-lg">Toplam</span>
                <span className="font-extrabold text-2xl text-primary">
                  {formatTL(totalAmount)}
                </span>
              </div>
              <Button
                type="submit"
                form="order-form"
                size="lg"
                disabled={createOrder.isPending}
                className="w-full rounded-full font-bold text-base shadow-lg shadow-primary/25">
                {createOrder.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <CreditCard className="h-5 w-5" />
                )}
                Güvenli Ödemeye Geç
              </Button>
              <p className="mt-4 text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                <Lock className="h-3.5 w-3.5" /> Ödemeniz Stripe güvenli altyapısıyla alınır
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </SiteLayout>
  );
}
