import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Phone, ArrowRight, X } from "lucide-react";
import { useEffect } from "react";

interface SuccessOverlayProps {
  open: boolean;
  onClose: () => void;
  service?: string | null;
  price?: number | null;
}

const SuccessOverlay = ({ open, onClose, service, price }: SuccessOverlayProps) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(onClose, 8000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Card */}
          <motion.div
            className="relative w-full max-w-sm rounded-3xl border border-border/50 bg-card p-8 shadow-2xl overflow-hidden"
            initial={{ scale: 0.85, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glow */}
            <div
              className="absolute -top-24 -right-24 w-48 h-48 rounded-full opacity-40 pointer-events-none"
              style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.4), transparent 70%)" }}
            />
            <div
              className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full opacity-20 pointer-events-none"
              style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.3), transparent 70%)" }}
            />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon */}
            <div className="relative flex justify-center mb-5">
              <motion.div
                className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, type: "spring", damping: 12 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", damping: 10 }}
                >
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </motion.div>
              </motion.div>
            </div>

            {/* Text */}
            <motion.div
              className="text-center relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-display font-bold text-foreground mb-1.5">
                Заявка принята
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Мы свяжемся с вами по указанным контактам
              </p>

              {(service || price) && (
                <motion.div
                  className="rounded-2xl bg-secondary/50 border border-border/30 p-4 mb-5 text-left"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  {service && (
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Услуга</span>
                      <span className="text-sm font-medium text-foreground">{service}</span>
                    </div>
                  )}
                  {price && price > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Стоимость</span>
                      <span className="text-sm font-semibold text-primary">
                        {Number(price).toLocaleString("ru-RU")} ₽
                      </span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <motion.a
                  href="tel:+79366669958"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Phone className="w-4 h-4" />
                  Позвонить сейчас
                </motion.a>
                <motion.button
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-secondary/60 text-secondary-foreground font-medium text-sm hover:bg-secondary transition-colors"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  Закрыть
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessOverlay;
