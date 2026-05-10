import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Globe } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import ClientMarquee from "@/components/ClientMarquee";
import { fetchProducts, Product } from "@/lib/api";

const features = [
  { icon: Zap, title: "Wide Product Range", desc: "Plastic pallets, stretch films, bubble wrap, strapping bands and more — all under one roof." },
  { icon: Shield, title: "Trusted Brands", desc: "We deal in quality-certified packaging materials from reliable manufacturers." },
  { icon: Globe, title: "Fast Delivery", desc: "Prompt supply to businesses across industries — when you need it, we deliver." },
];


const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const featuredProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[65vh] flex items-center overflow-hidden">

        {/* Background image — packaging/logistics dealership */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1553413077-190dd305871c?w=1920&q=80')` }}
        />

        {/* Heavy dark overlay for text clarity */}
        <div className="absolute inset-0 bg-slate-900/80" />
        {/* Left-side extra darkening where text sits */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/40" />

        {/* Animated slow zoom on background */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1553413077-190dd305871c?w=1920&q=80')`, zIndex: -1 }}
          animate={{ scale: [1.1, 1.15, 1.1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Animated shimmer lines */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {[10, 30, 50, 70, 90].map((pos) => (
            <motion.div
              key={pos}
              className="absolute h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent w-full"
              style={{ top: `${pos}%` }}
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 6 + pos / 20, repeat: Infinity, ease: "linear", delay: pos / 30 }}
            />
          ))}
        </div>

        {/* Glowing blob behind text */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[600px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={`p-${i}`}
            className="absolute rounded-full bg-orange-300/40"
            style={{
              width: Math.random() * 5 + 2,
              height: Math.random() * 5 + 2,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ y: [0, -60, 0], opacity: [0, 0.8, 0] }}
            transition={{
              duration: Math.random() * 4 + 4,
              delay: Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Content */}
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              Authorized Packaging Dealer
            </motion.div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-2xl"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}
            >
              Your Trusted Source for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
                Packaging Materials
              </span>
            </h1>
            <p className="text-lg text-white/90 mb-8 leading-relaxed max-w-lg drop-shadow-lg"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}
            >
              Knack Solutions is your one-stop dealer for plastic pallets, stretch films, bubble wraps, strapping bands, and all industrial packaging supplies — delivered fast, priced right.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/products">
                  View Products <ArrowRight size={18} />
                </Link>
              </Button>
              <Button variant="hero" size="lg" asChild>
                <Link to="/services">
                  View Services <ArrowRight size={18} />
                </Link>
              </Button>
              <Button size="lg" asChild className="border border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur">
                <Link to="/contact">Get a Quote</Link>
              </Button>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/10"
            >
              {[
                { value: "25+", label: "Products" },
                { value: "10+", label: "Trusted Clients" },
                { value: "10+", label: "Years Experience" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-white/50">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50/50 to-background" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Why Knack Solutions?"
            subtitle="Quality packaging materials that protect your products and streamline your operations."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center p-8 rounded-xl bg-white border border-orange-100 hover:shadow-card hover:border-orange-200 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-orange-100 flex items-center justify-center">
                  <f.icon size={24} className="text-orange-500" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {isLoading ? (
        <section className="py-24">
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </section>
      ) : featuredProducts.length > 0 && (
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-slate-50 to-orange-50/30" />
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Featured Products"
              subtitle="Handpicked innovations from our latest collection."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} onClick={setSelectedProduct} index={i} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" asChild>
                <Link to="/products">
                  View All Products <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
      <ProductModal product={selectedProduct} open={!!selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
};

export default Index;
