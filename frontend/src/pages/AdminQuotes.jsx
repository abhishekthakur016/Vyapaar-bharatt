// import { useEffect, useMemo, useState } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import {
//   Search,
//   Bell,
//   Menu,
//   X,
//   LayoutDashboard,
//   Building2,
//   Package,
//   FileText,
//   MessageSquareQuote,
//   Users,
//   ShoppingCart,
//   BarChart3,
//   Settings,
//   ShieldCheck,
//   LogOut,
//   Plus,
//   Eye,
//   Check,
//   Ban,
//   RefreshCw,
//   ChevronDown,
// } from "lucide-react"

// const menuItems = [
//   {
//     label: "Dashboard",
//     icon: LayoutDashboard,
//     path: "/admin/dashboard",
//   },
//   {
//     label: "Companies",
//     icon: Building2,
//     path: "/admin/companies",
//   },
//   {
//     label: "Products",
//     icon: Package,
//     path: "/admin/products",
//   },
//   {
//     label: "Requirements",
//     icon: FileText,
//     path: "/admin/requirements",
//   },
//   {
//     label: "Quotes",
//     icon: MessageSquareQuote,
//     path: "/admin/quotes",
//   },
//   {
//     label: "Users",
//     icon: Users,
//     path: "/admin/users",
//   },
//   {
//     label: "Orders",
//     icon: ShoppingCart,
//     path: "/admin/orders",
//   },
//   {
//     label: "Reports",
//     icon: BarChart3,
//     path: "/admin/reports",
//   },
//   {
//     label: "Insights",
//     icon: FileText,
//     path: "/admin/insights",
//   },
//   {
//     label: "Settings",
//     icon: Settings,
//     path: "/admin/settings",
//   },
// ]

// function AdminQuotes() {
//   const navigate = useNavigate()

//   const [quotes, setQuotes] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [refreshing, setRefreshing] = useState(false)

//   const [search, setSearch] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")

//   const [sidebarOpen, setSidebarOpen] = useState(false)

//   const [actionLoading, setActionLoading] = useState(null)
//   const [error, setError] = useState("")

//   const [selectedQuote, setSelectedQuote] = useState(null)

//   const user = useMemo(() => {
//     try {
//       return JSON.parse(
//         localStorage.getItem("vyapaar_user") || "{}"
//       )
//     } catch {
//       return {}
//     }
//   }, [])

//   const fetchQuotes = async (showRefresh = false) => {
//     try {
//       if (showRefresh) {
//         setRefreshing(true)
//       } else {
//         setLoading(true)
//       }

//       setError("")

//       const response = await fetch(
//         "http://localhost:5000/api/admin/quotes"
//       )

//       const data = await response.json()

//       if (!response.ok || !data.success) {
//         throw new Error(
//           data.message || "Failed to fetch quotes"
//         )
//       }

//       setQuotes(data.quotes || [])
//     } catch (error) {
//       console.error("Error fetching quotes:", error)
//       setError(error.message || "Unable to load quotes.")
//     } finally {
//       setLoading(false)
//       setRefreshing(false)
//     }
//   }

//   useEffect(() => {
//     fetchQuotes()
//   }, [])

//   const filteredQuotes = useMemo(() => {
//     const query = search.trim().toLowerCase()

//     return quotes.filter((quote) => {
//       const matchesSearch =
//         !query ||
//         String(quote.id || "")
//           .toLowerCase()
//           .includes(query) ||
//         String(quote.requirement_id || "")
//           .toLowerCase()
//           .includes(query) ||
//         String(quote.requirement_title || "")
//           .toLowerCase()
//           .includes(query) ||
//         String(quote.supplier_name || "")
//           .toLowerCase()
//           .includes(query) ||
//         String(quote.supplier_email || "")
//           .toLowerCase()
//           .includes(query) ||
//         String(quote.requirement_category || "")
//           .toLowerCase()
//           .includes(query)

//       const matchesStatus =
//         statusFilter === "all" ||
//         String(quote.status || "").toLowerCase() ===
//           statusFilter.toLowerCase()

//       return matchesSearch && matchesStatus
//     })
//   }, [quotes, search, statusFilter])

//   const stats = useMemo(() => {
//     return {
//       total: quotes.length,

//       pending: quotes.filter(
//         (quote) => quote.status === "pending"
//       ).length,

//       accepted: quotes.filter(
//         (quote) => quote.status === "accepted"
//       ).length,

//       rejected: quotes.filter(
//         (quote) => quote.status === "rejected"
//       ).length,

//       negotiating: quotes.filter(
//         (quote) => quote.status === "negotiating"
//       ).length,
//     }
//   }, [quotes])

//   const formatDate = (date) => {
//     if (!date) return "-"

//     return new Date(date).toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     })
//   }

//   const formatPrice = (price) => {
//     if (price === null || price === undefined || price === "") {
//       return "-"
//     }

//     return `₹${Number(price).toLocaleString("en-IN")}`
//   }

//   const getStatusClass = (status) => {
//     switch (status) {
//       case "accepted":
//         return "bg-emerald-50 text-emerald-700 border-emerald-200"

//       case "rejected":
//         return "bg-red-50 text-red-700 border-red-200"

//       case "negotiating":
//         return "bg-amber-50 text-amber-700 border-amber-200"

//       case "pending":
//       default:
//         return "bg-blue-50 text-blue-700 border-blue-200"
//     }
//   }

//   const handleQuoteStatus = async (quoteId, status) => {
//     if (!quoteId) return

//     const actionText =
//       status === "accepted" ? "accept" : "reject"

//     const confirmed = window.confirm(
//       `Are you sure you want to ${actionText} this quote?`
//     )

//     if (!confirmed) return

//     try {
//       setActionLoading(`${quoteId}-${status}`)
//       setError("")

//       const response = await fetch(
//         `http://localhost:5000/api/quotes/${quoteId}/status`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             status,
//           }),
//         }
//       )

//       const data = await response.json()

//       if (!response.ok || !data.success) {
//         throw new Error(
//           data.message ||
//             `Failed to ${actionText} quote`
//         )
//       }

//       await fetchQuotes(true)
//     } catch (error) {
//       console.error(
//         "Error updating quote status:",
//         error
//       )

//       setError(
//         error.message ||
//           `Unable to ${actionText} quote.`
//       )
//     } finally {
//       setActionLoading(null)
//     }
//   }

//   const handleLogout = () => {
//     localStorage.removeItem("vyapaar_token")
//     localStorage.removeItem("vyapaar_user")

//     navigate("/login")
//   }

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* Mobile Overlay */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black/40 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`fixed left-0 top-0 z-50 flex h-screen w-[270px] flex-col bg-[#0b1f3a] text-white transition-transform duration-300 ${
//           sidebarOpen
//             ? "translate-x-0"
//             : "-translate-x-full lg:translate-x-0"
//         }`}
//       >
//         <div className="flex h-[82px] items-center justify-between border-b border-white/10 px-6">
//           <Link
//             to="/admin/dashboard"
//             className="flex items-center gap-3"
//           >
//             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0b1f3a]">
//               <ShieldCheck size={24} />
//             </div>

//             <div>
//               <h1 className="text-lg font-bold">
//                 Vyapaar Bharat
//               </h1>

//               <p className="text-xs text-white/50">
//                 Super Admin
//               </p>
//             </div>
//           </Link>

//           <button
//             onClick={() => setSidebarOpen(false)}
//             className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto px-4 py-6">
//           <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-white/40">
//             Main Menu
//           </p>

//           <nav className="space-y-1">
//             {menuItems.map((item) => {
//               const Icon = item.icon
//               const active =
//                 item.path === "/admin/quotes"

//               return (
//                 <Link
//                   key={item.path}
//                   to={item.path}
//                   onClick={() => setSidebarOpen(false)}
//                   className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
//                     active
//                       ? "bg-white text-[#0b1f3a]"
//                       : "text-white/70 hover:bg-white/10 hover:text-white"
//                   }`}
//                 >
//                   <Icon size={19} />
//                   <span>{item.label}</span>
//                 </Link>
//               )
//             })}
//           </nav>
//         </div>

//         {/* Secure */}
//         <div className="px-4 pb-3">
//           <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
//             <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20">
//               <ShieldCheck
//                 size={18}
//                 className="text-emerald-400"
//               />
//             </div>

//             <div>
//               <p className="text-sm font-semibold">
//                 System Secure
//               </p>

//               <p className="text-[11px] text-white/40">
//                 All systems operational
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Profile */}
//         <div className="border-t border-white/10 p-4">
//           <div className="flex items-center gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold">
//               {(user.name || "SA")
//                 .slice(0, 2)
//                 .toUpperCase()}
//             </div>

//             <div className="min-w-0 flex-1">
//               <p className="truncate text-sm font-semibold">
//                 {user.name || "Super Admin"}
//               </p>

//               <p className="truncate text-xs text-white/40">
//                 {user.email || "admin@vyapaarbharat.com"}
//               </p>
//             </div>

//             <button
//               onClick={handleLogout}
//               title="Logout"
//               className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white"
//             >
//               <LogOut size={18} />
//             </button>
//           </div>
//         </div>
//       </aside>

//       {/* Main */}
//       <div className="lg:pl-[270px]">
//         {/* Topbar */}
//         <header className="sticky top-0 z-30 flex h-[82px] items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-6 lg:px-8">
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => setSidebarOpen(true)}
//               className="rounded-xl border border-slate-200 p-2.5 text-slate-600 lg:hidden"
//             >
//               <Menu size={20} />
//             </button>

//             <div>
//               <h2 className="text-xl font-bold text-[#0b1f3a]">
//                 Quotes Management
//               </h2>

//               <p className="hidden text-sm text-slate-500 sm:block">
//                 Manage supplier quotations and negotiations
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50">
//               <Bell size={19} />

//               <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
//             </button>

//             <div className="hidden h-9 w-px bg-slate-200 sm:block" />

//             <div className="hidden items-center gap-3 sm:flex">
//               <div className="text-right">
//                 <p className="text-sm font-semibold text-slate-800">
//                   {user.name || "Super Admin"}
//                 </p>

//                 <p className="text-xs text-slate-400">
//                   Administrator
//                 </p>
//               </div>

//               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0b1f3a] text-xs font-bold text-white">
//                 {(user.name || "SA")
//                   .slice(0, 2)
//                   .toUpperCase()}
//               </div>
//             </div>
//           </div>
//         </header>

//         <main className="p-5 sm:p-6 lg:p-8">
//           {/* Page Header */}
//           <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
//             <div>
//               <p className="text-sm font-medium text-blue-600">
//                 Business Operations
//               </p>

//               <h1 className="mt-1 text-2xl font-bold text-[#0b1f3a]">
//                 All Quotes
//               </h1>

//               <p className="mt-1 text-sm text-slate-500">
//                 Review and manage quotations submitted by suppliers.
//               </p>
//             </div>

//             <button
//               onClick={() => fetchQuotes(true)}
//               disabled={refreshing}
//               className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
//             >
//               <RefreshCw
//                 size={17}
//                 className={
//                   refreshing ? "animate-spin" : ""
//                 }
//               />

//               Refresh
//             </button>
//           </div>

//           {/* Stats */}
//           <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-5">
//             <StatCard
//               label="Total Quotes"
//               value={stats.total}
//               icon={MessageSquareQuote}
//             />

//             <StatCard
//               label="Pending"
//               value={stats.pending}
//               icon={RefreshCw}
//             />

//             <StatCard
//               label="Accepted"
//               value={stats.accepted}
//               icon={Check}
//             />

//             <StatCard
//               label="Rejected"
//               value={stats.rejected}
//               icon={Ban}
//             />

//             <StatCard
//               label="Negotiating"
//               value={stats.negotiating}
//               icon={MessageSquareQuote}
//             />
//           </div>

//           {/* Error */}
//           {error && (
//             <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//               {error}
//             </div>
//           )}

//           {/* Filters */}
//           <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//             <div className="flex flex-col gap-3 lg:flex-row">
//               <div className="relative flex-1">
//                 <Search
//                   size={18}
//                   className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//                 />

//                 <input
//                   type="text"
//                   value={search}
//                   onChange={(e) =>
//                     setSearch(e.target.value)
//                   }
//                   placeholder="Search quote, requirement, supplier or email..."
//                   className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
//                 />
//               </div>

//               <div className="relative lg:w-52">
//                 <select
//                   value={statusFilter}
//                   onChange={(e) =>
//                     setStatusFilter(e.target.value)
//                   }
//                   className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
//                 >
//                   <option value="all">
//                     All Status
//                   </option>

//                   <option value="pending">
//                     Pending
//                   </option>

//                   <option value="negotiating">
//                     Negotiating
//                   </option>

//                   <option value="accepted">
//                     Accepted
//                   </option>

//                   <option value="rejected">
//                     Rejected
//                   </option>
//                 </select>

//                 <ChevronDown
//                   size={17}
//                   className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Table */}
//           <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//             <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
//               <div>
//                 <h3 className="font-bold text-[#0b1f3a]">
//                   Quote Records
//                 </h3>

//                 <p className="mt-0.5 text-xs text-slate-400">
//                   Showing {filteredQuotes.length} of{" "}
//                   {quotes.length} quotes
//                 </p>
//               </div>
//             </div>

//             {loading ? (
//               <div className="flex min-h-[300px] items-center justify-center">
//                 <div className="text-center">
//                   <RefreshCw
//                     size={28}
//                     className="mx-auto animate-spin text-blue-600"
//                   />

//                   <p className="mt-3 text-sm text-slate-500">
//                     Loading quotes...
//                   </p>
//                 </div>
//               </div>
//             ) : filteredQuotes.length === 0 ? (
//               <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
//                 <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
//                   <MessageSquareQuote
//                     size={25}
//                     className="text-slate-400"
//                   />
//                 </div>

//                 <h3 className="mt-4 font-semibold text-slate-800">
//                   No quotes found
//                 </h3>

//                 <p className="mt-1 max-w-md text-sm text-slate-500">
//                   No quote records match your current search
//                   or status filter.
//                 </p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full min-w-[1250px]">
//                   <thead>
//                     <tr className="border-b border-slate-200 bg-slate-50">
//                       <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                         Quote
//                       </th>

//                       <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                         Requirement
//                       </th>

//                       <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                         Supplier
//                       </th>

//                       <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                         Quoted Price
//                       </th>

//                       <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                         Quantity
//                       </th>

//                       <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                         Delivery
//                       </th>

//                       <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                         Status
//                       </th>

//                       <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                         Date
//                       </th>

//                       <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody className="divide-y divide-slate-100">
//                     {filteredQuotes.map((quote) => (
//                       <tr
//                         key={quote.id}
//                         className="transition hover:bg-slate-50/70"
//                       >
//                         {/* Quote */}
//                         <td className="px-5 py-4">
//                           <p className="font-semibold text-[#0b1f3a]">
//                             #{quote.id}
//                           </p>

//                           <p className="mt-1 text-xs text-slate-400">
//                             Req #{quote.requirement_id}
//                           </p>
//                         </td>

//                         {/* Requirement */}
//                         <td className="max-w-[230px] px-5 py-4">
//                           <p className="truncate text-sm font-semibold text-slate-800">
//                             {quote.requirement_title ||
//                               "Untitled Requirement"}
//                           </p>

//                           <p className="mt-1 truncate text-xs text-slate-500">
//                             {quote.requirement_category ||
//                               "General"}
//                           </p>

//                           <p className="mt-1 text-xs text-slate-400">
//                             {quote.requirement_location ||
//                               "-"}
//                           </p>
//                         </td>

//                         {/* Supplier */}
//                         <td className="px-5 py-4">
//                           <p className="text-sm font-semibold text-slate-800">
//                             {quote.supplier_name ||
//                               "-"}
//                           </p>

//                           <p className="mt-1 max-w-[190px] truncate text-xs text-slate-500">
//                             {quote.supplier_email ||
//                               "No email"}
//                           </p>
//                         </td>

//                         {/* Price */}
//                         <td className="px-5 py-4">
//                           <p className="font-semibold text-slate-800">
//                             {formatPrice(
//                               quote.quoted_price
//                             )}
//                           </p>
//                         </td>

//                         {/* Quantity */}
//                         <td className="px-5 py-4">
//                           <p className="text-sm font-medium text-slate-700">
//                             {quote.quantity || 0}{" "}
//                             {quote.unit || ""}
//                           </p>
//                         </td>

//                         {/* Delivery */}
//                         <td className="px-5 py-4">
//                           <p className="text-sm text-slate-700">
//                             {quote.delivery_time ||
//                               "-"}
//                           </p>
//                         </td>

//                         {/* Status */}
//                         <td className="px-5 py-4">
//                           <span
//                             className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
//                               quote.status
//                             )}`}
//                           >
//                             {quote.status ||
//                               "pending"}
//                           </span>
//                         </td>

//                         {/* Date */}
//                         <td className="px-5 py-4">
//                           <p className="whitespace-nowrap text-sm text-slate-600">
//                             {formatDate(
//                               quote.created_at
//                             )}
//                           </p>
//                         </td>

//                         {/* Actions */}
//                         <td className="px-5 py-4">
//                           <div className="flex items-center justify-end gap-2">
//                             <button
//                               onClick={() =>
//                                 setSelectedQuote(
//                                   quote
//                                 )
//                               }
//                               title="View Quote"
//                               className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
//                             >
//                               <Eye size={17} />
//                             </button>

//                             {quote.status !==
//                               "accepted" && (
//                               <button
//                                 onClick={() =>
//                                   handleQuoteStatus(
//                                     quote.id,
//                                     "accepted"
//                                   )
//                                 }
//                                 disabled={
//                                   actionLoading ===
//                                   `${quote.id}-accepted`
//                                 }
//                                 title="Accept Quote"
//                                 className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-600 hover:bg-emerald-100 disabled:opacity-50"
//                               >
//                                 <Check size={17} />
//                               </button>
//                             )}

//                             {quote.status !==
//                               "rejected" && (
//                               <button
//                                 onClick={() =>
//                                   handleQuoteStatus(
//                                     quote.id,
//                                     "rejected"
//                                   )
//                                 }
//                                 disabled={
//                                   actionLoading ===
//                                   `${quote.id}-rejected`
//                                 }
//                                 title="Reject Quote"
//                                 className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100 disabled:opacity-50"
//                               >
//                                 <Ban size={17} />
//                               </button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </main>
//       </div>

//       {/* Quote Details Modal */}
//       {selectedQuote && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
//           <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
//               <div>
//                 <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
//                   Quote #{selectedQuote.id}
//                 </p>

//                 <h3 className="mt-1 text-xl font-bold text-[#0b1f3a]">
//                   Quote Details
//                 </h3>
//               </div>

//               <button
//                 onClick={() =>
//                   setSelectedQuote(null)
//                 }
//                 className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="space-y-5 p-6">
//               <DetailRow
//                 label="Requirement"
//                 value={
//                   selectedQuote.requirement_title ||
//                   "-"
//                 }
//               />

//               <DetailRow
//                 label="Category"
//                 value={
//                   selectedQuote.requirement_category ||
//                   "-"
//                 }
//               />

//               <DetailRow
//                 label="Supplier"
//                 value={
//                   selectedQuote.supplier_name || "-"
//                 }
//               />

//               <DetailRow
//                 label="Supplier Email"
//                 value={
//                   selectedQuote.supplier_email || "-"
//                 }
//               />

//               <div className="grid gap-4 sm:grid-cols-2">
//                 <DetailRow
//                   label="Quoted Price"
//                   value={formatPrice(
//                     selectedQuote.quoted_price
//                   )}
//                 />

//                 <DetailRow
//                   label="Quantity"
//                   value={`${selectedQuote.quantity || 0} ${
//                     selectedQuote.unit || ""
//                   }`}
//                 />
//               </div>

//               <DetailRow
//                 label="Delivery Time"
//                 value={
//                   selectedQuote.delivery_time || "-"
//                 }
//               />

//               <DetailRow
//                 label="Delivery Location"
//                 value={
//                   selectedQuote.requirement_location ||
//                   "-"
//                 }
//               />

//               <DetailRow
//                 label="Status"
//                 value={
//                   <span
//                     className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
//                       selectedQuote.status
//                     )}`}
//                   >
//                     {selectedQuote.status ||
//                       "pending"}
//                   </span>
//                 }
//               />

//               <div>
//                 <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
//                   Supplier Message
//                 </p>

//                 <div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
//                   {selectedQuote.message ||
//                     "No message provided."}
//                 </div>
//               </div>

//               <DetailRow
//                 label="Created"
//                 value={formatDate(
//                   selectedQuote.created_at
//                 )}
//               />

//               <DetailRow
//                 label="Last Updated"
//                 value={formatDate(
//                   selectedQuote.updated_at
//                 )}
//               />
//             </div>

//             <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-5 sm:flex-row sm:justify-end">
//               {selectedQuote.status !==
//                 "accepted" && (
//                 <button
//                   onClick={() => {
//                     handleQuoteStatus(
//                       selectedQuote.id,
//                       "accepted"
//                     )
//                     setSelectedQuote(null)
//                   }}
//                   className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
//                 >
//                   <Check size={17} />
//                   Accept Quote
//                 </button>
//               )}

//               {selectedQuote.status !==
//                 "rejected" && (
//                 <button
//                   onClick={() => {
//                     handleQuoteStatus(
//                       selectedQuote.id,
//                       "rejected"
//                     )
//                     setSelectedQuote(null)
//                   }}
//                   className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
//                 >
//                   <Ban size={17} />
//                   Reject Quote
//                 </button>
//               )}

//               <button
//                 onClick={() =>
//                   setSelectedQuote(null)
//                 }
//                 className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// function StatCard({ label, value, icon: Icon }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-xs font-medium text-slate-500">
//             {label}
//           </p>

//           <p className="mt-1 text-2xl font-bold text-[#0b1f3a]">
//             {value}
//           </p>
//         </div>

//         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
//           <Icon size={19} />
//         </div>
//       </div>
//     </div>
//   )
// }

// function DetailRow({ label, value }) {
//   return (
//     <div>
//       <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
//         {label}
//       </p>

//       <div className="mt-1 text-sm font-medium text-slate-700">
//         {value}
//       </div>
//     </div>
//   )
// }

// export default AdminQuotes
