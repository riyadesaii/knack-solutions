import { motion } from "framer-motion";
import { Target, Eye, Heart, Package, Shield, Truck, Award } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const values = [
  { icon: Target, title: "Mission", text: "To provide cost-efficient, superior packaging solutions that ensure the safe handling and transportation of goods — empowering businesses with reliable products and expert support.", color: "from-orange-400 to-red-400" },
  { icon: Eye, title: "Vision", text: "To be the most trusted packaging materials dealer in the region, known for quality products, prompt delivery, and lasting client relationships.", color: "from-amber-400 to-orange-400" },
  { icon: Heart, title: "Values", text: "Integrity, reliability, and customer-centricity drive everything we do. We believe in building partnerships that go beyond transactions.", color: "from-yellow-400 to-amber-400" },
];

const stats = [
  { icon: Package, value: "25+", label: "Products" },
  { icon: Award, value: "2017", label: "Founded" },
  { icon: Shield, value: "10+", label: "Trusted Clients" },
  { icon: Truck, value: "10+", label: "Years Experience" },
];

const About = () => (
  <div className="min-h-screen pt-24 overflow-hidden">

    {/* Hero banner */}
    <section className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900" />
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1553413077-190dd305871c?w=1920&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent" />

      {/* Animated particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-orange-400/30"
          style={{ width: Math.random() * 6 + 2, height: Math.random() * 6 + 2, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
          animate={{ y: [0, -50, 0], opacity: [0, 0.7, 0] }}
          transition={{ duration: Math.random() * 4 + 4, delay: Math.random() * 4, repeat: Infinity }}
        />
      ))}

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 text-sm font-medium mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            Est. 2017 — Valsad, Gujarat
          </motion.div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Knack Solutions</span>
          </h1>
          <p className="text-lg text-white/80 leading-relaxed max-w-2xl">
            Founded in 2017, <strong className="text-white">Knack Solutions</strong> is dedicated to revolutionizing the world of cargo safety with a diverse range of innovative packing solutions.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Stats bar */}
    <section className="py-10 bg-white border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                <s.icon size={22} className="text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-foreground font-display">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Story */}
    <section className="py-24 relative">
      <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-orange-50/50 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.7 }}
          >
            <SectionHeading title="Who We Are" centered={false} />
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                At <strong className="text-foreground">Knack Solutions</strong>, we understand the critical importance of secure cargo. Our comprehensive product line includes anti-slip sheets, container lashing, plastic seals, dunnage bags, and much more — each designed with precision and durability in mind.
              </p>
              <p>
                Our team of skilled professionals is trained in advanced export packing techniques, including palletization and container stuffing. We ensure that every package is expertly prepared, maximizing safety and efficiency throughout the shipping process.
              </p>
              <p>
                Join us at <strong className="text-foreground">Knack Solutions</strong>, where innovation meets reliability. Together, let's move your business forward, one secure shipment at a time.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=800&q=80"
                alt="Plastic pallets and packaging materials"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-900/30 to-transparent" />
            </div>
            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-5 -left-5 bg-white rounded-xl shadow-xl p-4 border border-orange-100"
            >
              <div className="text-2xl font-bold text-orange-500 font-display">2017</div>
              <div className="text-xs text-muted-foreground">Est. in Valsad</div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-5 -right-5 bg-orange-500 rounded-xl shadow-xl p-4 text-white"
            >
              <div className="text-2xl font-bold font-display">10+</div>
              <div className="text-xs opacity-80">Trusted Clients</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Mission, Vision, Values */}
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900" />
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1553413077-190dd305871c?w=1920&q=80')`, backgroundSize: 'cover' }}
      />
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">What Drives Us</h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-1 w-16 rounded-full bg-gradient-to-r from-orange-400 to-amber-400 mx-auto mb-4"
          />
          <p className="text-white/60 max-w-xl mx-auto">Our core principles guide every decision we make.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-400"
            >
              <div className={`w-14 h-14 mb-5 rounded-2xl bg-gradient-to-br ${v.color} flex items-center justify-center shadow-lg`}>
                <v.icon size={26} className="text-white" />
              </div>
              <h3 className="font-display text-xl font-semibold text-white mb-3">{v.title}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{v.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default About;
