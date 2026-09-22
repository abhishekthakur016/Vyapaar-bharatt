import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";

import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Categories from "./components/Categories";
import PopularProducts from "./components/PopularProducts";
import FeaturedSuppliers from "./components/FeaturedSuppliers";
import TradeNetwork from "./components/TradeNetwork";
import HowItWorks from "./components/HowItWorks";
import PostRequirementCTA from "./components/PostRequirementCTA";

import ForBuyers from "./pages/ForBuyers";
import SupplierDetails from "./pages/SupplierDetails";
import PostRequirement from "./pages/PostRequirement";
import Requirements from "./pages/Requirements";
import RequirementDetails from "./pages/RequirementDetails";
import SupplierRequirements from "./pages/SupplierRequirements";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import SupplierRFQs from "./pages/SupplierRFQs";

import Insights from "./pages/Insights";
import InsightDetails from "./pages/InsightDetails";
import InsightsAdmin from "./pages/InsightsAdmin";

import Footer from "./components/Footer";
import Login from "./pages/Login";

import AdminDashboard from "./pages/AdminDashboard";
import AdminCompanies from "./pages/AdminCompanies";
import AdminAddCompany from "./pages/AdminAddCompany";
import AdminProducts from "./pages/AdminProducts";
import AdminAddProduct from "./pages/AdminAddProduct";
import AdminEditProduct from "./pages/AdminEditProduct";
import AdminRequirements from "./pages/AdminRequirements";

import MyRequirements from "./pages/MyRequirements";
import MyQuotes from "./pages/MyQuotes";
import MyProfile from "./pages/MyProfile";

import ProtectedRoute from "./components/ProtectedRoute";
import SupplierDashboard from "./pages/SupplierDashboard";

function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <Categories />
      <PopularProducts />
      <FeaturedSuppliers />
      <TradeNetwork />
      <HowItWorks />
      <PostRequirementCTA />
    </main>
  );
}

function App() {
  const location = useLocation();

  // =========================
  // AUTH STATE
  // =========================

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem("vyapaar_token");
    const user = localStorage.getItem("vyapaar_user");

    return Boolean(token && user);
  });

  // =========================
  // LOGIN POPUP STATE
  // =========================

  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // =========================
  // SHOW LOGIN POPUP AFTER 5 SEC
  // =========================

  useEffect(() => {
    // If already logged in,
    // make sure popup stays hidden.
    if (isLoggedIn) {
      setShowLoginPopup(false);
      return;
    }

    // Wait 5 seconds before showing popup.
    const timer = setTimeout(() => {
      setShowLoginPopup(true);
    }, 5000);

    // Clear timer if component unmounts
    // or isLoggedIn changes.
    return () => clearTimeout(timer);
  }, [isLoggedIn]);

  // =========================
  // ADMIN ROUTE
  // =========================

  const isAdminRoute = location.pathname.startsWith("/admin");

  // =========================
  // LOGIN PAGE
  // =========================

  const isLoginPage = location.pathname === "/login";

  // =========================
  // AUTH SUCCESS
  // =========================

  const handleLoginSuccess = (user) => {
    console.log("Login successful:", user);

    // User is now logged in.
    setIsLoggedIn(true);

    // Close popup immediately.
    setShowLoginPopup(false);
  };

  // =========================
  // LOGOUT EVENT
  // =========================

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("vyapaar_token");
      const user = localStorage.getItem("vyapaar_user");

      setIsLoggedIn(Boolean(token && user));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* =========================
          PUBLIC NAVBAR
      ========================== */}

      {!isAdminRoute && <Navbar />}

      {/* =========================
          ROUTES
      ========================== */}

      <Routes>
        {/* HOME */}

        <Route path="/" element={<Home />} />

        {/* PUBLIC PAGES */}

        <Route path="/for-buyers" element={<ForBuyers />} />

        <Route path="/suppliers/:id" element={<SupplierDetails />} />

        <Route path="/post-requirement" element={<PostRequirement />} />

        <Route path="/requirements" element={<Requirements />} />

        <Route path="/requirements/:id" element={<RequirementDetails />} />

        <Route
          path="/supplier/requirements"
          element={<SupplierRequirements />}
        />

        <Route path="/products" element={<Products />} />

        <Route path="/products/:id" element={<ProductDetails />} />

        <Route path="/supplier-rfqs" element={<SupplierRFQs />} />

        {/* INSIGHTS */}

        <Route path="/insights" element={<Insights />} />

        <Route path="/insights/:id" element={<InsightDetails />} />

        {/* LOGIN PAGE */}

        <Route path="/login" element={<Login />} />

        {/* USER PAGES */}

        <Route path="/my-requirements" element={<MyRequirements />} />

        <Route path="/my-quotes" element={<MyQuotes />} />

        <Route path="/my-profile" element={<MyProfile />} />

        {/* =========================
            ADMIN ROUTES
        ========================== */}

        <Route
          element={<ProtectedRoute allowedRoles={["admin", "super_admin"]} />}
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="/admin/companies" element={<AdminCompanies />} />

          <Route path="/admin/companies/add" element={<AdminAddCompany />} />

          <Route path="/admin/products" element={<AdminProducts />} />

          <Route path="/admin/products/add" element={<AdminAddProduct />} />

          <Route
            path="/admin/products/:id/edit"
            element={<AdminEditProduct />}
          />

          <Route path="/admin/requirements" element={<AdminRequirements />} />

          <Route path="/admin/insights" element={<InsightsAdmin />} />
        </Route>

        {/* =========================
            SUPPLIER ROUTES
        ========================== */}

        <Route element={<ProtectedRoute allowedRoles={["supplier"]} />}>
          <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
        </Route>
      </Routes>

      {/* =========================
          FOOTER
      ========================== */}

      {!isAdminRoute && <Footer />}

      {/* =========================
          GLOBAL LOGIN POPUP
          SHOW AFTER 5 SECONDS
      ========================== */}

      {showLoginPopup && !isLoggedIn && !isLoginPage && (
        <Login isModal={true} onSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
