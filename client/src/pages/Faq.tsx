import SiteLayout from "@/components/SiteLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

const FAQ_GROUPS: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "Vakum Bell Tedavisi",
    items: [
      {
        q: "Vakum bell tedavisi nedir ve nasıl çalışır?",
        a: "Vakum bell, pektus ekskavatumun (kunduracı göğsü) bilinen tek ameliyatsız tedavi yöntemidir. Göğse yerleştirilen medikal silikon çan, el pompasıyla oluşturulan negatif basınç sayesinde çökük göğüs kemiğini dışarı doğru çeker. Düzenli kullanımla göğüs kemiği zamanla doğru pozisyona yerleşir.",
      },
      {
        q: "Vakum bell günde ne kadar kullanılmalı?",
        a: "Başlangıçta genellikle günde iki kez, en az 30 dakika kullanılması önerilir; ilk dönemde toplam süre günde 1 saati aşmamalıdır. Vücut alıştıkça doktorunuzun önerisiyle süre kademeli olarak artırılabilir. Kullanım programınız mutlaka takip eden hekiminiz tarafından belirlenmelidir.",
      },
      {
        q: "Vakum tedavisi ne kadar sürer, sonuç ne zaman görülür?",
        a: "Tedavi süresi deformitenin derinliğine, yaşa ve düzenli kullanıma bağlı olarak değişir; ortalama 12-18 ay sürer. İlk görsel iyileşmeler genellikle birkaç ay içinde fark edilir, ancak kalıcı sonuç için tedaviye düzenli devam edilmesi gerekir.",
      },
      {
        q: "Vakum bell kimler için uygundur, kimler kullanmamalı?",
        a: "En iyi sonuçlar simetrik, hafif-orta dereceli deformitesi olan ve büyümesi devam eden hastalarda (özellikle 15 yaş altı) alınır. İskelet sistemi bozukluğu, kanama/pıhtılaşma bozukluğu (koagülopati), damar hastalığı veya kalp problemi olan hastalarda kullanılmamalıdır. Tedaviye başlamadan önce mutlaka doktora danışılmalıdır.",
      },
      {
        q: "Vakum bell kullanırken yan etki olur mu?",
        a: "Uygulama sırasında ciltte geçici kızarıklık, noktasal ciltaltı kanamalar, hafif sırt ağrısı veya kollarda geçici uyuşma görülebilir. Bu etkiler genellikle geçicidir. Şiddetli ağrı veya alışılmadık bir durum fark ederseniz kullanımı durdurup doktorunuza başvurun.",
      },
      {
        q: "Hangi boyutta vakum bell seçmeliyim?",
        a: "Cihaz boyutu; yaşa, göğüs ölçüsüne ve deformitenin tipine göre seçilir. Sitemizde XS'ten L'ye kadar boyutlar ve asimetrik deformiteler için özel form mevcuttur. Emin değilseniz sipariş öncesi bize iletişim sayfasından yazın; doktorunuzun önerisiyle birlikte size uygun boyutu belirlemenize yardımcı olalım.",
      },
    ],
  },
  {
    title: "Ortez Tedavisi",
    items: [
      {
        q: "Ortez tedavisi nedir ve kimler için uygundur?",
        a: "Ortez tedavisi, pektus karinatumda (güvercin göğsü) göğüs kemiğine kontrollü baskı uygulayarak göğüs duvarını normal şekline yönlendiren ameliyatsız bir tedavi yöntemidir. Özellikle 17 yaş altı, göğüs duvarı esnekliği devam eden hastalarda yüksek başarı oranına sahiptir.",
      },
      {
        q: "Ortez günde kaç saat takılmalı?",
        a: "Kullanım süresi tedavi planına göre değişir; birçok uzman günün büyük bölümünde (bazı protokollerde 23 saate varan sürelerde) takılmasını önerir. Doktorunuz deformitenizin şiddetine göre günlük kullanım hedefinizi belirleyecektir. Düzenli kullanım, tedavi başarısının anahtarıdır.",
      },
      {
        q: "Ortez tedavisi ne kadar sürer?",
        a: "Ortalama tedavi süresi 12-18 aydır; bazı durumlarda 2 yıla kadar uzayabilir. Süreç doktor kontrolleriyle takip edilir ve baskı ayarları ilerlemeye göre güncellenir.",
      },
      {
        q: "Ortez ciltte tahriş yapar mı?",
        a: "Kaliteli ve yumuşak pedli ortezlerde tahriş riski düşüktür; yine de uzun süreli kullanımlarda temas bölgelerinde kızarıklık olabilir. Cilt koruyucu krem kullanmak ve pedlerin temizliğine dikkat etmek tahrişi önlemeye yardımcı olur. Ortezimiz ayarlanabilir kayışları ve yumuşak pedleriyle konforlu kullanım için tasarlanmıştır.",
      },
      {
        q: "Ortezle spor yapılabilir mi?",
        a: "Doktorunuzun önerisine göre spor sırasında ortez çıkarılabilir. Hatta yüzme, esneme ve nefes egzersizleri gibi aktiviteler tedaviyi destekler. Fizyoterapi eşliğinde yapılan egzersizler tedavi başarısını artırır.",
      },
    ],
  },
  {
    title: "Sipariş ve Teslimat",
    items: [
      {
        q: "Siparişimi nasıl oluşturabilirim?",
        a: "Ürünler sayfasından size uygun ürünü ve boyutu seçip sepete ekleyin. Sepet sayfasında ad, adres, telefon ve e-posta bilgilerinizi doldurup güvenli online ödeme adımına geçebilirsiniz. Ödemeniz onaylandığında sipariş numaranız e-posta adresinize iletilir.",
      },
      {
        q: "Ödeme yöntemleri nelerdir, ödeme güvenli mi?",
        a: "Ödemeleriniz uluslararası güvenlik standartlarına sahip Stripe altyapısıyla kredi kartı veya banka kartıyla alınır. Kart bilgileriniz bizim sunucularımızda saklanmaz; tüm işlem şifreli bağlantı üzerinden gerçekleşir.",
      },
      {
        q: "Kargo süresi ne kadar?",
        a: "Siparişler ödeme onayından sonra 1-3 iş günü içinde kargoya verilir ve Türkiye genelinde genellikle 2-4 iş günü içinde teslim edilir. Siparişinizin durumunu sipariş numaranızla takip edebilirsiniz.",
      },
      {
        q: "Yanlış boyut sipariş ettim, değiştirebilir miyim?",
        a: "Kullanılmamış ve ambalajı açılmamış ürünlerde boyut değişimi yapıyoruz. Teslimattan sonra 14 gün içinde iletişim sayfamızdan bize ulaşmanız yeterlidir. Hijyen gerekçesiyle kullanılmış ürünlerde değişim yapılamamaktadır.",
      },
    ],
  },
];

export default function Faq() {
  return (
    <SiteLayout>
      <section className="bg-accent/50 py-12 sm:py-16">
        <div className="container text-center max-w-3xl mx-auto">
          <Badge className="mb-4 bg-primary/10 text-primary rounded-full px-4 py-1.5 font-bold">
            SSS
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold">Sıkça Sorulan Sorular</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Vakum bell ve ortez tedavisi hakkında en çok merak edilen soruları sizin için yanıtladık.
            Sorunuzun cevabını bulamazsanız bize yazmaktan çekinmeyin.
          </p>
        </div>
      </section>

      <section className="container py-12 max-w-3xl mx-auto">
        {FAQ_GROUPS.map(group => (
          <div key={group.title} className="mb-10">
            <h2 className="text-xl sm:text-2xl font-extrabold mb-4 text-primary">{group.title}</h2>
            <Accordion type="single" collapsible className="space-y-3">
              {group.items.map((item, idx) => (
                <AccordionItem
                  key={idx}
                  value={`${group.title}-${idx}`}
                  className="bg-card rounded-2xl border border-border px-5 data-[state=open]:shadow-md">
                  <AccordionTrigger className="font-bold text-left hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}

        <div className="rounded-3xl bg-primary text-primary-foreground p-8 text-center">
          <h2 className="text-xl font-extrabold mb-2">Başka sorunuz mu var?</h2>
          <p className="opacity-90 mb-5 text-sm">
            Abla her zaman burada! İletişim formundan yazın, en kısa sürede dönüş yapalım.
          </p>
          <Link href="/iletisim">
            <Button variant="secondary" className="rounded-full font-bold">
              İletişime Geç <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}

