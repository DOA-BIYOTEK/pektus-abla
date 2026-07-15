import { BRAND } from "@shared/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Heart, Instagram, Mail, MapPin, Menu, Phone, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

const NAV_ITEMS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/pektus-hakkinda", label: "Pektus Hakkında" },
  { href: "/urunler", label: "Ürünler" },
  { href: "/sss", label: "SSS" },
  { href: "/iletisim", label: "İletişim" },
];

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { totalCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Üst bilgi çubuğu */}
      <div className="bg-primary text-primary-foreground text-xs sm:text-sm py-1.5">
        <div className="container flex items-center justify-center gap-2 text-center">
          <Heart className="h-3.5 w-3.5 shrink-0 fill-current" />
          <span>Ameliyatsız tedavi yolculuğunuzda yanınızdayız — Türkiye geneli kargo</span>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center gap-3">
            <img
              src={BRAND.logoUrl}
              alt="Pektus Abla logosu"
              className="h-11 w-11 sm:h-14 sm:w-14 rounded-xl object-contain"
            />
            <div className="leading-tight">
              <span className="block font-extrabold text-primary text-lg sm:text-xl tracking-tight">
                PEKTUS ABLA
              </span>
              <span className="hidden sm:block text-[11px] text-muted-foreground font-medium">
                {BRAND.slogan}
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <Link key={item.href} href={item.href}>
                <span
                  className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-colors ${
                    location === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/sepet">
              <Button
                variant="outline"
                className="relative rounded-full border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground">
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Sepet</span>
                {totalCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[11px] font-bold rounded-full h-5 min-w-5 px-1 flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </Button>
            </Link>
            <button
              className="lg:hidden p-2 rounded-full hover:bg-accent"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Menüyü aç/kapat">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="lg:hidden border-t border-border bg-background px-4 py-3 flex flex-col gap-1">
            {NAV_ITEMS.map(item => (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                <span
                  className={`block px-4 py-2.5 rounded-xl text-sm font-semibold ${
                    location === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent"
                  }`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-foreground text-background mt-16">
        <div className="container py-12 grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={BRAND.logoUrl}
                alt="Pektus Abla logosu"
                className="h-12 w-12 rounded-xl object-contain bg-background/95 p-1"
              />
              <div className="leading-tight">
                <span className="block font-extrabold text-lg">PEKTUS ABLA</span>
                <span className="text-xs opacity-70">{BRAND.slogan}</span>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Pektus ekskavatum ve pektus karinatum hakkında güvenilir bilgiler ve ameliyatsız
              tedavi ürünleriyle her adımda yanınızdayız.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-base">Hızlı Erişim</h3>
            <ul className="space-y-2 text-sm">
              {NAV_ITEMS.concat([{ href: "/sepet", label: "Sepetim" }]).map(item => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <span className="opacity-80 hover:opacity-100 hover:underline">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-base">İletişim</h3>
            <ul className="space-y-3 text-sm opacity-80">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" /> {BRAND.phone}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" /> {BRAND.email}
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" /> {BRAND.address}
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="h-4 w-4 shrink-0" />
                <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="hover:underline">
                  @pektusabla
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-background/15 py-4">
          <div className="container flex flex-col sm:flex-row items-center justify-between gap-2 text-xs opacity-70">
            <span>© {new Date().getFullYear()} Pektus Abla. Tüm hakları saklıdır.</span>
            <span>
              Bu sitedeki bilgiler tıbbi tavsiye yerine geçmez; tedaviye başlamadan önce mutlaka
              doktorunuza danışın.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

