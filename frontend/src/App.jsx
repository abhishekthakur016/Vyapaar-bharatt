import { Routes, Route, useLocation } from "react-router-dom"

import Navbar from "./components/Navbar"

import Hero from "./components/Hero"
import Stats from "./components/Stats"
import Categories from "./components/Categories"
import PopularProducts from "./components/PopularProducts"
import FeaturedSuppliers from "./components/FeaturedSuppliers"
import TradeNetwork from "./components/TradeNetwork"
import HowItWorks from "./components/HowItWorks"
import PostRequirementCTA from "./components/PostRequirementCTA"

import ForBuyers from "./pages/ForBuyers"
import SupplierDetails from "./pages/SupplierDetails"
import PostRequirement from "./pages/PostRequirement"
import Requirements from "./pages/Requirements"
import RequirementDetails from "./pages/RequirementDetails"
import SupplierRequirements from "./pages/SupplierRequirements"
import Products from "./pages/Products"
import ProductDetails from "./pages/ProductDetails"
import SupplierRFQs from "./pages/SupplierRFQs"
// import Suppliers from "./pages/Suppliers"

// import Pricing from "./pages/Pricing"
import Insights from "./pages/Insights"
import InsightDetails from "./pages/InsightDetails"
import InsightsAdmin from "./pages/InsightsAdmin"

import Footer from "./components/Footer"
import Login from "./pages/Login"

import AdminDashboard from "./pages/AdminDashboard"
import AdminCompanies from "./pages/AdminCompanies"
import AdminAddCompany from "./pages/AdminAddCompany"
import AdminProducts from "./pages/AdminProducts"
import AdminAddProduct from "./pages/AdminAddProduct"
import AdminEditProduct from "./pages/AdminEditProduct"
import AdminRequirements from "./pages/AdminRequirements"
// import AdminQuotes from "./pages/AdminQuotes"
import MyRequirements from "./pages/MyRequirements";
import MyQuotes from "./pages/MyQuotes";
import MyProfile from "./pages/MyProfile"
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
  )
}

function App() {
  const location = useLocation()

  const isAdminRoute = location.pathname.startsWith("/admin")

  return (
    <div className="min-h-screen bg-white">

      {/* Public Navbar */}
      {!isAdminRoute && <Navbar />}

      <Routes>

        {/* =========================
            HOME
        ========================= */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* =========================
            BUYER
        ========================= */}

        <Route
          path="/for-buyers"
          element={<ForBuyers />}
        />

        {/* =========================
            SUPPLIER DETAILS
        ========================= */}

        <Route
          path="/suppliers/:id"
          element={<SupplierDetails />}
        />

        {/* =========================
            REQUIREMENTS
        ========================= */}

        <Route
          path="/post-requirement"
          element={<PostRequirement />}
        />

        <Route
          path="/requirements"
          element={<Requirements />}
        />

        <Route
          path="/requirements/:id"
          element={<RequirementDetails />}
        />

        {/* =========================
            SUPPLIER REQUIREMENTS
        ========================= */}

        <Route
          path="/supplier/requirements"
          element={<SupplierRequirements />}
        />

        {/* =========================
            PRODUCTS
        ========================= */}

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        {/* =========================
            SUPPLIER RFQs
        ========================= */}

        <Route
          path="/supplier-rfqs"
          element={<SupplierRFQs />}
        />

        {/* =========================
            SUPPLIERS DIRECTORY
        ========================= */}

        {/* 
        <Route
          path="/suppliers"
          element={<Suppliers />}
        />
        */}

        {/* =========================
            PRICING
        ========================= */}

        {/* <Route
          path="/pricing"
          element={<Pricing />}
        /> */}

        {/* =========================
            INSIGHTS
        ========================= */}

        <Route
          path="/insights"
          element={<Insights />}
        />

        <Route
          path="/insights/:id"
          element={<InsightDetails />}
        />

        {/* =========================
            ADMIN INSIGHTS
        ========================= */}

        <Route
          path="/admin/insights"
          element={<InsightsAdmin />}
        />

        {/* =========================
            LOGIN
        ========================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* =========================
            ADMIN DASHBOARD
        ========================= */}

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        {/* =========================
            ADMIN COMPANIES
        ========================= */}

        <Route
          path="/admin/companies"
          element={<AdminCompanies />}
        />

        <Route
          path="/admin/companies/add"
          element={<AdminAddCompany />}
        />

        {/* =========================
            ADMIN PRODUCTS
        ========================= */}

        <Route
          path="/admin/products"
          element={<AdminProducts />}
        />

        <Route
          path="/admin/products/add"
          element={<AdminAddProduct />}
        />

        <Route
  path="/admin/products/:id/edit"
  element={<AdminEditProduct />}
/>
<Route
  path="/admin/requirements"
  element={<AdminRequirements />}
/>

{/* <Route
  path="/admin/quotes"
  element={<AdminQuotes />}
/> */}

<Route
  path="/my-requirements"
  element={<MyRequirements />}
/>


<Route
  path="/my-quotes"
  element={<MyQuotes />}
/>
<Route path="/my-profile" element={<MyProfile />} />

<Route element={<ProtectedRoute allowedRoles={["supplier"]} />}>
  <Route
    path="/supplier/dashboard"
    element={<SupplierDashboard />}
  />
</Route>
      </Routes>

      {/* Public Footer */}
      {!isAdminRoute && <Footer />}

    </div>
  )
}

export default App