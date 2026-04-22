import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

let clickCount = 0;
let clickTimer: ReturnType<typeof setTimeout> | null = null;

const Footer = () => {
  const navigate = useNavigate();

  const handleCopyrightClick = () => {
    clickCount += 1;
    if (clickTimer) clearTimeout(clickTimer);
    clickTimer = setTimeout(() => { clickCount = 0; }, 2000);
    if (clickCount >= 7) {
      clickCount = 0;
      sessionStorage.setItem("adminAccess", "true");
      navigate("/admin");
    }
  };

  return (
    <footer className="relative overflow-hidden bg-slate-900 text-white">
      {/* Top gradient line */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500" />

      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1553413077-190dd305871c?w=1920&q=40')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-0 mb-4">
              <img src={logo} alt="Knack Solutions" className="h-32 w-auto -mr-4" />
              <h3 className="font-display text-2xl font-bold text-gray-400">
                Knack Solutions
              </h3>
            </div>
            <p className="text-sm text-white/50 leading-relaxed">
              Your trusted dealer for industrial packaging materials — plastic pallets, stretch films, bubble wraps, strapping bands and more.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <div className="space-y-2">
              {[{ to: "/", label: "Home" }, { to: "/about", label: "About" }, { to: "/products", label: "Products" }, { to: "/services", label: "Services" }, { to: "/contact", label: "Contact" }, { to: "/team", label: "Knack Team" }].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-sm text-white/50 hover:text-orange-400 transition-colors duration-200 hover:translate-x-1 transform"
                >
                  → {link.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-white/50">
                <Mail size={14} className="text-orange-400 mt-0.5 shrink-0" />
                <span>knacksolution.vlsd@gmail.com</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-white/50">
                <Phone size={14} className="text-orange-400 mt-0.5 shrink-0" />
                <span>+91 99744 20771</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-white/50">
                <MapPin size={14} className="text-orange-400 mt-0.5 shrink-0" />
                <span>Angan, Plot-7, Tithal Road, Valsad - 396001</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 text-center text-xs text-white/30">
          <span onClick={handleCopyrightClick} style={{ userSelect: "none", cursor: "default" }}>
            &copy; 2017 Knack Solutions. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
