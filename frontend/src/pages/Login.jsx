import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Factory,
  ArrowRight,
} from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

function Login() {
  const navigate = useNavigate();

  // =========================
  // FORM STATE
  // =========================

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [roleLoading, setRoleLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRoleSelection, setShowRoleSelection] =
    useState(false);


  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // =========================
  // NORMAL LOGIN
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Login failed"
        );
      }

      // =========================
      // SAVE LOGIN DATA
      // =========================

      localStorage.setItem(
        "vyapaar_token",
        data.token
      );

      localStorage.setItem(
        "vyapaar_user",
        JSON.stringify(data.user)
      );


      // =========================
      // ADMIN
      // =========================

      if (
        data.user.role === "super_admin" ||
        data.user.role === "admin"
      ) {
        navigate("/admin/dashboard");
        return;
      }


      // =========================
      // BUYER / SUPPLIER
      // =========================

      if (
        data.user.role === "buyer" ||
        data.user.role === "supplier"
      ) {
        if (data.user.role === "buyer") {
          navigate("/buyer/dashboard");
        } else {
          navigate("/supplier/dashboard");
        }

        return;
      }


      // =========================
      // NORMAL USER
      // =========================

      setShowRoleSelection(true);

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        error.message ||
          "Unable to login"
      );

    } finally {
      setLoading(false);
    }
  };


  // =========================
  // GOOGLE LOGIN
  // =========================

  const handleGoogleSuccess = async (
    credentialResponse
  ) => {
    try {
      setError("");
      setLoading(true);

      // Make sure Google credential exists
      if (
        !credentialResponse?.credential
      ) {
        throw new Error(
          "Google credential not received"
        );
      }


      // =========================
      // SEND GOOGLE TOKEN
      // =========================

      const response = await fetch(
        "http://localhost:5000/api/auth/google",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            credential:
              credentialResponse.credential,
          }),
        }
      );


      const data = await response.json();


      // =========================
      // CHECK RESPONSE
      // =========================

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Google login failed"
        );
      }


      // =========================
      // SAVE GOOGLE LOGIN DATA
      // =========================

      localStorage.setItem(
        "vyapaar_token",
        data.token
      );

      localStorage.setItem(
        "vyapaar_user",
        JSON.stringify(data.user)
      );


      // =========================
      // NEW GOOGLE USER
      // =========================

      if (data.needsRoleSelection) {
        setShowRoleSelection(true);
        return;
      }


      // =========================
      // BUYER
      // =========================

      if (data.user.role === "buyer") {
        navigate("/buyer/dashboard");
        return;
      }


      // =========================
      // SUPPLIER
      // =========================

      if (data.user.role === "supplier") {
        navigate("/supplier/dashboard");
        return;
      }


      // =========================
      // ADMIN
      // =========================

      if (
        data.user.role === "admin" ||
        data.user.role === "super_admin"
      ) {
        navigate("/admin/dashboard");
        return;
      }


      // =========================
      // FALLBACK
      // =========================

      setShowRoleSelection(true);

    } catch (error) {
      console.error(
        "Google login error:",
        error
      );

      setError(
        error.message ||
          "Google authentication failed"
      );

    } finally {
      setLoading(false);
    }
  };


  // =========================
  // GOOGLE LOGIN ERROR
  // =========================

  const handleGoogleError = () => {
    setError(
      "Google authentication failed"
    );
  };


  // =========================
  // ROLE SELECTION
  // =========================

  const handleRoleSelection = async (
    role
  ) => {
    setError("");
    setRoleLoading(true);

    try {
      // =========================
      // GET TOKEN
      // =========================

      const token =
        localStorage.getItem(
          "vyapaar_token"
        );

      if (!token) {
        throw new Error(
          "Authentication token not found"
        );
      }


      // =========================
      // SELECT ROLE API
      // =========================

      const response = await fetch(
        "http://localhost:5000/api/auth/select-role",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            role,
          }),
        }
      );


      const data = await response.json();


      // =========================
      // CHECK RESPONSE
      // =========================

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to select role"
        );
      }


      // =========================
      // SAVE NEW TOKEN
      // =========================

      localStorage.setItem(
        "vyapaar_token",
        data.token
      );


      // =========================
      // SAVE UPDATED USER
      // =========================

      localStorage.setItem(
        "vyapaar_user",
        JSON.stringify(data.user)
      );


      // =========================
      // REDIRECT
      // =========================

      if (role === "buyer") {
        navigate("/buyer/dashboard");
      } else {
        navigate("/supplier/dashboard");
      }

    } catch (error) {
      console.error(
        "Role selection error:",
        error
      );

      setError(
        error.message ||
          "Unable to select role"
      );

    } finally {
      setRoleLoading(false);
    }
  };


  // =========================
  // UI
  // =========================

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-4 py-12">

      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">

        {!showRoleSelection ? (
          <>

            {/* =========================
                LOGIN HEADER
            ========================== */}

            <div className="mb-8 text-center">

              <h1 className="text-3xl font-bold text-[#0b1f3a]">
                Welcome Back
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Login to Vyapaar Bharat
              </p>

            </div>


            {/* =========================
                ERROR
            ========================== */}

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}


            {/* =========================
                EMAIL LOGIN FORM
            ========================== */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Email */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#0952d4] focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* Password */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#0952d4] focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* Sign In */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#0952d4] px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Signing in..."
                  : "Sign In"}
              </button>

            </form>


            {/* =========================
                OR DIVIDER
            ========================== */}

            <div className="my-6 flex items-center gap-3">

              <div className="h-px flex-1 bg-gray-200" />

              <span className="text-xs font-medium text-gray-400">
                OR
              </span>

              <div className="h-px flex-1 bg-gray-200" />

            </div>


            {/* =========================
                GOOGLE LOGIN
            ========================== */}

            <div className="flex justify-center">

              <GoogleLogin
                onSuccess={
                  handleGoogleSuccess
                }
                onError={
                  handleGoogleError
                }
              />

            </div>


            {/* =========================
                GOOGLE INFO
            ========================== */}

            <p className="mt-4 text-center text-xs text-gray-400">
              Continue securely with your Google account
            </p>

          </>
        ) : (

          <>

            {/* =========================
                ROLE SELECTION
            ========================== */}

            <div className="mb-8 text-center">

              <h1 className="text-3xl font-bold text-[#0b1f3a]">
                Choose Your Role
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                How do you want to use Vyapaar Bharat?
              </p>

            </div>


            {/* =========================
                ERROR
            ========================== */}

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}


            <div className="space-y-4">

              {/* =========================
                  BUYER
              ========================== */}

              <button
                type="button"
                onClick={() =>
                  handleRoleSelection(
                    "buyer"
                  )
                }
                disabled={roleLoading}
                className="group flex w-full items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 text-left transition hover:border-[#0952d4] hover:bg-blue-50 disabled:opacity-60"
              >

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-[#0952d4]">

                  <ShoppingCart
                    size={27}
                  />

                </div>


                <div className="flex-1">

                  <h2 className="text-lg font-bold text-[#0b1f3a]">
                    I'm a Buyer
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Find products, suppliers and
                    post requirements.
                  </p>

                </div>


                <ArrowRight
                  size={20}
                  className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-[#0952d4]"
                />

              </button>


              {/* =========================
                  SUPPLIER
              ========================== */}

              <button
                type="button"
                onClick={() =>
                  handleRoleSelection(
                    "supplier"
                  )
                }
                disabled={roleLoading}
                className="group flex w-full items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 text-left transition hover:border-[#fd8836] hover:bg-orange-50 disabled:opacity-60"
              >

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-[#fd8836]">

                  <Factory
                    size={27}
                  />

                </div>


                <div className="flex-1">

                  <h2 className="text-lg font-bold text-[#0b1f3a]">
                    I'm a Supplier
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    List products, find buyer
                    requirements and send quotes.
                  </p>

                </div>


                <ArrowRight
                  size={20}
                  className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-[#fd8836]"
                />

              </button>

            </div>

          </>
        )}

      </div>

    </main>
  );
}

export default Login;