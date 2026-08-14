import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import Home from '@/pages/Home';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsConditions from '@/pages/TermsConditions';
import GalleryManagement from '@/pages/Admin/GalleryManagement';
import ReducedScrollSpeed from '@/components/ReducedScrollSpeed';
// Add page imports here

const BACKEND_ADMIN_URL = "https://gjevents-bfjz.onrender.com";

const routerBasename =
  typeof window !== "undefined" &&
  window.location.hostname === "gjevents.github.io" &&
  window.location.pathname.toLowerCase().startsWith("/gjevents")
    ? "/GJEVENTS"
    : "/";

const isStaticPublicSite =
  typeof window !== "undefined" &&
  ["gjevents.in", "www.gjevents.in"].includes(window.location.hostname);

const BackendAdminRedirect = () => {
  if (typeof window !== "undefined") {
    window.location.replace(`${BACKEND_ADMIN_URL}${window.location.pathname}${window.location.search}${window.location.hash}`);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
    </div>
  );
};

const AdminAuthGate = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  return <GalleryManagement />;
};


function App() {

  return (
    <QueryClientProvider client={queryClientInstance}>
      <ReducedScrollSpeed />
      <Router basename={routerBasename}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<Home />} />
          <Route path="/events" element={<Home />} />
          <Route path="/services" element={<Home />} />
          <Route path="/collaborate" element={<Home />} />
          <Route path="/contact" element={<Home />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route
            path="/admin/gallery"
            element={
              isStaticPublicSite ? (
                <BackendAdminRedirect />
              ) : (
                <AuthProvider>
                  <AdminAuthGate />
                </AuthProvider>
              )
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
