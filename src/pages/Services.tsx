import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Wrench } from "lucide-react";
import { fetchServices, Service } from "@/lib/api";
import ServiceCard from "@/components/ServiceCard";
import ServiceModal from "@/components/ServiceModal";

const Services = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
    retry: false,
  });

  return (
    <div className="min-h-screen pt-16 overflow-hidden">

      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50/60 to-background" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-orange-200/30 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 border border-orange-200 text-orange-600 text-sm font-medium mb-6"
            >
              <Wrench size={14} />
              What We Offer
            </motion.div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Our <span className="text-gradient">Services</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Beyond products, we offer expert services to support your packaging and logistics needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} onClick={setSelectedService} />
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
              <div className="text-6xl mb-4">🔧</div>
              <p className="text-foreground font-semibold text-lg mb-2">Expert Packaging Services at Your Doorstep</p>
              <p className="text-muted-foreground text-sm">Need palletization, container stuffing or custom packaging support? Get in touch and we'll tailor a solution for you.</p>
            </motion.div>
          )}
        </div>
      </section>

      <ServiceModal service={selectedService} open={!!selectedService} onClose={() => setSelectedService(null)} />
    </div>
  );
};
export default Services;
