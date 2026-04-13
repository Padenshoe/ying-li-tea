import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CartProvider } from "./contexts/CartContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutCancel from "./pages/CheckoutCancel";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import BackToTop from "./components/BackToTop";
import ProductsPage from "./pages/Products";
import TeaQuizPage from "./pages/TeaQuiz";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/cart"} component={Cart} />
      <Route path={"/checkout/success"} component={CheckoutSuccess} />
      <Route path={"/checkout/cancel"} component={CheckoutCancel} />
      <Route path={"/orders"} component={Orders} />
      <Route path={"/checkout"} component={Checkout} />
      <Route path={"/order-confirmation"} component={OrderConfirmation} />
      <Route path={"/products"} component={ProductsPage} />
      <Route path={"/tea-quiz"} component={TeaQuizPage} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
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