import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  productId: number;
  variantId: number | null;
  productName: string;
  variantName: string | null;
  unitPrice: number;
  quantity: number;
  imageUrl: string | null;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: number, variantId: number | null) => void;
  updateQuantity: (productId: number, variantId: number | null, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
  totalCount: number;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "pektus-abla-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage unavailable; ignore
    }
  }, [items]);

  const addItem = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(
        i => i.productId === item.productId && i.variantId === item.variantId,
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const removeItem = (productId: number, variantId: number | null) => {
    setItems(prev => prev.filter(i => !(i.productId === productId && i.variantId === variantId)));
  };

  const updateQuantity = (productId: number, variantId: number | null, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, variantId);
      return;
    }
    setItems(prev =>
      prev.map(i =>
        i.productId === productId && i.variantId === variantId ? { ...i, quantity } : i,
      ),
    );
  };

  const clearCart = () => setItems([]);

  const { totalAmount, totalCount } = useMemo(() => {
    return {
      totalAmount: items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
      totalCount: items.reduce((sum, i) => sum + i.quantity, 0),
    };
  }, [items]);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalAmount, totalCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
