import { motion } from "framer-motion";
import { Search, Phone, Menu } from "lucide-react";

const Header = () => {
  return (
    <motion.header
      className="w-full py-4 px-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.03 }}
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="font-display font-bold text-sm text-primary-foreground">S</span>
          </div>
          <span className="font-display font-bold text-lg text-foreground tracking-tight">STRUKTURA</span>
        </motion.div>

        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="glass-card flex items-center w-full px-4 py-2.5 gap-2">
            <span className="text-sm text-muted-foreground">Демонтаж, строительство...</span>
            <Search className="w-4 h-4 text-muted-foreground ml-auto" />
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-1">
          {["Услуги", "Проекты", "О нас", "Контакты"].map((item, i) => (
            <motion.button
              key={item}
              className="px-4 py-2 rounded-xl text-sm font-medium text-secondary-foreground hover:bg-secondary transition-colors"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              whileHover={{ y: -2 }}
            >
              {item}
            </motion.button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <motion.button
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Phone className="w-4 h-4" />
            Связаться
          </motion.button>
          <button className="lg:hidden p-2 rounded-xl bg-secondary text-secondary-foreground">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
