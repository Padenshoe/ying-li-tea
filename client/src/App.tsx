import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CartProvider } from "./contexts/CartContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import BackToTop from "./components/BackToTop";
import { lazy, Suspense } from "react";

// Eagerly load the home page for fastest first paint
import Home from "./pages/Home";

// Lazy-load all other pages to reduce initial bundle size
const Cart = lazy(() => import("./pages/Cart"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess"));
const CheckoutCancel = lazy(() => import("./pages/CheckoutCancel"));
const Orders = lazy(() => import("./pages/Orders"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const ProductsPage = lazy(() => import("./pages/Products"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetail"));
const TeaQuizPage = lazy(() => import("./pages/TeaQuiz"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const EcpayResult = lazy(() => import("./pages/EcpayResult"));
const NotFound = lazy(() => import("./pages/NotFound"));

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: "oklch(0.990 0.004 95)" }}>
    <div className="w-8 h-8 border-2 border-[oklch(0.380_0.070_145)] border-t-transparent rounded-full animate-spin" />
  </div>
);

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Suspense fallback={<PageFallback />}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/cart"} component={Cart} />
        <Route path={"/checkout/success"} component={CheckoutSuccess} />
        <Route path={"/checkout/cancel"} component={CheckoutCancel} />
        <Route path={"/orders"} component={Orders} />
        <Route path={"/checkout"} component={Checkout} />
        <Route path={"/order-confirmation"} component={OrderConfirmation} />
        <Route path={"/products"} component={ProductsPage} />
        <Route path={"/products/:id"} component={ProductDetailPage} />
        <Route path={"/tea-quiz"} component={TeaQuizPage} />
        <Route path={"/refund-policy"} component={RefundPolicy} />
        <Route path={"/checkout/result"} component={EcpayResult} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <CurrencyProvider>
        <CartProvider>
          <LanguageProvider>
            <ThemeProvider
              defaultTheme="light"
              // switchable
            >
              <TooltipProvider>
                <Toaster />
                <Router />
                <BackToTop />
              </TooltipProvider>
            </ThemeProvider>
          </LanguageProvider>
        </CartProvider>
      </CurrencyProvider>
    </ErrorBoundary>
  );
}

export default App;
