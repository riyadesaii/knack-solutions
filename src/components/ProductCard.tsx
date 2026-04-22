import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { Product, BASE_URL } from "@/lib/api";

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  index: number;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const [imgError, setImgError] = useState(false);
  useEffect(() => { setImgError(false); }, [product.image]);
  return (
  <motion.div
    whileHover={{ y: -8, scale: 1.02 }}
    onClick={() => onClick(product)}
    className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-500 shine"
  >
    <div className="relative overflow-hidden aspect-[3/2]" style={{ background: 'linear-gradient(135deg, #e8edf2 0%, #d0d8e4 100%)' }}>
      {product.image && !imgError ? (
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
          style={{ filter: 'contrast(1.05) saturate(1.1)' }}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
          {imgError ? (
            <span className="text-sm font-medium text-muted-foreground px-4 text-center">{product.name}</span>
          ) : (
            <div className="text-4xl opacity-30">📦</div>
          )}
        </div>
      )}
      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end justify-center pb-4">
        <span className="flex items-center gap-2 text-white text-sm font-medium bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
          <Eye size={14} /> View Details
        </span>
      </div>
    </div>
    <div className="p-5">
      <h3 className="font-display text-lg font-semibold text-gray-900 mb-1.5 group-hover:text-primary transition-colors duration-300">{product.name}</h3>
      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{product.description}</p>
      <div className="mt-3 flex items-center gap-1 text-primary text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span>Learn more</span>
        <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1, repeat: Infinity }}>→</motion.span>
      </div>
    </div>
  </motion.div>
  );
};

export default ProductCard;
