import SiteLayout from "@/components/SiteLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { BRAND } from "@shared/products";
import { Instagram, Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const sendMutation = trpc.contact.send.useMutation({
    onSuccess: () => {
      toast.success("Mesajınız alındı! En kısa sürede size dönüş yapacağız.");
      setForm({ name: "", email: "", phone: "", message: "" });
    },
    onError: err => toast.error(err.message || "Mesaj gönderilemedi, lütfen tekrar deneyin."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMutation.mutate({
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      message: form.message,
    });
  };

  return (
    <SiteLayout>
      <section className="bg-accent/50 py-12 sm:py-16">
        <div className="container text-center max-w-3xl mx-auto">
          <Badge className="mb-4 bg-primary/10 text-primary rounded-full px-4 py-1.5 font-bold">
            İletişim
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold">Bize Ulaşın</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Ürünlerimiz, boyut seçimi veya siparişiniz hakkında her türlü sorunuz için buradayız.
          </p>
        </div>
      </section>

      <section className="container py-12">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-8 max-w-5xl mx-auto">
          <div className="space-y-4">
            {[
              { icon: Phone, title: "Telefon", value: BRAND.phone, href: `tel:${BRAND.phone.replace(/[^+\d]/g, "")}` },
              { icon: Mail, title: "E-posta", value: BRAND.email, href: `mailto:${BRAND.email}` },
              { icon: Instagram, title: "Instagram", value: "@pektusabla", href: BRAND.instagram },
              { icon: MapPin, title: "Adres", value: BRAND.address },
            ].map(item => (
              <Card key={item.title} className="rounded-3xl">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                      {item.title}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                        className="font-bold hover:text-primary transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="font-bold">{item.value}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            <Card className="rounded-3xl bg-primary text-primary-foreground">
              <CardContent className="p-5">
                <p className="font-extrabold mb-1">Boyut seçiminde kararsız mısınız?</p>
                <p className="text-sm opacity-90">
                  Doktorunuzun önerisini ve yaş/göğüs ölçüsü bilgilerinizi formdan iletin, size en
                  uygun ürünü birlikte belirleyelim.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-3xl">
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-xl font-extrabold mb-6">İletişim Formu</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="name" className="font-bold mb-2 block">
                      Ad Soyad *
                    </Label>
                    <Input
                      id="name"
                      required
                      minLength={2}
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Adınız Soyadınız"
                      className="rounded-xl h-11 bg-background"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="font-bold mb-2 block">
                      Telefon
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="05xx xxx xx xx"
                      className="rounded-xl h-11 bg-background"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="font-bold mb-2 block">
                    E-posta *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="ornek@eposta.com"
                    className="rounded-xl h-11 bg-background"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="font-bold mb-2 block">
                    Mesajınız *
                  </Label>
                  <Textarea
                    id="message"
                    required
                    minLength={10}
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Sorunuzu veya mesajınızı yazın..."
                    className="rounded-xl bg-background"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={sendMutation.isPending}
                  className="w-full rounded-full font-bold">
                  {sendMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Mesajı Gönder
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </SiteLayout>
  );
}

