import SiteLayout from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, Home as HomeIcon } from "lucide-react";
import { useMemo } from "react";
import { Link, useSearchParams } from "wouter";

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const { orderNumber, pending, nopay } = useMemo(
    () => ({
      orderNumber: searchParams.get("order") ?? "",
      pending: searchParams.get("pending") === "1",
      nopay: searchParams.get("nopay") === "1",
    }),
    [searchParams],
  );

  return (
    <SiteLayout>
      <section className="container py-20">
        <Card className="rounded-[2rem] max-w-lg mx-auto text-center">
          <CardContent className="p-10">
            <div
              className={`h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                pending ? "bg-amber-100" : "bg-green-100"
              }`}>
              {pending ? (
                <Clock className="h-10 w-10 text-amber-600" />
              ) : (
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-3">
              {pending ? "Ödemenizi Tamamlayın" : "Siparişiniz Alındı!"}
            </h1>
            {orderNumber && (
              <p className="text-sm text-muted-foreground mb-1">Sipariş Numaranız</p>
            )}
            {orderNumber && (
              <p className="text-xl font-extrabold text-primary mb-5 tracking-wide">
                {orderNumber}
              </p>
            )}
            <p className="text-muted-foreground leading-relaxed mb-8 text-sm">
              {pending
                ? "Ödeme sayfası yeni sekmede açıldı. Ödemenizi tamamladığınızda siparişiniz onaylanacak ve hazırlanmaya başlanacaktır. Sipariş numaranızı not almayı unutmayın."
                : nopay
                  ? "Siparişiniz başarıyla kaydedildi. Ödeme altyapımız şu an hazırlanıyor; ekibimiz ödeme için sizinle en kısa sürede iletişime geçecek. Sipariş numaranızı not almayı unutmayın."
                  : "Siparişiniz başarıyla alındı. Hazırlanıp kargoya verildiğinde e-posta ile bilgilendirileceksiniz. Bizi tercih ettiğiniz için teşekkür ederiz!"}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/">
                <Button className="rounded-full font-bold">
                  <HomeIcon className="h-4 w-4" /> Ana Sayfaya Dön
                </Button>
              </Link>
              <Link href="/urunler">
                <Button variant="outline" className="rounded-full font-bold border-primary/40 text-primary">
                  Alışverişe Devam Et
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </SiteLayout>
  );
}
