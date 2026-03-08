import { Suspense, lazy, useCallback, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute, AdminRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Lazy load non-critical routes
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const ServiceDetailPage = lazy(() => import("./pages/ServiceDetailPage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactsPage = lazy(() => import("./pages/ContactsPage"));
const NewsPage = lazy(() => import("./pages/NewsPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
const MarketplacePage = lazy(() => import("./pages/MarketplacePage"));
const ShopPage = lazy(() => import("./pages/ShopPage"));
const InstallPage = lazy(() => import("./pages/InstallPage"));
const EquipmentPage = lazy(() => import("./pages/EquipmentPage"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminArticles = lazy(() => import("./pages/admin/AdminArticles"));
const AdminMedia = lazy(() => import("./pages/admin/AdminMedia"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminStories = lazy(() => import("./pages/admin/AdminStories"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminListings = lazy(() => import("./pages/admin/AdminListings"));
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageLoading = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-8 h-8 rounded-lg bg-primary animate-pulse" />
  </div>
);

const PageLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background gradient-dark">
    <Header />
    <Suspense fallback={<PageLoading />}>{children}</Suspense>
    <Footer />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <FavoritesProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/services" element={<PageLayout><ServicesPage /></PageLayout>} />
                  <Route path="/services/:slug" element={<PageLayout><ServiceDetailPage /></PageLayout>} />
                  <Route path="/projects" element={<PageLayout><ProjectsPage /></PageLayout>} />
                  <Route path="/about" element={<PageLayout><AboutPage /></PageLayout>} />
                  <Route path="/contacts" element={<PageLayout><ContactsPage /></PageLayout>} />
                  <Route path="/news" element={<PageLayout><NewsPage /></PageLayout>} />
                  <Route path="/blog" element={<PageLayout><BlogPage /></PageLayout>} />
                  <Route path="/blog/:slug" element={<PageLayout><ArticlePage /></PageLayout>} />
                  <Route path="/auth" element={<Suspense fallback={<PageLoading />}><AuthPage /></Suspense>} />
                  <Route path="/reset-password" element={<Suspense fallback={<PageLoading />}><ResetPasswordPage /></Suspense>} />
                  <Route path="/dashboard" element={<ProtectedRoute><Suspense fallback={<PageLoading />}><DashboardPage /></Suspense></ProtectedRoute>} />
                  <Route path="/marketplace" element={<Suspense fallback={<PageLoading />}><MarketplacePage /></Suspense>} />
                  <Route path="/shop" element={<Suspense fallback={<PageLoading />}><ShopPage /></Suspense>} />
                  <Route path="/install" element={<Suspense fallback={<PageLoading />}><InstallPage /></Suspense>} />
                  <Route path="/equipment" element={<PageLayout><EquipmentPage /></PageLayout>} />
                  <Route path="/admin" element={<AdminRoute><Suspense fallback={<PageLoading />}><AdminLayout><AdminDashboard /></AdminLayout></Suspense></AdminRoute>} />
                  <Route path="/admin/articles" element={<AdminRoute><Suspense fallback={<PageLoading />}><AdminLayout><AdminArticles /></AdminLayout></Suspense></AdminRoute>} />
                  <Route path="/admin/media" element={<AdminRoute><Suspense fallback={<PageLoading />}><AdminLayout><AdminMedia /></AdminLayout></Suspense></AdminRoute>} />
                  <Route path="/admin/users" element={<AdminRoute><Suspense fallback={<PageLoading />}><AdminLayout><AdminUsers /></AdminLayout></Suspense></AdminRoute>} />
                  <Route path="/admin/settings" element={<AdminRoute><Suspense fallback={<PageLoading />}><AdminLayout><AdminSettings /></AdminLayout></Suspense></AdminRoute>} />
                  <Route path="/admin/stories" element={<AdminRoute><Suspense fallback={<PageLoading />}><AdminLayout><AdminStories /></AdminLayout></Suspense></AdminRoute>} />
                  <Route path="/admin/categories" element={<AdminRoute><Suspense fallback={<PageLoading />}><AdminLayout><AdminCategories /></AdminLayout></Suspense></AdminRoute>} />
                  <Route path="/admin/listings" element={<AdminRoute><Suspense fallback={<PageLoading />}><AdminLayout><AdminListings /></AdminLayout></Suspense></AdminRoute>} />
                  <Route path="*" element={<Suspense fallback={<PageLoading />}><NotFound /></Suspense>} />
                </Routes>
              </BrowserRouter>
            </FavoritesProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
