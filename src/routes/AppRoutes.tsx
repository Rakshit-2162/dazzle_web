import { Routes, Route, Navigate } from "react-router-dom";
import { PATHS } from "./paths";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import LoginPage from "../pages/LoginPage/LoginPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import DashboardPage from "../pages/DashboardPage/DashboardPage";
import LandingPage from "../pages/LandingPage/LandingPage";
import Layout from "../shared/components/Layout/Layout";
import OrdersPage from "../pages/OrdersPage/OrdersPage";
import CatalogPage from "../pages/CatalogPage/CatalogPage";
import ClientsPage from "../pages/ClientsPage/ClientsPage";
import MyAccountPage from "../pages/MyAccountPage/MyAccountPage";
import CatalogProductsPage from "../pages/CatalogProductsPage/CatalogProductsPage";
import OrderDetailPage from "../pages/OrderDetailsPage/OrderDetailsPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* public routes */}
      <Route path={PATHS.ROOT} element={<LandingPage />} />
      <Route
        path={PATHS.LOGIN}
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path={PATHS.SIGNUP}
        element={
          <PublicRoute>
            <SignUpPage />
          </PublicRoute>
        }
      />

      {/* protected routes */}
      <Route
        path={PATHS.DASHBOARD}
        element={
          <ProtectedRoute>
            <Layout pageTitle="Dashboard">
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.ORDERS}
        element={
          <ProtectedRoute>
            <Layout pageTitle="My Orders">
              <OrdersPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.ORDER_DETAIL}
        element={
          <ProtectedRoute>
            <Layout pageTitle="Order Details">
              <OrderDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.CATALOG}
        element={
          <ProtectedRoute>
            <Layout pageTitle="Catalog Management">
              <CatalogPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.CATALOG_PRODUCTS}
        element={
          <ProtectedRoute>
            <Layout pageTitle="Products">
              <CatalogProductsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.CLIENTS}
        element={
          <ProtectedRoute>
            <Layout pageTitle="Clients">
              <ClientsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path={PATHS.MY_ACCOUNT}
        element={
          <ProtectedRoute>
            <Layout pageTitle="My Account">
              <MyAccountPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to={PATHS.ROOT} replace />} />
    </Routes>
  );
};

export default AppRoutes;
