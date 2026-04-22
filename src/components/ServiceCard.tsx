import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { Service } from "@/lib/api";

interface ServiceCardProps {
  service: Service;
  onClick: (service: Service) => void;
}

const ServiceCard = ({ service, onClick }: ServiceCardProps) => {
  const [imgError, setImgError] = useState(false);
  useEffect(() => { setImgError(false); }, [service.image]);

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={() => onClick(service)}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-500 shine"
    >
      <div className="relative overflow-hidden aspect-[3/2]" style={{ background: 'linear-gradient(135deg, #e8edf2 0%, #d0d8e4 100%)' }}>
        {service.image && !imgError ? (
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
            style={{ filter: 'contrast(1.05) saturate(1.1)' }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
            {imgError ? (
              <span className="text-sm font-medium text-muted-foreground px-4 text-center">{service.name}</span>
            ) : (
              <div className="text-4xl opacity-30">🔧</div>
            )}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end justify-center pb-4">
          <span className="flex items-center gap-2 text-white text-sm font-medium bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
            <Eye size={14} /> View Details
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-gray-900 mb-1.5 group-hover:text-primary transition-colors duration-300">{service.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{service.description}</p>
        <div className="mt-3 flex items-center gap-1 text-primary text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span>Learn more</span>
          <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1, repeat: Infinity }}>→</motion.span>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
