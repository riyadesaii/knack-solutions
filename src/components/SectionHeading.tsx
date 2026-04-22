import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

const SectionHeading = ({ title, subtitle, centered = true }: SectionHeadingProps) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className={`mb-14 ${centered ? "text-center" : ""}`}
  >
    <div className={`inline-block ${centered ? "" : ""}`}>
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">{title}</h2>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className={`h-1 rounded-full bg-gradient-to-r from-orange-400 to-amber-400 mb-4 ${centered ? "mx-auto" : ""}`}
        style={{ width: "60px", transformOrigin: centered ? "center" : "left" }}
      />
    </div>
    {subtitle && (
      <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-base">{subtitle}</p>
    )}
  </motion.div>
);

export default SectionHeading;
