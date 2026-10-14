import { useEffect, useMemo, useState } from "react";

import { Link, useSearchParams } from "react-router-dom";

import {
  Search,
  MapPin,
  Package,
  CheckCircle2,
  ArrowRight,
  SlidersHorizontal,
  ChevronDown,
  X,
  Building2,
} from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState([]);

  const [companies, setCompanies] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All Categories");

  const [supplier, setSupplier] = useState("All Suppliers");

  const [availability, setAvailability] = useState("All Availability");

  const [showFilters, setShowFilters] = useState(false);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const loadMarketplace = async () => {
      setLoading(true);

      setError("");

      try {
        const [productsResponse, companiesResponse] = await Promise.all([
          fetch("/api/products"),

          fetch("/api/suppliers"),
        ]);

        if (!productsResponse.ok) throw new Error("Failed to fetch products");

        const productsData = await productsResponse.json();

        if (!productsData.success)
          throw new Error("Product API returned an error");

        setProducts(productsData.products || []); // Companies are fetched independently, so service providers without products can appear.

        if (companiesResponse.ok) {
          const companiesData = await companiesResponse.json();

          setCompanies(companiesData.suppliers || []);
        } else {
          setCompanies([]);

          console.error("Failed to fetch companies directory");
        }
      } catch (err) {
        console.error("Marketplace fetch error:", err);

        setError("Unable to load marketplace results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadMarketplace();
  }, []);

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");

    setCategory(categoryFromUrl || "All Categories");
  }, [searchParams]);

  const categories = useMemo(() => {
    const productCategories = products.map((p) => p?.category).filter(Boolean);

    const companyCategories = companies.map((c) => c?.industry).filter(Boolean);

    return [
      "All Categories",

      ...[
        ...new Set(
          [...productCategories, ...companyCategories]

            .map((v) => String(v).trim())

            .filter(Boolean),
        ),
      ].sort((a, b) => a.localeCompare(b)),
    ];
  }, [products, companies]);

  const suppliers = useMemo(() => {
    const productSuppliers = products

      .map((p) => p?.supplier_name)

      .filter(Boolean);

    const companyNames = companies.map((c) => c?.name).filter(Boolean);

    return [
      "All Suppliers",

      ...[
        ...new Set(
          [...productSuppliers, ...companyNames].map((v) => String(v).trim()),
        ),
      ].sort((a, b) => a.localeCompare(b)),
    ];
  }, [products, companies]);

  const availabilityOptions = useMemo(() => {
    const values = products

      .map((p) => p?.availability)

      .filter(Boolean)

      .map(String);

    return [
      "All Availability",

      ...[...new Set(values)].sort((a, b) => a.localeCompare(b)),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        [
          product.name,

          product.category,

          product.subcategory,

          product.description,

          product.supplier_name,
        ]

          .filter(Boolean)

          .some((value) => String(value).toLowerCase().includes(query));

      const matchesCategory =
        category === "All Categories" ||
        String(product.category || "")
          .trim()

          .toLowerCase() === category.trim().toLowerCase();

      const matchesSupplier =
        supplier === "All Suppliers" || product.supplier_name === supplier;

      const matchesAvailability =
        availability === "All Availability" ||
        product.availability === availability;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSupplier &&
        matchesAvailability
      );
    });
  }, [products, search, category, supplier, availability]);

  const categoryMatchesCompany = (selectedCategory, company, services) => {
    if (selectedCategory === "All Categories") return true;

    const normalize = (value) =>
      String(value || "")
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, " ")
        .trim();

    const selected = normalize(selectedCategory);
    const primaryValues = [company.industry, company.business_type, ...services]
      .filter(Boolean)
      .map(normalize);
    const allValues = [
      ...primaryValues,
      ...[company.description].filter(Boolean).map(normalize),
    ];

    if (
      allValues.some(
        (value) =>
          value === selected ||
          value.includes(selected) ||
          selected.includes(value),
      )
    )
      return true;

    const groups = [
      {
        keys: [
          "logistic",
          "freight",
          "cargo",
          "shipping",
          "transport",
          "carrier",
          "moving",
          "mover",
          "packer",
        ],
        terms: [
          "logistic",
          "freight",
          "cargo",
          "shipping",
          "transport",
          "carrier",
          "moving",
          "mover",
          "packer",
          "delivery",
          "truck",
          "warehouse",
        ],
      },
      {
        keys: [
          "software",
          "technology",
          "web development",
          "information technology",
          " it ",
        ],
        terms: [
          "software",
          "technology",
          "web development",
          "information technology",
          "computer",
          "app development",
          "programming",
          "it services",
        ],
      },
      {
        keys: ["cleaning", "facility", "housekeeping"],
        terms: [
          "cleaning",
          "facility",
          "housekeeping",
          "janitorial",
          "sanitation",
        ],
      },
      {
        keys: ["construction", "building", "contractor"],
        terms: [
          "construction",
          "building",
          "contractor",
          "civil",
          "infrastructure",
        ],
      },
      {
        keys: ["marketing", "advertising", "branding"],
        terms: [
          "marketing",
          "advertising",
          "branding",
          "seo",
          "social media",
          "promotion",
        ],
      },
    ];
    const group = groups.find(({ keys }) =>
      keys.some((key) => selected.includes(normalize(key))),
    );
    if (
      group &&
      allValues.some((value) =>
        group.terms.some((term) => value.includes(normalize(term))),
      )
    )
      return true;

    const words = selected.split(" ").filter((word) => word.length >= 4);
    return (
      words.length > 0 &&
      primaryValues.some((value) =>
        words.some((word) => value.split(" ").includes(word)),
      )
    );
  }; // that do not have product listings. Search and supplier filters do not control
  // which companies appear in this sidebar.

  // Show companies related to the selected category, including service providers

  const filteredCompanies = useMemo(() => {
    if (category === "All Categories") return companies;

    return companies.filter((company) => {
      const services = Array.isArray(company.services)
        ? company.services
        : String(company.services || "")
            .split(/[,;|]/)

            .map((service) => service.trim())

            .filter(Boolean);

      return categoryMatchesCompany(category, company, services);
    });
  }, [companies, category]);

  const clearFilters = () => {
    setSearch("");

    setCategory("All Categories");

    setSupplier("All Suppliers");

    setAvailability("All Availability");
  };

  const formatPrice = (price) => {
    if (
      price === null ||
      price === undefined ||
      price === "" ||
      Number(price) === 0
    )
      return "Price on Request";

    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  const formatMOQ = (product) => {
    if (!product?.moq) return "MOQ on Request";

    return `${Number(product.moq).toLocaleString("en-IN")} ${product.moq_unit || ""}`.trim();
  };

  return (
    <main className="min-h-screen bg-slate-50">
           {" "}
      <section className="bg-[#0952d4]">
               {" "}
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
                   {" "}
          <div className="mx-auto max-w-3xl text-center">
                       {" "}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white">
                            <Package size={15} /> B2B Products & Services
              Marketplace            {" "}
            </div>
                       {" "}
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                            Discover Products              {" "}
              <span className="block text-orange-300">& Trusted Companies</span>
                         {" "}
            </h1>
                       {" "}
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
                            Explore products, manufacturers, suppliers and
              service providers               across India—even when a company
              has no product listings.            {" "}
            </p>
                       {" "}
            <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-2 rounded-2xl bg-white p-2 shadow-2xl sm:flex-row">
                           {" "}
              <div className="flex flex-1 items-center gap-3 px-3">
                               {" "}
                <Search size={21} className="shrink-0 text-slate-400" />
                               {" "}
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products, companies or services..."
                  className="w-full bg-transparent py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 sm:text-base"
                />
                             {" "}
              </div>
                           {" "}
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 py-3 font-bold text-white transition hover:bg-orange-600"
              >
                                Search <Search size={17} />             {" "}
              </button>
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </section>
           {" "}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
               {" "}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
                   {" "}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                       {" "}
            <div>
                           {" "}
              <h2 className="text-xl font-bold text-[#0b1f3a]">
                                Products & Companies              {" "}
              </h2>
                           {" "}
              <p className="mt-1 text-sm text-slate-500">
                               {" "}
                {loading
                  ? "Loading marketplace..."
                  : `${filteredProducts.length} products · ${filteredCompanies.length} companies found`}
                             {" "}
              </p>
                         {" "}
            </div>
                       {" "}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 lg:hidden"
            >
                            <SlidersHorizontal size={17} /> Filters          
               {" "}
            </button>
                     {" "}
          </div>
                 {" "}
        </div>
               {" "}
        <div className="flex flex-col gap-6 lg:flex-row">
                   {" "}
          <aside
            className={`w-full shrink-0 lg:block lg:w-64 ${showFilters ? "block" : "hidden"}`}
          >
                       {" "}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-24">
                           {" "}
              <div className="mb-5 flex items-center justify-between">
                               {" "}
                <h3 className="font-bold text-[#0b1f3a]">Filters</h3>           
                   {" "}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                                    Clear all                {" "}
                </button>
                             {" "}
              </div>
                           {" "}
              <FilterSelect
                label="Category"
                value={category}
                onChange={setCategory}
                options={categories}
              />
                           {" "}
              <div className="mt-5">
                               {" "}
                <FilterSelect
                  label="Supplier / Company"
                  value={supplier}
                  onChange={setSupplier}
                  options={suppliers}
                />
                             {" "}
              </div>
                           {" "}
              <div className="mt-5">
                               {" "}
                <FilterSelect
                  label="Availability"
                  value={availability}
                  onChange={setAvailability}
                  options={availabilityOptions}
                />
                             {" "}
              </div>
                           {" "}
              <div className="mt-6 rounded-xl bg-blue-50 p-4">
                               {" "}
                <CheckCircle2 size={22} className="text-blue-600" />           
                   {" "}
                <h4 className="mt-2 text-sm font-bold text-[#0b1f3a]">
                                    Source with confidence                {" "}
                </h4>
                               {" "}
                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Compare products, explore company services
                  and contact                   suppliers directly.            
                     {" "}
                </p>
                             {" "}
              </div>
                         {" "}
            </div>
                     {" "}
          </aside>
                   {" "}
          <div className="min-w-0 flex-1">
                       {" "}
            {(category !== "All Categories" ||
              supplier !== "All Suppliers" ||
              availability !== "All Availability" ||
              search) && (
              <div className="mb-5 flex flex-wrap items-center gap-2">
                               {" "}
                <span className="text-xs font-semibold text-slate-500">
                                    Active filters:                {" "}
                </span>
                               {" "}
                {search && (
                  <FilterChip
                    label={`Search: ${search}`}
                    onClick={() => setSearch("")}
                  />
                )}
                               {" "}
                {category !== "All Categories" && (
                  <FilterChip
                    label={category}
                    onClick={() => setCategory("All Categories")}
                  />
                )}
                               {" "}
                {supplier !== "All Suppliers" && (
                  <FilterChip
                    label={supplier}
                    onClick={() => setSupplier("All Suppliers")}
                  />
                )}
                               {" "}
                {availability !== "All Availability" && (
                  <FilterChip
                    label={availability}
                    onClick={() => setAvailability("All Availability")}
                  />
                )}
                             {" "}
              </div>
            )}
                       {" "}
            {error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
                               {" "}
                <p className="text-sm font-semibold text-red-600">{error}</p>   
                           {" "}
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white"
                >
                                    Retry                {" "}
                </button>
                             {" "}
              </div>
            )}
                       {" "}
            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                               {" "}
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
                  >
                                       {" "}
                    <div className="h-36 rounded-xl bg-slate-200" />
                                       {" "}
                    <div className="mt-5 h-4 w-3/4 rounded bg-slate-200" />
                                       {" "}
                    <div className="mt-3 h-3 w-1/2 rounded bg-slate-200" />     
                               {" "}
                  </div>
                ))}
                             {" "}
              </div>
            ) : (
              <div className="space-y-10">
                               {" "}
                {filteredCompanies.length > 0 && (
                  <section className="mb-10">
                                       {" "}
                    <div className="mb-4">
                                           {" "}
                      <h2 className="text-xl font-bold text-[#0b1f3a]">
                                                Companies & Service Providers  
                                           {" "}
                      </h2>
                                           {" "}
                      <p className="mt-1 text-sm text-slate-500">
                                                All registered companies and
                        service providers, even if                         they
                        have no product listings.                      {" "}
                      </p>
                                         {" "}
                    </div>
                                       {" "}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                           {" "}
                      {filteredCompanies.map((company) => {
                        const services = Array.isArray(company.services)
                          ? company.services.join(", ")
                          : company.services;

                        return (
                          <article
                            key={`company-${company.id}`}
                            className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                          >
                                                       {" "}
                            <div className="flex items-start gap-3">
                                                           {" "}
                              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-blue-50 text-blue-700">
                                                               {" "}
                                {company.image_url ? (
                                  <img
                                    src={company.image_url}
                                    alt={company.name || "Company"}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <Building2 size={24} />
                                )}
                                                             {" "}
                              </div>
                                                           {" "}
                              <div className="min-w-0 flex-1">
                                                               {" "}
                                <h3 className="line-clamp-2 font-bold text-[#0b1f3a]">
                                                                   {" "}
                                  {company.name || "Business"}                 
                                               {" "}
                                </h3>
                                                               {" "}
                                <p className="mt-1 text-xs text-slate-500">
                                                                   {" "}
                                  {company.industry ||
                                    company.business_type ||
                                    "Service Provider"}
                                                                 {" "}
                                </p>
                                                             {" "}
                              </div>
                                                           {" "}
                              {company.verified && (
                                <CheckCircle2
                                  size={17}
                                  className="shrink-0 text-blue-600"
                                  aria-label="Verified company"
                                />
                              )}
                                                         {" "}
                            </div>
                                                       {" "}
                            <div className="mt-4 flex items-center gap-1 text-sm text-slate-500">
                                                            <MapPin size={14} />
                                                           {" "}
                              <span className="truncate">
                                                               {" "}
                                {company.location || "Location not provided"}   
                                                         {" "}
                              </span>
                                                         {" "}
                            </div>
                                                       {" "}
                            <p className="mt-4 line-clamp-4 min-h-[5rem] flex-1 text-sm leading-6 text-slate-600">
                                                           {" "}
                              {company.description ||
                                services ||
                                "Contact this company to learn more about its products and services."}
                                                         {" "}
                            </p>
                                                       {" "}
                            {company.years_in_business != null && (
                              <p className="mt-2 text-xs text-slate-500">
                                                               {" "}
                                {company.years_in_business} years in business  
                                                           {" "}
                              </p>
                            )}
                                                       {" "}
                            <Link
                              to={`/suppliers/${company.id}`}
                              className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-blue-200 px-4 py-3 text-sm font-bold text-[#0952d4] transition hover:bg-blue-50"
                            >
                                                            View Company{" "}
                              <ArrowRight size={16} />                         
                               {" "}
                            </Link>
                                                     {" "}
                          </article>
                        );
                      })}
                                         {" "}
                    </div>
                                     {" "}
                  </section>
                )}
                               {" "}
                {filteredProducts.length > 0 && (
                  <section className="w-full">
                                       {" "}
                    <div className="mb-4">
                                           {" "}
                      <h2 className="text-xl font-bold text-[#0b1f3a]">
                                                Products                    
                         {" "}
                      </h2>
                                           {" "}
                      <p className="mt-1 text-sm text-slate-500">
                                                {filteredProducts.length}{" "}
                        product listings                      {" "}
                      </p>
                                         {" "}
                    </div>
                                       {" "}
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                           {" "}
                      {filteredProducts.map((product) => (
                        <article
                          key={product.id}
                          className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                        >
                                                   {" "}
                          <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                                                       {" "}
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name || "Product"}
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <Package
                                size={55}
                                strokeWidth={1.3}
                                className="text-slate-400"
                              />
                            )}
                                                     {" "}
                          </div>
                                                   {" "}
                          <div className="p-5">
                                                       {" "}
                            <div className="flex items-center justify-between gap-3">
                                                           {" "}
                              <span className="max-w-[80%] truncate rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                                               {" "}
                                {product.category || "General"}                 
                                           {" "}
                              </span>
                                                           {" "}
                              {product.supplier_verified && (
                                <CheckCircle2
                                  size={17}
                                  className="shrink-0 text-blue-600"
                                />
                              )}
                                                         {" "}
                            </div>
                                                       {" "}
                            <h3 className="mt-4 line-clamp-2 text-lg font-bold text-[#0b1f3a]">
                                                           {" "}
                              {product.name || "Unnamed Product"}               
                                         {" "}
                            </h3>
                                                       {" "}
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                                                           {" "}
                              {product.description ||
                                "Product information available from supplier."}
                                                         {" "}
                            </p>
                                                       {" "}
                            <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
                                                           {" "}
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-700">
                                                               {" "}
                                {product.supplier_name

                                  ?.split(" ")

                                  .slice(0, 2)

                                  .map((word) => word[0])

                                  .join("")

                                  .toUpperCase() || "SU"}
                                                             {" "}
                              </div>
                                                           {" "}
                              <div className="min-w-0">
                                                               {" "}
                                <p className="truncate text-sm font-semibold text-slate-700">
                                                                   {" "}
                                  {product.supplier_name || "Supplier"}         
                                                       {" "}
                                </p>
                                                               {" "}
                                <div className="flex items-center gap-1 text-xs text-slate-400">
                                                                   {" "}
                                  <MapPin size={12} />                         
                                          {product.supplier_location || "India"}
                                                                 {" "}
                                </div>
                                                             {" "}
                              </div>
                                                         {" "}
                            </div>
                                                       {" "}
                            <div className="mt-4 grid grid-cols-2 gap-2">
                                                           {" "}
                              <div className="rounded-xl bg-slate-50 p-3">
                                                               {" "}
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                                                    MOQ        
                                                         {" "}
                                </p>
                                                               {" "}
                                <p className="mt-1 truncate text-sm font-bold text-[#0b1f3a]">
                                                                   {" "}
                                  {formatMOQ(product)}                         
                                       {" "}
                                </p>
                                                             {" "}
                              </div>
                                                           {" "}
                              <div className="rounded-xl bg-slate-50 p-3">
                                                               {" "}
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                                                    Availability
                                                                 {" "}
                                </p>
                                                               {" "}
                                <p className="mt-1 truncate text-sm font-bold text-[#0b1f3a]">
                                                                   {" "}
                                  {product.availability || "On Request"}       
                                                         {" "}
                                </p>
                                                             {" "}
                              </div>
                                                         {" "}
                            </div>
                                                       {" "}
                            <div className="mt-3 rounded-xl bg-orange-50 p-3">
                                                           {" "}
                              <p className="text-xs font-medium text-slate-400">
                                                                PRICE          
                                                   {" "}
                              </p>
                                                           {" "}
                              <p className="mt-1 text-base font-bold text-orange-500">
                                                               {" "}
                                {formatPrice(product.price)}                   
                                           {" "}
                                {product.price_unit && (
                                  <span className="ml-1 text-xs font-medium text-slate-400">
                                                                        /{" "}
                                    {product.price_unit}                       
                                             {" "}
                                  </span>
                                )}
                                                             {" "}
                              </p>
                                                         {" "}
                            </div>
                                                       {" "}
                            <Link
                              to={`/products/${product.id}`}
                              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#0952d4] px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                            >
                                                            View Product{" "}
                              <ArrowRight size={16} />                         
                               {" "}
                            </Link>
                                                     {" "}
                          </div>
                                                 {" "}
                        </article>
                      ))}
                                         {" "}
                    </div>
                                     {" "}
                  </section>
                )}
                               {" "}
                {filteredProducts.length === 0 &&
                  filteredCompanies.length === 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
                                           {" "}
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                                               {" "}
                        <Search size={25} className="text-slate-400" />         
                                   {" "}
                      </div>
                                           {" "}
                      <h3 className="mt-5 text-lg font-bold text-[#0b1f3a]">
                                                No products or companies found  
                                           {" "}
                      </h3>
                                           {" "}
                      <p className="mt-2 text-sm text-slate-500">
                                                Try another search or category.
                                             {" "}
                      </p>
                                           {" "}
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-5 rounded-xl bg-[#0952d4] px-5 py-2.5 text-sm font-semibold text-white"
                      >
                                                Clear Filters                  
                           {" "}
                      </button>
                                         {" "}
                    </div>
                  )}
                             {" "}
              </div>
            )}
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </section>
         {" "}
    </main>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
           {" "}
      <label className="mb-2 block text-sm font-semibold text-slate-700">
                {label}     {" "}
      </label>
           {" "}
      <div className="relative">
               {" "}
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-3 pr-9 text-sm outline-none focus:border-blue-500"
        >
                   {" "}
          {options.map((item) => (
            <option key={item} value={item}>
                            {item}           {" "}
            </option>
          ))}
                 {" "}
        </select>
               {" "}
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
             {" "}
      </div>
         {" "}
    </div>
  );
}

function FilterChip({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
    >
            {label}
            <X size={12} />   {" "}
    </button>
  );
}
