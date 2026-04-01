/*
 * YING-LI TEA — CART SECTION COMPONENT
 * Design: Zen Modernism — clean, minimal cart display
 * Shows added items, quantities, prices, and total
 */
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Trash2, Minus, Plus } from "lucide-react";
import { useLocation } from "wouter";

export default function CartSection() {
  const { items, removeItem, updateQuantity, total } = useCart();
  const { language } = useLanguage();
  const { formatPrice, convertPrice } = useCurrency();
  const [, navigate] = useLocation();

  return (
    <section
      id="cart"
      className="py-16 md:py-24 bg-[#FAFAF7]"
    >
      <div className="container">
        {/* Header */}
        <div className="mb-12">
          <h2
            className="font-['Playfair_Display'] font-400 mb-2"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "oklch(0.265 0.015 55)",
              letterSpacing: "-0.01em",
            }}
          >
            {language === "en" ? "Shopping Cart" : "購物車"}
          </h2>
          <div
            className="w-12 h-px"
            style={{ background: "oklch(0.500 0.060 145)" }}
          />
        </div>

        {/* Cart Items */}
        {items.length === 0 ? (
          <div className="text-center py-12">
            <p
              className="font-['Lato'] text-lg"
              style={{ color: "oklch(0.552 0.016 285.938)" }}
            >
              {language === "en" ? "Your cart is empty" : "您的購物車是空的"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded"
                    style={{ borderColor: "oklch(0.870 0.018 130)" }}
                  >
                    <div className="flex-1">
                      <h3
                        className="font-['Lato'] font-500 mb-1"
                        style={{ color: "oklch(0.265 0.015 55)" }}
                      >
                        {item.name}
                      </h3>
                      <p
                        className="text-sm font-['Lato']"
                        style={{ color: "oklch(0.552 0.016 285.938)" }}
                      >
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mx-4">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded hover:bg-gray-100 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} style={{ color: "oklch(0.400 0.015 55)" }} />
                      </button>
                      <span
                        className="w-8 text-center font-['Lato'] font-500"
                        style={{ color: "oklch(0.265 0.015 55)" }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded hover:bg-gray-100 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} style={{ color: "oklch(0.400 0.015 55)" }} />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right min-w-[100px]">
                      <p
                        className="font-['Lato'] font-500"
                        style={{ color: "oklch(0.265 0.015 55)" }}
                      >
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-4 p-2 rounded hover:bg-red-50 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} style={{ color: "oklch(0.577 0.245 27.325)" }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div
                className="p-6 rounded"
                style={{ background: "oklch(0.967 0.001 286.375)" }}
              >
                <h3
                  className="font-['Lato'] font-600 mb-4"
                  style={{ color: "oklch(0.265 0.015 55)" }}
                >
                  {language === "en" ? "Order Summary" : "訂單摘要"}
                </h3>

                <div className="space-y-3 mb-6 pb-6" style={{ borderBottom: "1px solid oklch(0.870 0.018 130)" }}>
                  <div className="flex justify-between">
                    <span className="font-['Lato']" style={{ color: "oklch(0.552 0.016 285.938)" }}>
                      {language === "en" ? "Subtotal" : "小計"}
                    </span>
                    <span className="font-['Lato'] font-500" style={{ color: "oklch(0.265 0.015 55)" }}>
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-['Lato']" style={{ color: "oklch(0.552 0.016 285.938)" }}>
                      {language === "en" ? "Shipping" : "運費"}
                    </span>
                    <span className="font-['Lato'] font-500" style={{ color: "oklch(0.265 0.015 55)" }}>
                      {language === "en" ? "Free" : "免費"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between mb-6">
                  <span className="font-['Lato'] font-600" style={{ color: "oklch(0.265 0.015 55)" }}>
                    總計
                  </span>
                  <span
                    className="font-['Playfair_Display'] font-600"
                    style={{ fontSize: "1.5rem", color: "oklch(0.500 0.060 145)" }}
                  >
                    {formatPrice(convertPrice(total))}
                  </span>
                </div>

                <button
                  className="w-full py-3 rounded font-['Lato'] font-500 tracking-wide transition-all duration-300 flex items-center justify-center gap-2"
                  style={{ background: "oklch(0.500 0.060 145)", color: "#FAFAF7", cursor: "pointer" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.9"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                  onClick={() => navigate("/checkout")}
                >
                  前往結帳
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
