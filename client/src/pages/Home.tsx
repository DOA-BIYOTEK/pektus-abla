import SiteLayout from "@/components/SiteLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { BRAND, formatTL } from "@shared/products";
import {
  ArrowRight,
  BookOpenText,
  HandHeart,
  Heart,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Stethoscope,
  Truck,
} from "lucide-react";
import { Link } from "wouter";

const WHY_ITEMS = [
  {
    icon: HandHeart,
    title: "Abla Sıcaklığında Destek",
    text: "Pektus yolculuğunda yalnız değilsiniz. Sipariş öncesi ve sonrası tüm sorularınızda size samimi ve anlaşılır bir dille rehberlik ediyoruz.",
  },
  {
    icon: Stethoscope,
    title: "Doğru Bilgi, Doğru Ürün",
    text: "Pektus ekskavatum ve karinatum için hazırladığımız bilgi içerikleri sayesinde durumunuzu tanır, size uygun ürünü bilinçli şekilde seçersiniz.",
  },
  {
    icon: ShieldCheck,
    title: "Güvenli Alışveriş",
    text: "Siparişleriniz güvenli ödeme altyapısıyla alınır; kişisel bilgileriniz korunur ve siparişiniz özenle hazırlanıp kargoya verilir.",
  },
  {
    icon: Truck,
    title: "Türkiye Geneli Kargo",
    text: "Vakum bell cihazları ve ortezlerimiz, Türkiye'nin her yerine özenli paketlemeyle hızlıca gönderilir.",
  },
];

export default function Home() {
  const { data: products } = trpc.products.list.useQuery();

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/70 via-background to-background" />
        <div className="container relative py-14 sm:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/15 rounded-full px-4 py-1.5 text-sm font-bold">
              <Heart className="h-3.5 w-3.5 mr-1.5 fill-current" /> {BRAND.slogan}
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] text-foreground">
              Pektus'la mücadelede
              <span className="text-primary block">yanınızdaki abla</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
              Kunduracı göğsü (pektus ekskavatum) ve güvercin göğsü (pektus karinatum) hakkında
              güvenilir bilgiye ulaşın; ameliyatsız tedavi sürecinizde kullanılan göğüs vakum
              sistemleri ve göğüs ortez, destek korseleri ürünlerimizi oturduğunuz yerden kolayca
              sipariş edebilirsiniz.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/urunler">
                <Button size="lg" className="rounded-full px-7 font-bold text-base shadow-lg shadow-primary/25">
                  Birlikte Size Uygun Ürünü Seçelim <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pektus-hakkinda">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-7 font-bold text-base border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground">
                  <BookOpenText className="h-4 w-4" /> Pektus Nedir?
                </Button>
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-primary">3</p>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">Tedavi Ürün Grubu</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-primary">11</p>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">Boyut Seçeneği</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-primary">7/24</p>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">Online Sipariş</p>
              </div>
            </div>
          </div>
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-6 bg-primary/10 rounded-[2.5rem] rotate-3" />
              <img
                src="/manus-storage/kahraman_24447971.jpg"
                alt="Göğüs kafesi süper gücünü gösteren kahraman çocuk illüstrasyonu"
                className="relative w-72 sm:w-96 rounded-[2rem] shadow-xl shadow-primary/15 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Öne çıkan ürünler */}
      <section className="container py-14 sm:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-primary font-bold text-sm uppercase tracking-wider mb-1">Ürünlerimiz</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold">Öne Çıkan Ürünler</h2>
          </div>
          <Link href="/urunler" className="hidden sm:block">
            <Button variant="ghost" className="rounded-full text-primary font-bold hover:bg-accent">
              Tümünü Gör <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {(products ?? []).map(product => (
            <Link key={product.id} href={`/urun/${product.slug}`}>
              <Card className="group overflow-hidden rounded-3xl border-border hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
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
                  <h3 className="text-xl font-extrabold mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {product.shortDescription}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-extrabold text-primary">
                      {formatTL(product.basePrice)}
                      {product.variants.length > 1 && (
                        <span className="text-xs font-semibold text-muted-foreground ml-1">'den başlayan</span>
                      )}
                    </span>
                    <span className="text-sm font-bold text-primary flex items-center gap-1">
                      İncele <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <div className="mt-6 sm:hidden text-center">
          <Link href="/urunler">
            <Button variant="outline" className="rounded-full border-primary/40 text-primary font-bold">
              Tüm Ürünleri Gör <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Neden Pektus Abla */}
      <section className="bg-accent/50 py-14 sm:py-20">
        <div className="container">
          <div className="text-center mb-10">
            <p className="text-primary font-bold text-sm uppercase tracking-wider mb-1">Neden Biz?</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold">Neden Pektus Abla?</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Çünkü bu yolculuğu biliyoruz ve her adımda, tıpkı bir abla gibi yanınızdayız.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY_ITEMS.map(item => (
              <Card key={item.title} className="rounded-3xl border-border/60 bg-card">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-extrabold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bilgi CTA */}
      <section className="container py-14 sm:py-20">
        <div className="rounded-[2rem] bg-primary text-primary-foreground p-8 sm:p-12 grid lg:grid-cols-[1fr_auto] gap-8 items-center overflow-hidden relative">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary-foreground/10" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
              Pektus hakkında merak ettikleriniz mi var?
            </h2>
            <p className="opacity-90 leading-relaxed max-w-2xl">
              Pektus ekskavatum ve karinatum nedir, belirtileri nelerdir, vakum bell ve ortez
              tedavileri nasıl uygulanır? Hepsini sizin için anlaşılır bir dille anlattık.
            </p>
          </div>
          <div className="relative flex gap-3 flex-wrap">
            <Link href="/pektus-hakkinda">
              <Button size="lg" variant="secondary" className="rounded-full font-bold">
                Bilgi Alanına Git
              </Button>
            </Link>
            <Link href="/sss">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full font-bold border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                SSS
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* İletişim alanı */}
      <section className="container pb-4">
        <div className="text-center mb-8">
          <p className="text-primary font-bold text-sm uppercase tracking-wider mb-1">İletişim</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold">Bize Ulaşın</h2>
          <p className="mt-3 text-muted-foreground">
            Sorularınız için her zaman buradayız. Bize telefon, e-posta veya iletişim formu ile ulaşabilirsiniz.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
          <a href={`tel:${BRAND.phone.replace(/[^+\d]/g, "")}`}>
            <Card className="rounded-3xl hover:shadow-lg hover:shadow-primary/10 transition-shadow h-full">
              <CardContent className="p-6 text-center">
                <Phone className="h-6 w-6 text-primary mx-auto mb-3" />
                <p className="font-bold text-sm">{BRAND.phone}</p>
              </CardContent>
            </Card>
          </a>
          <a href={`mailto:${BRAND.email}`}>
            <Card className="rounded-3xl hover:shadow-lg hover:shadow-primary/10 transition-shadow h-full">
              <CardContent className="p-6 text-center">
                <Mail className="h-6 w-6 text-primary mx-auto mb-3" />
                <p className="font-bold text-sm">{BRAND.email}</p>
              </CardContent>
            </Card>
          </a>
          <Link href="/iletisim">
            <Card className="rounded-3xl hover:shadow-lg hover:shadow-primary/10 transition-shadow h-full cursor-pointer">
              <CardContent className="p-6 text-center">
                <MapPin className="h-6 w-6 text-primary mx-auto mb-3" />
                <p className="font-bold text-sm">İletişim Formu</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
