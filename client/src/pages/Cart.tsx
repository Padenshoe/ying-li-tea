/*
 * YING-LI TEA — SHOPPING CART PAGE
 * Full cart display with item management and checkout
 */
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { Link } from "wouter";

export default function Cart() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const { formatPrice, convertPrice } = useCurrency();
  const { language, t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const checkoutMutation = trpc.stripe.createCheckout.useMutation();

  const convertedTotal = convertPrice(total);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      alert(language === "en" ? "Please log in to checkout" : "請登入以進行結帳");
      return;
    }

    setIsCheckingOut(true);
    try {
      const response = await checkoutMutation.mutateAsync({
        items: items.map((item) => ({
          productId: parseInt(item.id),
          quantity: item.quantity,
          name: item.name,
          price: item.price,
        })),
        origin: window.location.origin,
      });

      if (response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert(language === "en" ? "Checkout failed. Please try again." : "結帳失敗。請重試。");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20" style={{ background: "oklch(0.990 0.004 95)" }}>
      <div className="container max-w-6xl">
        {/* Page Header */}
        <div className="mb-12">
          <h1
            className="font-['Playfair_Display'] font-400 mb-2"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "oklch(0.265 0.015 55)",
              letterSpacing: "-0.01em",
            }}
          >
            {language === "en" ? "Shopping Cart" : "購物車"}
          </h1>
          <div
            className="w-12 h-0.5"
            style={{ background: "oklch(0.500 0.060 145)" }}
          />
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p
              className="font-['Lato'] text-lg mb-6"
              style={{ color: "oklch(0.552 0.016 285.938)" }}
            >
              {language === "en" ? "Your cart is empty" : "您的購物車是空的"}
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 rounded font-['Lato'] font-500 transition-all duration-300"
              style={{
                background: "oklch(0.500 0.060 145)",
                color: "#FAFAF7",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = "1";
              }}
            >
              {language === "en" ? "Continue Shopping" : "繼續購物"}
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2">
              <div
                className="rounded-lg p-6"
                style={{ background: "#FAFAF7", border: "1px solid oklch(0.870 0.018 130)" }}
              >
                <h2
                  className="font-['Lato'] font-600 mb-6"
                  style={{ color: "oklch(0.265 0.015 55)" }}
                >
                  {language === "en" ? "Items" : "商品"} ({items.length})
                </h2>

                <div className="space-y-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 pb-6"
                      style={{ borderBottom: "1px solid oklch(0.870 0.018 130)" }}
                    >
                      {/* Product Image */}
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded"
                        />
                      )}

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3
                          className="font-['Lato'] font-600 mb-2"
                          style={{ color: "oklch(0.265 0.015 55)" }}
                        >
                          {item.nameKey ? t(item.nameKey) : item.name}
                        </h3>
                        <p
                          className="font-['Lato'] text-sm mb-4"
                          style={{ color: "oklch(0.552 0.016 285.938)" }}
                        >
                          {formatPrice(convertPrice(item.price))} {language === "en" ? "each" : "每件"}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 rounded border transition-colors"
                            style={{
                              borderColor: "oklch(0.870 0.018 130)",
                              color: "oklch(0.265 0.015 55)",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.background = "oklch(0.950 0.005 90)";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.background = "transparent";
                            }}
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-['Lato'] font-600">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 rounded border transition-colors"
                            style={{
                              borderColor: "oklch(0.870 0.018 130)",
                              color: "oklch(0.265 0.015 55)",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.background = "oklch(0.950 0.005 90)";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.background = "transparent";
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Item Total & Remove */}
                      <div className="text-right">
                        <p
                          className="font-['Lato'] font-600 mb-4"
                          style={{ color: "oklch(0.500 0.060 145)" }}
                        >
                          {formatPrice(convertPrice(item.price * item.quantity))}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-sm px-3 py-1 rounded transition-colors"
                          style={{
                            background: "oklch(0.577 0.245 27.325 / 0.1)",
                            color: "oklch(0.577 0.245 27.325)",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "oklch(0.577 0.245 27.325 / 0.2)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "oklch(0.577 0.245 27.325 / 0.1)";
                          }}
                        >
                          {language === "en" ? "Remove" : "移除"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping */}
                <Link
                  href="/"
                  className="inline-block mt-6 px-6 py-2 rounded font-['Lato'] font-500 transition-all duration-300"
                  style={{
                    background: "transparent",
                    border: "1px solid oklch(0.500 0.060 145)",
                    color: "oklch(0.500 0.060 145)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "oklch(0.500 0.060 145 / 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {language === "en" ? "← Continue Shopping" : "← 繼續購物"}
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div
                className="rounded-lg p-6 sticky top-32"
                style={{ background: "#FAFAF7", border: "1px solid oklch(0.870 0.018 130)" }}
              >
                <h3
                  className="font-['Lato'] font-600 mb-6"
                  style={{ color: "oklch(0.265 0.015 55)" }}
                >
                  {language === "en" ? "Order Summary" : "訂單摘要"}
                </h3>

                {/* Subtotal */}
                <div className="flex justify-between mb-4 pb-4" style={{ borderBottom: "1px solid oklch(0.870 0.018 130)" }}>
                  <span className="font-['Lato']" style={{ color: "oklch(0.552 0.016 285.938)" }}>
                    {language === "en" ? "Subtotal" : "小計"}
                  </span>
                  <span className="font-['Lato'] font-600" style={{ color: "oklch(0.265 0.015 55)" }}>
                    {formatPrice(convertedTotal)}
                  </span>
                </div>

                {/* Shipping Note */}
                <div className="mb-6 p-3 rounded" style={{ background: "oklch(0.950 0.005 90)" }}>
                  <p className="font-['Lato'] text-xs" style={{ color: "oklch(0.552 0.016 285.938)" }}>
                    {language === "en"
                      ? "Shipping & taxes calculated at checkout"
                      : "運費和稅金將在結帳時計算"}
                  </p>
                </div>

                {/* Total */}
                <div className="flex justify-between mb-6 pb-6" style={{ borderBottom: "1px solid oklch(0.870 0.018 130)" }}>
                  <span className="font-['Lato'] font-600" style={{ color: "oklch(0.265 0.015 55)" }}>
                    {language === "en" ? "Total" : "總計"}
                  </span>
                  <span className="font-['Playfair_Display'] font-400 text-xl" style={{ color: "oklch(0.500 0.060 145)" }}>
                    {formatPrice(convertedTotal)}
                  </span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-3 rounded font-['Lato'] font-600 transition-all duration-300 disabled:opacity-50"
                  style={{
                    background: "oklch(0.500 0.060 145)",
                    color: "#FAFAF7",
                  }}
                  onMouseEnter={(e) => {
                    if (!isCheckingOut) (e.currentTarget as HTMLElement).style.opacity = "0.9";
                  }}
                  onMouseLeave={(e) => {
                    if (!isCheckingOut) (e.currentTarget as HTMLElement).style.opacity = "1";
                  }}
                >
                  {isCheckingOut
                    ? language === "en"
                      ? "Processing..."
                      : "處理中..."
                    : language === "en"
                    ? "Proceed to Checkout"
                    : "進行結帳"}
                </button>

                {/* Clear Cart */}
                <button
                  onClick={() => {
                    if (confirm(language === "en" ? "Clear cart?" : "清空購物車?")) {
                      clearCart();
                    }
                  }}
                  className="w-full mt-3 py-2 rounded font-['Lato'] font-500 text-sm transition-all duration-300"
                  style={{
                    background: "transparent",
                    border: "1px solid oklch(0.870 0.018 130)",
                    color: "oklch(0.552 0.016 285.938)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "oklch(0.950 0.005 90)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {language === "en" ? "Clear Cart" : "清空購物車"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
