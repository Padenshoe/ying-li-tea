import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  id: string;
  cartKey: string;    // Unique key for this cart entry: id + '::' + (teaChoice ?? '') — used for remove/update
  name: string;       // Resolved display name (kept for fallback)
  nameKey?: string;   // Translation key — used to re-translate on language change
  teaChoice?: string; // Selected tea option label (for gift boxes with tea selection)
  price: number;
  quantity: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (cartKey: string) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CART_STORAGE_KEY = "ying-li-tea-cart";
const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Initialize from localStorage on first render
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (!stored) return [];
      const parsed: CartItem[] = JSON.parse(stored);
      // Backfill cartKey for items stored before this field was added
      return parsed.map((item) => ({
        ...item,
        cartKey: item.cartKey ?? (item.id + "::" + (item.teaChoice ?? "")),
      }));
    } catch {
      return [];
    }
  });

  // Persist to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage errors
    }
  }, [items]);

  const addItem = (newItem: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.cartKey === newItem.cartKey);
      if (existingItem) {
        return prevItems.map((item) =>
          item.cartKey === newItem.cartKey
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...prevItems, newItem];
    });
  };

  const removeItem = (cartKey: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.cartKey !== cartKey));
  };

  const updateQuantity = (cartKey: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartKey);
    } else {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.cartKey === cartKey ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
