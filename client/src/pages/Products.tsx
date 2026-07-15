import SiteLayout from "@/components/SiteLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { formatTL } from "@shared/products";
import { ArrowRight, PackageOpen } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const CATEGORIES = [
  { key: "hepsi", label: "Tümü" },
  { key: "vakum", label: "Vakum Bell" },
  { key: "ortez", label: "Ortez" },
] as const;

export default function Products() {
  const { data: products, isLoading } = trpc.products.list.useQuery();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]["key"]>("hepsi");

  const filtered = (products ?? []).filter(
    p => category === "hepsi" || p.category === category,
  );

  return (
    <SiteLayout>
      <section className="bg-accent/50 py-12 sm:py-16">
        <div className="container text-center max-w-3xl mx-auto">
          <Badge className="mb-4 bg-primary/10 text-primary rounded-full px-4 py-1.5 font-bold">
            Ürünlerimiz
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold">Tedavi Ürünleri</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Pektus ekskavatum için 8 boyut seçenekli göğüs vakum sistemleri; pektus karinatum ve rib
            flare için kişiye özel üretilen ortez ve bandaj sistemleri. Tüm ürünler Sağlık Bakanlığı
            ÜTS kayıtlıdır, biyomedikal takip danışmanlığıyla birlikte Türkiye geneline gönderilir.
          </p>
        </div>
      </section>

      <section className="container py-10">
        <div className="flex justify-center gap-2 mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${
                category === cat.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}>
              {cat.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[1, 2].map(i => (
              <Skeleton key={i} className="h-96 rounded-3xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <PackageOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Bu kategoride ürün bulunamadı.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {filtered.map(product => (
              <Link key={product.id} href={`/urun/${product.slug}`}>
                <Card className="group overflow-hidden rounded-3xl hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                  <div className="aspect-[4/3] overflow-hidden bg-secondary">
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <CardContent className="p-6">
                    <Badge variant="secondary" className="rounded-full mb-3 font-semibold">
                      {product.category === "vakum" ? "Vakum Bell" : "Ortez"}
                    </Badge>
                    <h2 className="text-xl font-extrabold mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {product.shortDescription}
                    </p>
                    {product.variants.length > 1 && (
                      <p className="mt-3 text-xs font-semibold text-primary">
                        {product.variants.length} boyut seçeneği
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-lg font-extrabold text-primary">
                        {formatTL(product.basePrice)}
                        {product.variants.length > 1 && (
                          <span className="text-xs font-semibold text-muted-foreground ml-1">
                            'den başlayan
                          </span>
                        )}
                      </span>
                      <Button size="sm" className="rounded-full font-bold">
                        İncele <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
