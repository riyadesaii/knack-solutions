import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Service } from "@/lib/api";
import { X } from "lucide-react";
import { useState } from "react";

interface ServiceModalProps {
  service: Service | null;
  open: boolean;
  onClose: () => void;
}

const ServiceModal = ({ service, open, onClose }: ServiceModalProps) => {
  const [imgError, setImgError] = useState(false);
  if (!service) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-card/80 backdrop-blur text-foreground hover:bg-muted transition-colors"
        >
          <X size={18} />
        </button>
        {service.image && !imgError ? (
          <div className="relative aspect-video bg-gray-100">
            <img
              src={service.image}
              alt={service.name}
              className="w-full h-full object-contain p-6"
              onError={() => setImgError(true)}
            />
          </div>
        ) : imgError ? (
          <div className="aspect-video bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
            <span className="text-sm font-medium text-muted-foreground px-6 text-center">{service.name}</span>
          </div>
        ) : null}
        <div className="p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{service.name}</DialogTitle>
            <DialogDescription className="text-muted-foreground leading-relaxed pt-1">
              {service.description}
            </DialogDescription>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceModal;
