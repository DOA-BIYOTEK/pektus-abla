import SiteLayout from "@/components/SiteLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PRODUCT_IMAGES } from "@shared/products";
import { AlertTriangle, ArrowRight, CheckCircle2, Wind } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  return (
    <SiteLayout>
      {/* Başlık */}
      <section className="bg-accent/50 py-12 sm:py-16">
        <div className="container text-center max-w-3xl mx-auto">
          <Badge className="mb-4 bg-primary/10 text-primary rounded-full px-4 py-1.5 font-bold">
            Bilgi Alanı
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold">Pektus Hakkında Her Şey</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Göğüs duvarı şekil bozuklukları düşündüğünüzden daha yaygındır: yaklaşık her 400
            doğumdan birinde görülür. Bu sayfada en sık görülen iki tip olan pektus ekskavatum ve
            pektus karinatumu, belirtilerini ve ameliyatsız tedavi yöntemlerini anlaşılır bir dille
            anlattık.
          </p>
        </div>
      </section>

      {/* Pektus Ekskavatum */}
      <section className="container py-14" id="ekskavatum">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <Badge variant="secondary" className="rounded-full mb-3 font-semibold">
              Pektus Ekskavatum
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-4">
              Kunduracı Göğsü <span className="text-primary">(İçe Çökme)</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Pektus ekskavatum, göğüs kemiğinin (sternum) ve buna bağlı kaburga kıkırdaklarının
              içe doğru çökmesiyle oluşan, en sık görülen göğüs duvarı şekil bozukluğudur. Halk
              arasında "kunduracı göğsü" olarak bilinir. Çoğunlukla doğuştan gelir ve özellikle
              ergenlik dönemindeki hızlı büyümeyle birlikte belirginleşir; erkeklerde kızlara
              oranla daha sık görülür.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Çoğu vakada sağlık açısından ciddi bir tehlike oluşturmaz; ancak çökme derinleştikçe
              kalp ve akciğerlere baskı yapabilir. Bu nedenle tanı sürecinde kalp, akciğer ve
              omurganın da (skolyoz/kifoz eşlik edebilir) değerlendirilmesi önemlidir.
            </p>
            <h3 className="font-extrabold text-lg mb-3">Sık Görülen Belirtiler</h3>
            <ul className="space-y-2.5 mb-6">
              {[
                "Göğüs ortasında gözle görülür çukurlaşma / içe çökme",
                "Egzersizde çabuk yorulma, nefes darlığı hissi",
                "Çarpıntı veya egzersiz kapasitesinde azalma",
                "Duruş bozukluğu (öne eğik omuzlar)",
                "Görünümden kaynaklanan özgüven kaybı ve sosyal çekingenlik",
              ].map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <Card className="rounded-3xl overflow-hidden sticky top-28">
            <div className="aspect-[4/3] bg-secondary">
              <img
                src={PRODUCT_IMAGES.vakum}
                alt="Vakum bell cihazları"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Wind className="h-5 w-5 text-primary" />
                <h3 className="font-extrabold text-lg">Tedavi: Vakum Bell (Vakum Tedavisi)</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Vakum bell, pektus ekskavatumun bilinen tek ameliyatsız tedavi yöntemidir. Göğse
                yerleştirilen medikal silikon çan, el pompasıyla oluşturulan kontrollü negatif
                basınç sayesinde çökük göğüs kemiğini dışarı doğru çeker ve zamanla doğru pozisyona
                yerleşmesini destekler.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Cihaz genellikle günde iki kez, en az 30 dakika kullanılır ve süre doktor önerisiyle
                kademeli olarak artırılır. Tedavi ortalama 12-18 ay sürer; en iyi sonuçlar simetrik
                ve hafif-orta dereceli deformitesi olan genç hastalarda (özellikle 15 yaş altı)
                elde edilir.
              </p>
              <Link href="/urun/vakum-bell-cihazi">
                <Button className="w-full rounded-full font-bold">
                  Vakum Bell Ürününü İncele <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pektus Karinatum */}
      <section className="bg-accent/40 py-14" id="karinatum">
        <div className="container grid lg:grid-cols-2 gap-10 items-start">
          <Card className="rounded-3xl overflow-hidden order-2 lg:order-1 sticky top-28">
            <div className="aspect-[4/3] bg-secondary">
              <img
                src={PRODUCT_IMAGES.ortez}
                alt="Pektus karinatum ortezi"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Wind className="h-5 w-5 text-primary" />
                <h3 className="font-extrabold text-lg">Tedavi: Kompresyon Ortezi</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Ortez tedavisi, pektus karinatumda özellikle 17 yaş altı ve göğüs duvarı esnekliği
                devam eden hastalarda oldukça başarılıdır. Ayarlanabilir kayışlı ortez, ön ve arka
                yumuşak pedleriyle göğüs kemiğine kontrollü baskı uygulayarak göğüs duvarını
                zamanla normal şekline yönlendirir.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Ortezin doktor önerisine göre günün büyük bölümünde takılması gerekir; tedavi
                genellikle 12-18 ay sürer. Tedaviye eşlik eden egzersiz ve fizyoterapi başarıyı
                artırır. Kaliteli ve pedli ortezler cilt tahrişi riskini en aza indirir.
              </p>
              <Link href="/urun/pektus-karinatum-ortezi">
                <Button className="w-full rounded-full font-bold">
                  Ortez Ürününü İncele <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          <div className="order-1 lg:order-2">
            <Badge variant="secondary" className="rounded-full mb-3 font-semibold">
              Pektus Karinatum
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-4">
              Güvercin Göğsü <span className="text-primary">(Dışa Çıkıklık)</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Pektus karinatum, göğüs kemiğinin ve kaburga kıkırdaklarının dışa doğru çıkıntı
              yapmasıyla oluşan, ikinci en sık görülen göğüs duvarı şekil bozukluğudur. Halk
              arasında "güvercin göğsü" olarak bilinir. Genellikle ergenlik dönemindeki hızlı
              büyüme sırasında fark edilir ve büyüme tamamlanana kadar ilerleyebilir.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Karinatum çoğunlukla kalp-akciğer işlevlerini etkilemez; asıl etkisi görünüm ve buna
              bağlı psikososyal zorluklar üzerinedir. İyi haber şu ki, kemikler henüz büyümekteyken
              başlanan ortez tedavisiyle ameliyata gerek kalmadan çok başarılı sonuçlar alınabilir.
            </p>
            <h3 className="font-extrabold text-lg mb-3">Sık Görülen Belirtiler</h3>
            <ul className="space-y-2.5 mb-6">
              {[
                "Göğüs kemiğinin öne/dışa doğru belirgin çıkıntısı",
                "Göğüs duvarında hassasiyet veya dokunmaya duyarlılık",
                "Bazı hastalarda tek taraflı (asimetrik) çıkıntı",
                "Nadir olarak egzersizde nefes darlığı hissi",
                "Görünüm kaynaklı özgüven ve beden algısı sorunları",
              ].map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Tedavi karşılaştırma */}
      <section className="container py-14">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-8">
          Hangi Tedavi Hangi Durumda?
        </h2>
        <div className="overflow-x-auto rounded-3xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="text-left p-4 font-bold"> </th>
                <th className="text-left p-4 font-bold">Vakum Bell Tedavisi</th>
                <th className="text-left p-4 font-bold">Ortez Tedavisi</th>
              </tr>
            </thead>
            <tbody className="bg-card">
              {[
                ["Hangi durumda?", "Pektus ekskavatum (içe çökme)", "Pektus karinatum (dışa çıkıklık)"],
                ["Nasıl çalışır?", "Negatif basınçla göğüs kemiğini dışarı çeker", "Kontrollü baskıyla göğüs kemiğini içeri yönlendirir"],
                ["İdeal yaş aralığı", "Özellikle 15 yaş altı (erişkinlerde de kullanılabilir)", "Özellikle 17 yaş altı, göğüs duvarı esnekken"],
                ["Günlük kullanım", "Günde 2 kez, 30-60 dk (kademeli artırılır)", "Doktor önerisine göre günün büyük bölümü"],
                ["Ortalama süre", "12-18 ay", "12-18 ay (bazı durumlarda 2 yıla kadar)"],
                ["Destekleyici öneri", "Düzenli doktor takibi, nefes egzersizleri", "Fizyoterapi, egzersiz, cilt koruyucu krem"],
              ].map(row => (
                <tr key={row[0]} className="border-t border-border">
                  <td className="p-4 font-bold whitespace-nowrap">{row[0]}</td>
                  <td className="p-4 text-muted-foreground">{row[1]}</td>
                  <td className="p-4 text-muted-foreground">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 rounded-3xl bg-accent/60 border border-primary/20 p-6 flex gap-4 items-start">
          <AlertTriangle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
          <p className="text-sm leading-relaxed text-foreground/80">
            <strong>Önemli uyarı:</strong> Bu sayfadaki bilgiler genel bilgilendirme amaçlıdır ve
            tıbbi tavsiye yerine geçmez. Vakum bell ve ortez tedavisine başlamadan önce mutlaka bir
            göğüs cerrahisi uzmanına danışın; cihaz boyutu ve kullanım programı doktorunuz
            tarafından belirlenmelidir. İskelet sistemi bozuklukları, kanama bozuklukları veya kalp
            problemi olan hastalarda vakum tedavisi uygun olmayabilir.
          </p>
        </div>

        <div className="mt-10 text-center">
          <Link href="/urunler">
            <Button size="lg" className="rounded-full px-8 font-bold">
              Tedavi Ürünlerini İncele <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
