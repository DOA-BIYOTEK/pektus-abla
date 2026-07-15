import { useAuth } from "@/_core/hooks/useAuth";
import SiteLayout from "@/components/SiteLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { formatTL, ORDER_STATUS_LABELS } from "@shared/products";
import { Eye, Loader2, Lock, Mail, MailOpen, PackageSearch, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { startLogin } from "@/const";

const STATUS_COLORS: Record<string, string> = {
  odeme_bekliyor: "bg-amber-100 text-amber-800",
  odendi: "bg-green-100 text-green-800",
  hazirlaniyor: "bg-blue-100 text-blue-800",
  kargoda: "bg-violet-100 text-violet-800",
  teslim_edildi: "bg-emerald-100 text-emerald-800",
  iptal: "bg-red-100 text-red-800",
};

function OrderDetailDialog({
  orderId,
  onClose,
}: {
  orderId: number | null;
  onClose: () => void;
}) {
  const { data: order, isLoading } = trpc.admin.orderDetail.useQuery(
    { orderId: orderId ?? 0 },
    { enabled: orderId !== null },
  );

  return (
    <Dialog open={orderId !== null} onOpenChange={open => !open && onClose()}>
      <DialogContent className="rounded-3xl max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-extrabold">
            Sipariş Detayı {order ? `— ${order.orderNumber}` : ""}
          </DialogTitle>
        </DialogHeader>
        {isLoading || !order ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">Müşteri</p>
                <p className="font-bold">{order.customerName}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">Telefon</p>
                <p className="font-bold">{order.customerPhone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-bold text-muted-foreground uppercase">E-posta</p>
                <p className="font-bold">{order.customerEmail}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-bold text-muted-foreground uppercase">Adres</p>
                <p>{order.shippingAddress}{order.city ? `, ${order.city}` : ""}</p>
              </div>
              {order.note && (
                <div className="col-span-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase">Not</p>
                  <p>{order.note}</p>
                </div>
              )}
            </div>
            <div className="border border-border rounded-2xl divide-y divide-border">
              {order.items.map(item => (
                <div key={item.id} className="p-3 flex justify-between gap-3">
                  <span>
                    {item.productName}
                    {item.variantName ? ` (${item.variantName})` : ""} × {item.quantity}
                  </span>
                  <span className="font-bold whitespace-nowrap">
                    {formatTL(parseFloat(item.unitPrice) * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="p-3 flex justify-between font-extrabold">
                <span>Toplam</span>
                <span className="text-primary">{formatTL(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  const isAdmin = user?.role === "admin";
  const utils = trpc.useUtils();
  const [detailOrderId, setDetailOrderId] = useState<number | null>(null);

  const { data: orders, isLoading: ordersLoading } = trpc.admin.orders.useQuery(undefined, {
    enabled: isAdmin,
  });
  const { data: messages, isLoading: messagesLoading } = trpc.admin.contactMessages.useQuery(
    undefined,
    { enabled: isAdmin },
  );

  const updateStatus = trpc.admin.updateOrderStatus.useMutation({
    onSuccess: () => {
      toast.success("Sipariş durumu güncellendi");
      utils.admin.orders.invalidate();
    },
    onError: err => toast.error(err.message),
  });

  const markRead = trpc.admin.markMessageRead.useMutation({
    onSuccess: () => utils.admin.contactMessages.invalidate(),
  });

  if (loading) {
    return (
      <SiteLayout>
        <div className="container py-24 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </SiteLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <SiteLayout>
        <div className="container py-24 text-center max-w-md mx-auto">
          <div className="h-20 w-20 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
            <Lock className="h-9 w-9 text-primary" />
          </div>
          <h1 className="text-2xl font-extrabold mb-3">Yönetici Girişi</h1>
          <p className="text-muted-foreground mb-8">
            Admin paneline erişmek için lütfen giriş yapın.
          </p>
          <Button size="lg" className="rounded-full px-8 font-bold" onClick={() => startLogin()}>
            Giriş Yap
          </Button>
        </div>
      </SiteLayout>
    );
  }

  if (!isAdmin) {
    return (
      <SiteLayout>
        <div className="container py-24 text-center max-w-md mx-auto">
          <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="h-9 w-9 text-destructive" />
          </div>
          <h1 className="text-2xl font-extrabold mb-3">Yetkisiz Erişim</h1>
          <p className="text-muted-foreground">
            Bu sayfayı yalnızca yönetici hesapları görüntüleyebilir.
          </p>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="container py-10">
        <Badge className="mb-3 bg-primary/10 text-primary rounded-full px-4 py-1.5 font-bold">
          Yönetim
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8">Admin Paneli</h1>

        <Tabs defaultValue="orders">
          <TabsList className="rounded-full mb-6">
            <TabsTrigger value="orders" className="rounded-full font-bold px-5">
              Siparişler {orders ? `(${orders.length})` : ""}
            </TabsTrigger>
            <TabsTrigger value="messages" className="rounded-full font-bold px-5">
              Mesajlar{" "}
              {messages ? `(${messages.filter(m => !m.isRead).length} yeni)` : ""}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            {ordersLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-24 rounded-3xl" />
                ))}
              </div>
            ) : !orders || orders.length === 0 ? (
              <Card className="rounded-3xl">
                <CardContent className="p-12 text-center text-muted-foreground">
                  <PackageSearch className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Henüz sipariş bulunmuyor.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {orders.map(order => (
                  <Card key={order.id} className="rounded-3xl">
                    <CardContent className="p-5 flex flex-wrap items-center gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-extrabold">{order.orderNumber}</p>
                          <Badge className={`rounded-full font-bold ${STATUS_COLORS[order.status] ?? ""}`}>
                            {ORDER_STATUS_LABELS[order.status] ?? order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {order.customerName} · {order.customerPhone} ·{" "}
                          {new Date(order.createdAt).toLocaleString("tr-TR")}
                        </p>
                      </div>
                      <p className="font-extrabold text-primary whitespace-nowrap">
                        {formatTL(order.totalAmount)}
                      </p>
                      <div className="flex items-center gap-2">
                        <Select
                          value={order.status}
                          onValueChange={value =>
                            updateStatus.mutate({
                              orderId: order.id,
                              status: value as keyof typeof ORDER_STATUS_LABELS & string as
                                | "odeme_bekliyor"
                                | "odendi"
                                | "hazirlaniyor"
                                | "kargoda"
                                | "teslim_edildi"
                                | "iptal",
                            })
                          }>
                          <SelectTrigger className="rounded-full h-10 w-44 bg-card font-semibold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full"
                          onClick={() => setDetailOrderId(order.id)}
                          aria-label="Sipariş detayını gör">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="messages">
            {messagesLoading ? (
              <div className="space-y-3">
                {[1, 2].map(i => (
                  <Skeleton key={i} className="h-24 rounded-3xl" />
                ))}
              </div>
            ) : !messages || messages.length === 0 ? (
              <Card className="rounded-3xl">
                <CardContent className="p-12 text-center text-muted-foreground">
                  <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Henüz mesaj bulunmuyor.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {messages.map(msg => (
                  <Card
                    key={msg.id}
                    className={`rounded-3xl ${!msg.isRead ? "border-primary/40" : ""}`}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-extrabold">{msg.name}</p>
                            {!msg.isRead && (
                              <Badge className="rounded-full bg-primary/10 text-primary font-bold">
                                Yeni
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {msg.email}
                            {msg.phone ? ` · ${msg.phone}` : ""} ·{" "}
                            {new Date(msg.createdAt).toLocaleString("tr-TR")}
                          </p>
                          <p className="text-sm mt-3 leading-relaxed">{msg.message}</p>
                        </div>
                        {!msg.isRead && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full font-bold shrink-0"
                            onClick={() => markRead.mutate({ id: msg.id })}>
                            <MailOpen className="h-4 w-4" /> Okundu
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <OrderDetailDialog orderId={detailOrderId} onClose={() => setDetailOrderId(null)} />
      </section>
    </SiteLayout>
  );
}
