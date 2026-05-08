import React, { useEffect, useState } from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { CartSidebar } from './components/client/CartSidebar';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Simple client-side router
function useRouter() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleNavigation = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleNavigation);

    // Intercept link clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      if (anchor && anchor.href && anchor.href.startsWith(window.location.origin)) {
        e.preventDefault();
        const url = new URL(anchor.href);
        window.history.pushState({}, '', url.pathname + url.search);
        setPath(url.pathname);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('popstate', handleNavigation);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return path;
}

function Router() {
  const path = useRouter();

  // Admin routes
  if (path === '/admin') {
    return <AdminLoginPage />;
  }

  if (path === '/admin/dashibodi') {
    return <AdminDashboardPage />;
  }

  // Client routes with layout
  const renderClientPage = () => {
    if (path === '/' || path === '') {
      return <HomePage />;
    }

    if (path === '/bidhaa') {
      return <ProductsPage />;
    }

    if (path === '/malipo') {
      return <CheckoutPage />;
    }

    // 404 - Redirect to home
    return <HomePage />;
  };

  return (
    <>
      <Header />
      {renderClientPage()}
      <CartSidebar />
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Mkwazu Hardware</h3>
              <p className="text-gray-400">
                Duka la Mkwazu Hardware lenye ubora wa hali ya juu. Tunasafirisha kila mahali Tanzania.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Mawasiliano</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Simu: +255 123 456 789</li>
                <li>Email: info@vifaavyaujenzi.co.tz</li>
                <li>Dar es Salaam, Tanzania</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Viungo vya Haraka</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="text-gray-400 hover:text-white transition-colors">
                    Nyumbani
                  </a>
                </li>
                <li>
                  <a href="/bidhaa" className="text-gray-400 hover:text-white transition-colors">
                    Bidhaa
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 Mkwazu Hardware. Haki zote zimehifadhiwa.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Router />
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
