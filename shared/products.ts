/** Marka görselleri ve site sabitleri */
export const BRAND = {
  name: "Pektus Abla",
  slogan: "Pektus'lu Çocukların Ablası",
  logoUrl: "/manus-storage/pektus-abla-logo_b99c9be9.png",
  phone: "+90 (555) 123 45 67",
  email: "info@pektusabla.com",
  address: "İstanbul, Türkiye",
  instagram: "https://www.instagram.com/pektusabla",
} as const;

export const PRODUCT_IMAGES = {
  vakum: "/manus-storage/vakum-cihazlari_8c6de310.jpg",
  ortez: "/manus-storage/ortez_8dfd82f4.jpg",
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  odeme_bekliyor: "Ödeme Bekliyor",
  odendi: "Ödendi",
  hazirlaniyor: "Hazırlanıyor",
  kargoda: "Kargoda",
  teslim_edildi: "Teslim Edildi",
  iptal: "İptal",
};

export function formatTL(amount: number | string): string {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(n);
}
