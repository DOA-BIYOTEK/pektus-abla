import SiteLayout from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import { Link, useSearchParams } from "wouter";

export default function OrderCancel() {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("order") ?? "";

  return (
    <SiteLayout>
      <section className="container py-20">
        <Card className="rounded-[2rem] max-w-lg mx-auto text-center">
          <CardContent className="p-10">
            <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-3">Ödeme Tamamlanmadı</h1>
            {orderNumber && (
              <p className="text-sm text-muted-foreground mb-5">
                Sipariş No: <span className="font-bold text-foreground">{orderNumber}</span>
              </p>
            )}
            <p className="text-muted-foreground leading-relaxed mb-8 text-sm">
              Ödeme işlemi iptal edildi veya tamamlanamadı. Dilerseniz sepetinize dönüp tekrar
              deneyebilir ya da sorularınız için bizimle iletişime geçebilirsiniz.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/urunler">
                <Button className="rounded-full font-bold">Ürünlere Dön</Button>
              </Link>
              <Link href="/iletisim">
                <Button variant="outline" className="rounded-full font-bold border-primary/40 text-primary">
                  Yardım Al
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </SiteLayout>
  );
}

