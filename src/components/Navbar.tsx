import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchProducts, fetchServices } from "@/lib/api";
import logo from "@/assets/logo.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";

  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories, retry: false });
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: fetchProducts, retry: false });
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: fetchServices, retry: false });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProductsOpen(false);
        setHoveredCategory(null);
      }
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on route change
  useEffect(() => {
    setProductsOpen(false);
    setHoveredCategory(null);
    setServicesOpen(false);
    setIsOpen(false);
    setMobileProductsOpen(false);
    setMobileServicesOpen(false);
  }, [location.pathname]);

  const handleCategoryClick = (cat: string) => {
    setProductsOpen(false);
    setHoveredCategory(null);
    navigate(`/products?category=${encodeURIComponent(cat)}`);
  };

  const handleProductClick = (productId: string) => {
    setProductsOpen(false);
    setHoveredCategory(null);
    navigate(`/products?product=${encodeURIComponent(productId)}`);
  };

  const getProductsForCategory = (catName: string) =>
    products.filter((p) => p.category === catName);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-slate-900 shadow-sm"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-0">
            <img src={logo} alt="Knack Solutions" className="h-28 w-auto transition-all duration-300" />
            <span className="font-display text-4xl font-bold tracking-tight leading-none -ml-3 text-gray-400">
              Knack Solutions
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.to === "/products" && categories.length > 0) {
                return (
                  <div key={link.to} className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => { setProductsOpen((v) => !v); setHoveredCategory(null); }}
                      className={`flex items-center gap-1 relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        location.pathname === link.to
                          ? "text-primary"
                          : "text-white/80 hover:text-white"
                      }`}
                    >
                      {link.label}
                      <ChevronDown size={14} className={`transition-transform duration-200 ${productsOpen ? "rotate-180" : ""}`} />
                      {location.pathname === link.to && (
                        <motion.div layoutId="nav-indicator" className="absolute inset-0 bg-primary/10 rounded-lg" transition={{ type: "spring", bounce: 0.2, duration: 0.4 }} />
                      )}
                    </button>

                    <AnimatePresence>
                      {productsOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-1 flex z-50"
                        >
                          {/* Main category list */}
                          <div className="w-52 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                            <button
                              onClick={() => { setProductsOpen(false); navigate("/products"); }}
                              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-primary transition-colors font-medium"
                            >
                              All Products
                            </button>
                            <div className="h-px bg-gray-100" />
                            {categories.map((c) => {
                              const catProducts = getProductsForCategory(c.name);
                              return (
                                <div
                                  key={c.id}
                                  className="relative"
                                  onMouseEnter={() => setHoveredCategory(c.name)}
                                >
                                  <button
                                    onClick={() => handleCategoryClick(c.name)}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                                      hoveredCategory === c.name
                                        ? "bg-orange-50 text-primary"
                                        : "text-gray-600 hover:bg-orange-50 hover:text-primary"
                                    }`}
                                  >
                                    {c.name}
                                    {catProducts.length > 0 && <ChevronRight size={14} className="text-gray-400" />}
                                  </button>
                                </div>
                              );
                            })}
                          </div>

                          {/* Submenu — products in hovered category */}
                          <AnimatePresence>
                            {hoveredCategory && getProductsForCategory(hoveredCategory).length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, x: -4 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -4 }}
                                transition={{ duration: 0.1 }}
                                className="ml-1 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden self-start"
                                onMouseEnter={() => setHoveredCategory(hoveredCategory)}
                              >
                                <div className="px-4 py-2 bg-orange-50 border-b border-orange-100">
                                  <p className="text-xs font-semibold text-primary uppercase tracking-wide">{hoveredCategory}</p>
                                </div>
                                {getProductsForCategory(hoveredCategory).map((p) => (
                                  <button
                                    key={p.id}
                                    onClick={() => handleProductClick(p.id)}
                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-orange-50 hover:text-primary transition-colors flex items-center gap-2"
                                  >
                                    {p.image && (
                                      <img src={p.image} alt={p.name} className="w-7 h-7 rounded object-cover flex-shrink-0 bg-gray-100" />
                                    )}
                                    <span className="truncate">{p.name}</span>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              if (link.to === "/services" && services.length > 0) {
                return (
                  <div key={link.to} className="relative" ref={servicesDropdownRef}>
                    <button
                      onClick={() => { setServicesOpen((v) => !v); }}
                      className={`flex items-center gap-1 relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        location.pathname === link.to ? "text-primary" : "text-white/80 hover:text-white"
                      }`}
                    >
                      {link.label}
                      <ChevronDown size={14} className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`} />
                      {location.pathname === link.to && (
                        <motion.div layoutId="nav-indicator" className="absolute inset-0 bg-primary/10 rounded-lg" transition={{ type: "spring", bounce: 0.2, duration: 0.4 }} />
                      )}
                    </button>
                    <AnimatePresence>
                      {servicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
                        >
                          <button
                            onClick={() => { setServicesOpen(false); navigate("/services"); }}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-primary transition-colors font-medium"
                          >
                            All Services
                          </button>
                          <div className="h-px bg-gray-100" />
                          {services.map((s) => (
                            <button
                              key={s.id}
                              onClick={() => { setServicesOpen(false); navigate(`/services?service=${encodeURIComponent(s.id)}`); }}
                              className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-orange-50 hover:text-primary transition-colors"
                            >
                              {s.name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    location.pathname === link.to
                      ? "text-primary"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {link.label}
                  {location.pathname === link.to && (
                    <motion.div layoutId="nav-indicator" className="absolute inset-0 bg-primary/10 rounded-lg" transition={{ type: "spring", bounce: 0.2, duration: 0.4 }} />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg transition-colors text-white/80 hover:bg-white/10"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isOpen ? "x" : "menu"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t bg-card/95 backdrop-blur-md"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div key={link.to} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  {link.to === "/products" && categories.length > 0 ? (
                    <>
                      <button
                        onClick={() => setMobileProductsOpen((v) => !v)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          location.pathname === link.to ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        {link.label}
                        <ChevronDown size={14} className={`transition-transform duration-200 ${mobileProductsOpen ? "rotate-180" : ""}`} />
                      </button>
                      {mobileProductsOpen && (
                        <div className="ml-4 mt-1 space-y-1">
                          <button onClick={() => { setIsOpen(false); navigate("/products"); }} className="block w-full text-left px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-primary hover:bg-orange-50 transition-colors font-medium">
                            All Products
                          </button>
                          {categories.map((c) => (
                            <div key={c.id}>
                              <button onClick={() => { setIsOpen(false); handleCategoryClick(c.name); }} className="block w-full text-left px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-primary hover:bg-orange-50 transition-colors font-medium">
                                → {c.name}
                              </button>
                              {getProductsForCategory(c.name).map((p) => (
                                <button key={p.id} onClick={() => { setIsOpen(false); handleProductClick(p.id); }} className="block w-full text-left pl-8 pr-4 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-primary hover:bg-orange-50 transition-colors">
                                  • {p.name}
                                </button>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : link.to === "/services" && services.length > 0 ? (
                    <>
                      <button
                        onClick={() => setMobileServicesOpen((v) => !v)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          location.pathname === link.to ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        {link.label}
                        <ChevronDown size={14} className={`transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`} />
                      </button>
                      {mobileServicesOpen && (
                        <div className="ml-4 mt-1 space-y-1">
                          <button onClick={() => { setIsOpen(false); navigate("/services"); }} className="block w-full text-left px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-primary hover:bg-orange-50 transition-colors font-medium">
                            All Services
                          </button>
                          {services.map((s) => (
                            <button key={s.id} onClick={() => { setIsOpen(false); navigate(`/services?service=${encodeURIComponent(s.id)}`); }} className="block w-full text-left px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-primary hover:bg-orange-50 transition-colors">
                              → {s.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname === link.to ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
