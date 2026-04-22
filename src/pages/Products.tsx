import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import { fetchProducts, fetchCategories, Product } from "@/lib/api";

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string>(searchParams.get("category") || "All");

  useEffect(() => {
    const cat = searchParams.get("category");
    setActiveCategory(cat || "All");
  }, [searchParams]);

  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: fetchProducts, retry: false });
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories, retry: false });

  const filtered = activeCategory === "All"
    ? products
    : products.filter((p) => p.category === activeCategory);

  // Group by category when "All" is selected
  const grouped = categories
    .map((c) => ({ name: c.name, items: products.filter((p) => p.category === c.name) }))
    .filter((g) => g.items.length > 0);
  const uncategorized = products.filter((p) => !p.category);

  return (
    <div className="min-h-screen pt-16 overflow-hidden">

      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50/60 to-background" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-orange-200/30 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-amber-200/20 blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 border border-orange-200 text-orange-600 text-sm font-medium mb-6">
              <Package size={14} />
              Our Product Range
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Quality <span className="text-gradient">Packaging</span> Materials
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Explore our complete range of industrial packaging supplies — built for durability, priced for value.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="bg-white border-b sticky top-16 z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
              {["All", ...categories.map((c) => c.name)].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    if (cat === "All") setSearchParams({});
                    else setSearchParams({ category: cat });
                  }}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                    activeCategory === cat
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <section className="pb-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          {products.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-foreground font-semibold text-lg mb-2">Premium Packaging Solutions Coming Your Way</p>
              <p className="text-muted-foreground text-sm">From plastic pallets to stretch films — our full range is just a call away. Contact us for a personalised quote.</p>
            </motion.div>
          ) : activeCategory !== "All" ? (
            // Filtered view
            filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} onClick={setSelectedProduct} index={i} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-24">No products in this category.</p>
            )
          ) : (
            // All — grouped by category
            <div className="space-y-14">
              {grouped.map((group) => (
                <div key={group.name}>
                  <h2 className="font-display text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                    {group.name}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {group.items.map((product, i) => (
                      <ProductCard key={product.id} product={product} onClick={setSelectedProduct} index={i} />
                    ))}
                  </div>
                </div>
              ))}
              {uncategorized.length > 0 && (
                <div>
                  {grouped.length > 0 && (
                    <h2 className="font-display text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                      Other Products
                    </h2>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {uncategorized.map((product, i) => (
                      <ProductCard key={product.id} product={product} onClick={setSelectedProduct} index={i} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <ProductModal product={selectedProduct} open={!!selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
};

export default Products;
