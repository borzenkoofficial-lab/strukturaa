import { useState } from "react";
import { Building2, HardHat, Home, Hammer, Truck, Wrench, Gem, Building, Warehouse } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLanguage, TranslationKey } from "@/contexts/LanguageContext";

const categories: { key: TranslationKey; slug: string; icon: typeof Building2; gradient: string }[] = [
  { key: "cat.demolition", slug: "demolition", icon: Building2, gradient: "from-orange-500/80 to-red-600/80" },
  { key: "cat.construction", slug: "construction", icon: HardHat, gradient: "from-blue-500/80 to-indigo-600/80" },
  { key: "cat.renovation", slug: "renovation", icon: Home, gradient: "from-emerald-500/80 to-teal-600/80" },
  { key: "cat.facades", slug: "dismantling", icon: Wrench, gradient: "from-violet-500/80 to-purple-600/80" },
  { key: "cat.roofing", slug: "building-demolition", icon: Warehouse, gradient: "from-amber-500/80 to-orange-600/80" },
  { key: "cat.foundation", slug: "diamond-cutting", icon: Gem, gradient: "from-cyan-500/80 to-blue-600/80" },
  { key: "cat.electrical", slug: "waste-removal", icon: Truck, gradient: "from-rose-500/80 to-pink-600/80" },
  { key: "cat.apartments", slug: "apartment-demolition", icon: Hammer, gradient: "from-lime-500/80 to-green-600/80" },
  { key: "cat.buildings", slug: "building-demolition", icon: Building, gradient: "from-slate-500/80 to-zinc-600/80" },
];

const CategoryPills = () => {
  const [active, setActive] = useState<number | null>(null);
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto scrollbar-hide pb-1">
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          const isActive = active === i;
          return (
            <motion.button
              key={cat.key}
              onClick={() => { setActive(i); navigate(`/services/${cat.slug}`); }}
              className="group flex flex-col items-center gap-1.5 shrink-0"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gradient-to-br ${cat.gradient} flex items-center justify-center transition-shadow duration-300 ${
                  isActive
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg"
                    : "shadow-md group-hover:shadow-lg"
                }`}
                layout
              >
                <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-md" strokeWidth={1.8} />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
              </motion.div>
              <span className={`text-[10px] sm:text-xs font-medium text-center leading-tight max-w-[4.5rem] sm:max-w-[5.5rem] line-clamp-2 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              }`}>
                {t(cat.key)}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryPills;
