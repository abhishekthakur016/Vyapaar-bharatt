import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  LogOut,
  ArrowLeft,
} from "lucide-react"

export default function MyProfile() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("vyapaar_user")

    if (!savedUser) {
      navigate("/login")
      return
    }

    try {
      setUser(JSON.parse(savedUser))
    } catch (error) {
      console.error("Invalid user data:", error)
      localStorage.removeItem("vyapaar_user")
      navigate("/login")
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("vyapaar_token")
    localStorage.removeItem("vyapaar_user")

    navigate("/login")
  }

  if (!user) {
    return null
  }

  const getRoleName = (role) => {
    switch (role) {
      case "buyer":
        return "Buyer"
      case "supplier":
        return "Supplier"
      case "admin":
        return "Admin"
      case "super_admin":
        return "Super Admin"
      default:
        return "User"
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-[#0952d4] mb-6"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">

            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
              <User size={38} className="text-[#0952d4]" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#0b1f3a]">
                My Profile
              </h1>

              <p className="text-gray-500 mt-1">
                Manage your Vyapaar Bharat account
              </p>
            </div>

          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-[#0b1f3a]">
              Personal Information
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Your account information
            </p>
          </div>

          <div className="p-6 space-y-5">

            {/* Name */}
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
                <User size={20} className="text-[#0952d4]" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-gray-900">
                  {user.name || "Not provided"}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
                <Mail size={20} className="text-[#0952d4]" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium text-gray-900">
                  {user.email || "Not provided"}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
                <Phone size={20} className="text-[#0952d4]" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium text-gray-900">
                  {user.phone || "Not provided"}
                </p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
                <ShieldCheck size={20} className="text-[#0952d4]" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Account Type</p>
                <p className="font-medium text-gray-900">
                  {getRoleName(user.role)}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Account Status */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mt-6">

          <h2 className="text-lg font-semibold text-[#0b1f3a] mb-5">
            Account Status
          </h2>

          <div className="flex flex-wrap gap-3">

            <span className="px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-medium">
              Active Account
            </span>

            {user.is_verified && (
              <span className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                Verified
              </span>
            )}

            {user.auth_provider && (
              <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium capitalize">
                {user.auth_provider} Login
              </span>
            )}

          </div>

        </div>

        {/* Logout */}
        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-medium transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

      </div>
    </div>
  )
}