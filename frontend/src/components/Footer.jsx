import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react"
import { Link } from "react-router-dom"
import logo from "../assets/vyapaarbharatlogo.png"

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3">

              <img
  src={logo}
  alt="Vyapaar Bharat"
  className="h-20 w-auto object-contain"
/>

              <div>
                <div className="text-lg font-extrabold tracking-tight text-[#0952d4]">
                  Vyapaar Bharat
                </div>

                <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-gray-500">
                  B2B Trade Network
                </div>
              </div>

            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-gray-600">
              India's B2B trade network connecting buyers, suppliers,
              manufacturers, wholesalers and businesses across India.
            </p>

            {/* Social */}
            <div className="mt-6 flex items-center gap-2">
              <a
                href="#"
                className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-[#0952d4] hover:bg-blue-50 hover:text-[#0952d4]"
              >
                Facebook
              </a>

              <a
                href="#"
                className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-[#0952d4] hover:bg-blue-50 hover:text-[#0952d4]"
              >
                Instagram
              </a>

              <a
                href="#"
                className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-[#0952d4] hover:bg-blue-50 hover:text-[#0952d4]"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-bold text-[#0b1f3a]">
              Explore
            </h3>

            <div className="mt-5 flex flex-col gap-3">

              <Link
                to="/"
                className="text-sm text-gray-600 transition hover:text-[#0952d4]"
              >
                Home
              </Link>

              <Link
                to="/for-buyers"
                className="text-sm text-gray-600 transition hover:text-[#0952d4]"
              >
                For Buyers
              </Link>

              <Link
                to="/supplier/requirements"
                className="text-sm text-gray-600 transition hover:text-[#0952d4]"
              >
                For Suppliers
              </Link>

              <Link
                to="/products"
                className="text-sm text-gray-600 transition hover:text-[#0952d4]"
              >
                Products
              </Link>

              <Link
                to="/suppliers"
                className="text-sm text-gray-600 transition hover:text-[#0952d4]"
              >
                Suppliers
              </Link>

            </div>
          </div>

          {/* Business */}
          <div>
            <h3 className="text-sm font-bold text-[#0b1f3a]">
              Business
            </h3>

            <div className="mt-5 flex flex-col gap-3">

              <Link
                to="/post-requirement"
                className="text-sm text-gray-600 transition hover:text-[#0952d4]"
              >
                Post Requirement
              </Link>

              <Link
                to="/requirements"
                className="text-sm text-gray-600 transition hover:text-[#0952d4]"
              >
                Buyer Requirements
              </Link>

              <Link
                to="/supplier-rfqs"
                className="text-sm text-gray-600 transition hover:text-[#0952d4]"
              >
                Supplier RFQs
              </Link>

              <Link
                to="/pricing"
                className="text-sm text-gray-600 transition hover:text-[#0952d4]"
              >
                Pricing
              </Link>

              <Link
                to="/insights"
                className="text-sm text-gray-600 transition hover:text-[#0952d4]"
              >
                Insights
              </Link>

            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-[#0b1f3a]">
              Connect With Us
            </h3>

            <div className="mt-5 space-y-4">

              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-blue-50 p-2 text-[#0952d4]">
                  <Mail size={16} />
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Email
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-700">
                    info@vyapaarbharat.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-blue-50 p-2 text-[#0952d4]">
                  <Phone size={16} />
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Phone
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-700">
                    +91 00000 00000
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-blue-50 p-2 text-[#0952d4]">
                  <MapPin size={16} />
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-700">
                    India
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-gray-50">

        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">

          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Vyapaar Bharat. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-5">

            <a
              href="#"
              className="text-xs text-gray-500 transition hover:text-[#0952d4]"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="text-xs text-gray-500 transition hover:text-[#0952d4]"
            >
              Terms & Conditions
            </a>

            <a
              href="#"
              className="text-xs text-gray-500 transition hover:text-[#0952d4]"
            >
              Contact Us
            </a>

          </div>

        </div>

      </div>

    </footer>
  )
}

export default Footer