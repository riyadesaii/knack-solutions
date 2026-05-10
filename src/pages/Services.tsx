import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Wrench } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { fetchServices, Service } from "@/lib/api";
import ServiceCard from "@/components/ServiceCard";
import ServiceModal from "@/components/ServiceModal";
import { useState } from "react";

const Services = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
    retry: false,
  });

  const serviceId = searchParams.get("service");
  const singleService = serviceId ? services.find((s) => s.id === serviceId) : null;

  return (
    <div className="min-h-screen pt-16 overflow-hidden">

      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50/60 to-background" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-orange-200/30 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 border border-orange-200 text-orange-600 text-sm font-medium mb-6">
              <Wrench size={14} />
              What We Offer
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Our <span className="text-gradient">Services</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Beyond products, we offer expert services to support your packaging and logistics needs.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : singleService ? (
            // Single service detail view
            <div className="max-w-5xl mx-auto">
              <button
                onClick={() => setSearchParams({})}
                className="mb-8 text-sm text-primary hover:underline flex items-center gap-1"
              >
                ← Back to all services
              </button>
              <div className="rounded-3xl overflow-hidden border border-gray-200 shadow-lg bg-white">
                <div className="relative w-full h-80 sm:h-96" style={{ background: 'linear-gradient(135deg, #e8edf2 0%, #d0d8e4 100%)' }}>
                  {singleService.image ? (
                    <img
                      src={singleService.image}
                      alt={singleService.name}
                      className="w-full h-full object-contain p-6"
                      style={{ filter: 'contrast(1.05) saturate(1.1)' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-8xl opacity-20">🔧</div>
                  )}
                </div>
                <div className="p-8 sm:p-12">
                  <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">{singleService.name}</h2>
                  <div className="w-16 h-1 bg-primary rounded mb-6" />
                  <p className="text-gray-600 leading-relaxed text-lg max-w-2xl">{singleService.description}</p>
                </div>
              </div>
            </div>
          ) : services.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
              <div className="text-6xl mb-4">🔧</div>
              <p className="text-foreground font-semibold text-lg mb-2">Expert Packaging Services at Your Doorstep</p>
              <p className="text-muted-foreground text-sm">Need palletization, container stuffing or custom packaging support? Get in touch and we'll tailor a solution for you.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} onClick={setSelectedService} />
              ))}
            </div>
          )}
        </div>
      </section>

      <ServiceModal service={selectedService} open={!!selectedService} onClose={() => setSelectedService(null)} />
    </div>
  );
};

export default Services;
