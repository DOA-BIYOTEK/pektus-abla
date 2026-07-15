import SiteLayout from "@/components/SiteLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { formatTL } from "@shared/products";
import { ArrowLeft, Minus, Plus, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link, useLocation, useRoute } from "wouter";

export default function ProductDetail() {
  const [, params] = useRoute("/urun/:slug");
  const [, navigate] = useLocation();
  const slug = params?.slug ?? "";
  const { data: product, isLoading, error } = trpc.products.bySlug.useQuery(
    { slug },
    { enabled: Boolean(slug), retry: false },
  );
  const { addItem } = useCart();
  const [variantId, setVariantId] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product && product.variants.length > 0 && !variantId) {
      setVariantId(String(product.variants[0].id));
    }
  }, [product, variantId]);

  const selectedVariant = product?.variants.find(v => String(v.id) === variantId);
  const unitPrice = selectedVariant
    ? parseFloat(selectedVariant.price)
    : product
      ? parseFloat(product.basePrice)
      : 0;

  const handleAddToCart = () => {
    if (!product) return;
    if (product.variants.length > 0 && !selectedVariant) {
      toast.error("Lütfen bir boyut seçin");
      return;
    }
    addItem(
      {
        productId: product.id,
        variantId: selectedVariant ? selectedVariant.id : null,
        productName: product.name,
        variantName: selectedVariant?.name ?? null,
        unitPrice,
        imageUrl: product.imageUrl,
      },
      quantity,
    );
    toast.success("Ürün sepete eklendi", {
      action: { label: "Sepete Git", onClick: () => navigate("/sepet") },
    });
  };

  if (error) {
    return (
      <SiteLayout>
        <div className="container py-24 text-center">
          <h1 className="text-2xl font-extrabold mb-3">Ürün bulunamadı</h1>
          <p className="text-muted-foreground mb-6">Aradığınız ürün kaldırılmış olabilir.</p>
          <Link href="/urunler">
            <Button className="rounded-full font-bold">
              <ArrowLeft className="h-4 w-4" /> Ürünlere Dön
            </Button>
          </Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="container py-10">
        <Link href="/urunler">
          <Button variant="ghost" className="rounded-full mb-6 text-primary font-bold hover:bg-accent">
            <ArrowLeft className="h-4 w-4" /> Ürünlere Dön
          </Button>
        </Link>

        {isLoading || !product ? (
          <div className="grid lg:grid-cols-2 gap-10">
            <Skeleton className="aspect-[4/3] rounded-3xl" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-1/2" />
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <Card className="rounded-3xl overflow-hidden sticky top-28">
              <div className="aspect-[4/3] bg-secondary">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </Card>

            <div>
              <Badge variant="secondary" className="rounded-full mb-3 font-semibold">
                {product.category === "vakum" ? "Vakum Bell" : "Ortez"}
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">{product.name}</h1>
              <p className="text-2xl font-extrabold text-primary mb-6">{formatTL(unitPrice)}</p>

              <div className="space-y-5 mb-8">
                {product.variants.length > 0 && (
                  <div>
                    <Label className="font-bold mb-2 block">
                      {product.category === "vakum" ? "Boyut Seçin" : "Beden Seçin"}
                    </Label>
                    <Select value={variantId} onValueChange={setVariantId}>
                      <SelectTrigger className="rounded-xl h-12 bg-card">
                        <SelectValue placeholder="Boyut seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.variants.map(v => (
                          <SelectItem key={v.id} value={String(v.id)}>
                            {v.name} — {formatTL(v.price)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label className="font-bold mb-2 block">Adet</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-extrabold w-8 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      onClick={() => setQuantity(q => Math.min(20, q + 1))}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full rounded-full font-bold text-base h-13 shadow-lg shadow-primary/25"
                  onClick={handleAddToCart}>
                  <ShoppingCart className="h-5 w-5" /> Sepete Ekle — {formatTL(unitPrice * quantity)}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="flex items-center gap-2.5 rounded-2xl bg-accent/60 p-3.5 text-sm font-semibold">
                  <Truck className="h-5 w-5 text-primary shrink-0" /> Türkiye geneli kargo
                </div>
                <div className="flex items-center gap-2.5 rounded-2xl bg-accent/60 p-3.5 text-sm font-semibold">
                  <ShieldCheck className="h-5 w-5 text-primary shrink-0" /> Güvenli ödeme
                </div>
              </div>

              <div>
                <h2 className="font-extrabold text-lg mb-3">Ürün Açıklaması</h2>
                <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
                  {(product.description ?? "").split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
                <p className="mt-5 text-xs text-muted-foreground/80 italic">
                  Bu ürün tıbbi bir cihazdır. Kullanmadan önce mutlaka doktorunuza danışın ve
                  kullanım talimatlarına uyun.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
