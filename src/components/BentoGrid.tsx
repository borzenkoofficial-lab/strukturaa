import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Heart, ShoppingBag, Star, Mail, MapPin, Wrench, Shield, Clock, Zap, Megaphone } from "lucide-react";
import heroDemolition from "@/assets/hero-demolition.jpg";
import serviceConstruction from "@/assets/service-construction.jpg";
import serviceRenovation from "@/assets/service-renovation.jpg";
import teamWorker from "@/assets/team-worker.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const shimmerTransition = { duration: 3, repeat: Infinity, ease: "linear" as const };

const RatingStars = ({ id }: { id: string }) => {
  const { getRating, setRating } = useFavorites();
  const rating = getRating(id);
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <motion.button
          key={s}
          className="p-0"
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.8 }}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={(e) => { e.stopPropagation(); setRating(id, s === rating ? 0 : s); }}
        >
          <Star className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-colors ${(hover || rating) >= s ? "text-primary fill-primary" : "text-muted-foreground/30"}`} />
        </motion.button>
      ))}
    </div>
  );
};

const FavButton = ({ id, className = "" }: { id: string; className?: string }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(id);
  const [burst, setBurst] = useState(false);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const added = toggleFavorite(id);
    if (added) { setBurst(true); setTimeout(() => setBurst(false), 600); }
  }, [id, toggleFavorite]);

  return (
    <motion.button
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full backdrop-blur-sm flex items-center justify-center relative ${fav ? "bg-primary/30" : "bg-primary/20"} ${className}`}
      onClick={handleClick}
    >
      <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all ${fav ? "text-primary fill-primary scale-110" : "text-primary"}`} />
      <AnimatePresence>
        {burst && (
          <>
            {[0,60,120,180,240,300].map(deg => (
              <motion.span
                key={deg}
                className="absolute w-1 h-1 rounded-full bg-primary"
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{ scale: 1, x: Math.cos(deg * Math.PI / 180) * 18, y: Math.sin(deg * Math.PI / 180) * 18, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

const BentoGrid = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 auto-rows-[minmax(140px,auto)] sm:auto-rows-[minmax(180px,auto)] [&>*]:overflow-hidden">
        
        {/* Hero Card */}
        <motion.div className="col-span-2 md:col-span-1 lg:col-span-1 md:row-span-2 glass-card overflow-hidden relative group cursor-pointer" variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }} onClick={() => navigate("/services")}>
          <img src={heroDemolition} alt={t("bento.demolition")} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
          <motion.div className="absolute inset-0 opacity-20" style={{ background: "linear-gradient(90deg, transparent 0%, hsl(35 80% 55% / 0.3) 50%, transparent 100%)", backgroundSize: "200% 100%" }} initial={{ backgroundPosition: "200% 0" }} animate={{ backgroundPosition: ["-200% 0", "200% 0"] }} transition={shimmerTransition} />
          <div className="relative h-full flex flex-col justify-between p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xl sm:text-2xl font-display font-bold text-foreground">{t("bento.from")}</span>
                <span className="text-muted-foreground text-[10px] sm:text-xs">{t("bento.perSqm")}</span>
              </div>
              <RatingStars id="demolition" />
            </div>
            <div>
              <p className="text-base sm:text-lg font-display font-semibold text-foreground">{t("bento.demolition")}</p>
              <div className="flex items-center gap-2 mt-2 sm:mt-3">
                <FavButton id="demolition" />
                <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-secondary/60 backdrop-blur-sm flex items-center justify-center" onClick={(e) => { e.stopPropagation(); navigate("/services"); }}><ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary-foreground" /></motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Great Value */}
        <motion.div className="col-span-2 lg:col-span-2 glass-card overflow-hidden relative cursor-pointer" variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} whileHover={{ scale: 1.01 }} onClick={() => navigate("/services")}>
          <img src={serviceConstruction} alt={t("bento.bestDeals")} className="absolute inset-0 w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-card/80 to-card/40" />
          <motion.div className="absolute inset-0 opacity-10" style={{ background: "linear-gradient(120deg, transparent 0%, hsl(35 80% 55% / 0.4) 50%, transparent 100%)", backgroundSize: "200% 100%" }} initial={{ backgroundPosition: "200% 0" }} animate={{ backgroundPosition: ["-200% 0", "200% 0"] }} transition={shimmerTransition} />
          <div className="relative h-full flex flex-col justify-between p-4 sm:p-6">
            <div>
              <h3 className="text-lg sm:text-2xl font-display font-bold text-foreground">{t("bento.bestDeals")}</h3>
              <p className="text-muted-foreground text-xs sm:text-sm mt-1">{t("bento.dealsDesc")}</p>
            </div>
            <div className="flex items-center gap-3">
              <RatingStars id="best-deals" />
              <FavButton id="best-deals" />
            </div>
          </div>
        </motion.div>

        {/* Team */}
        <motion.div className="glass-card-hover p-4 sm:p-5 flex flex-col justify-between cursor-pointer" variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2} whileHover={{ scale: 1.03 }} onClick={() => navigate("/about")}>
          <div className="flex items-center justify-between">
            <span className="px-2 sm:px-3 py-1 rounded-lg bg-secondary text-[10px] sm:text-xs font-medium text-secondary-foreground uppercase tracking-wider">{t("bento.team")}</span>
            <motion.button whileHover={{ rotate: 45 }} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary flex items-center justify-center"><ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary-foreground" /></motion.button>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3">{t("bento.teamDesc")}</p>
            <div className="flex -space-x-2 mt-2 sm:mt-3">
              {[1,2,3,4,5].map((i) => (
                <motion.div key={i} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary border-2 border-card overflow-hidden" initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 + i * 0.1 }}>
                  <img src={teamWorker} alt="" className="w-full h-full object-cover" style={{ objectPosition: `${i * 20}% center` }} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Tile */}
        <motion.div className="glass-card-hover p-4 sm:p-5 flex flex-col justify-between cursor-pointer" variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3} whileHover={{ scale: 1.03 }} onClick={() => navigate("/about")}>
          <div className="flex items-center justify-between">
            <span className="px-2 sm:px-3 py-1 rounded-lg bg-primary/15 text-[10px] sm:text-xs font-medium text-primary uppercase tracking-wider">{t("bento.guarantee")}</span>
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <div className="mt-2 sm:mt-3">
            <h4 className="text-base sm:text-lg font-display font-bold text-foreground">{t("bento.guaranteeTitle")}</h4>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{t("bento.guaranteeDesc")}</p>
          </div>
        </motion.div>

        {/* Subscribe */}
        <motion.div className="glass-card-hover p-4 sm:p-5 flex flex-col justify-between" variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={4} whileHover={{ scale: 1.03 }}>
          <div className="flex items-center justify-between">
            <span className="px-2 sm:px-3 py-1 rounded-lg bg-secondary text-[10px] sm:text-xs font-medium text-secondary-foreground uppercase tracking-wider">{t("bento.subscribe")}</span>
            <motion.button whileHover={{ rotate: 15 }} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary flex items-center justify-center"><Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary-foreground" /></motion.button>
          </div>
          <div className="mt-2 sm:mt-3">
            <input type="email" placeholder="Email" className="w-full bg-input border border-border rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            <motion.button className="w-full mt-2 py-2 sm:py-2.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>{t("bento.subscribeBtn")}</motion.button>
          </div>
        </motion.div>

        {/* Exclusive - Diamond Cutting */}
        <motion.div className="glass-card-hover p-4 sm:p-5 flex flex-col justify-between cursor-pointer" variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={5} whileHover={{ scale: 1.03 }} onClick={() => navigate("/services")}>
          <div className="flex items-center justify-between">
            <span className="px-2 sm:px-3 py-1 rounded-lg bg-primary/15 text-[10px] sm:text-xs font-medium text-primary uppercase tracking-wider w-fit">{t("bento.exclusive")}</span>
            <FavButton id="exclusive" />
          </div>
          <div className="mt-2 sm:mt-3">
            <h4 className="text-base sm:text-lg font-display font-semibold text-foreground">{t("bento.exclusiveTitle")}</h4>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{t("bento.exclusiveDesc")}</p>
          </div>
        </motion.div>

        {/* Renovation */}
        <motion.div className="glass-card overflow-hidden relative cursor-pointer" variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={6} whileHover={{ scale: 1.02 }} onClick={() => navigate("/services")}>
          <img src={serviceRenovation} alt={t("services.renovation")} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <motion.div className="absolute inset-0 opacity-15" style={{ background: "linear-gradient(90deg, transparent 0%, hsl(35 80% 55% / 0.3) 50%, transparent 100%)", backgroundSize: "200% 100%" }} initial={{ backgroundPosition: "200% 0" }} animate={{ backgroundPosition: ["-200% 0", "200% 0"] }} transition={shimmerTransition} />
          <div className="relative h-full flex flex-col justify-end p-4 sm:p-5">
            <FavButton id="renovation" className="absolute top-3 right-3 sm:top-4 sm:right-4" />
            <div className="flex items-center gap-2">
              <RatingStars id="renovation" />
              <span className="text-xs sm:text-sm font-medium text-foreground">{t("bento.open")}</span>
              <motion.button whileHover={{ rotate: 45 }} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></motion.button>
            </div>
          </div>
        </motion.div>

        {/* Fast Response */}
        <motion.div className="glass-card-hover p-4 sm:p-5 flex flex-col justify-between cursor-pointer" variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={7} whileHover={{ scale: 1.03 }} onClick={() => navigate("/contacts")}>
          <div className="flex items-center justify-between">
            <span className="px-2 sm:px-3 py-1 rounded-lg bg-secondary text-[10px] sm:text-xs font-medium text-secondary-foreground uppercase tracking-wider">{t("bento.speed")}</span>
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <div className="mt-2 sm:mt-3">
            <h4 className="text-2xl sm:text-3xl font-display font-bold text-primary">30 {t("bento.minutes")}</h4>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{t("bento.speedDesc")}</p>
          </div>
        </motion.div>

        {/* Equipment */}
        <motion.div className="glass-card-hover p-4 sm:p-5 flex flex-col justify-between cursor-pointer" variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={8} whileHover={{ scale: 1.03 }} onClick={() => navigate("/services")}>
          <div className="flex items-center justify-between">
            <span className="px-2 sm:px-3 py-1 rounded-lg bg-secondary text-[10px] sm:text-xs font-medium text-secondary-foreground uppercase tracking-wider">{t("bento.equipment")}</span>
            <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          </div>
          <div className="mt-2 sm:mt-3">
            <h4 className="text-base sm:text-lg font-display font-semibold text-foreground">{t("bento.equipmentTitle")}</h4>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{t("bento.equipmentDesc")}</p>
          </div>
        </motion.div>

        {/* Office */}
        <motion.div className="glass-card-hover p-4 sm:p-5 flex flex-col justify-between cursor-pointer" variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={9} whileHover={{ scale: 1.03 }} onClick={() => navigate("/contacts")}>
          <div className="flex items-center justify-between">
            <span className="px-2 sm:px-3 py-1 rounded-lg bg-secondary text-[10px] sm:text-xs font-medium text-secondary-foreground uppercase tracking-wider">{t("bento.office")}</span>
            <motion.button whileHover={{ y: -3 }} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary flex items-center justify-center"><MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary-foreground" /></motion.button>
          </div>
          <div className="mt-2 sm:mt-3">
            <p className="text-xs sm:text-sm text-muted-foreground">{t("bento.address")}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{t("bento.hours")}</p>
          </div>
        </motion.div>

        {/* Eco Tile */}
        <motion.div className="glass-card-hover p-4 sm:p-5 flex flex-col justify-between cursor-pointer" variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={10} whileHover={{ scale: 1.03 }} onClick={() => navigate("/about")}>
          <div className="flex items-center justify-between">
            <span className="px-2 sm:px-3 py-1 rounded-lg bg-accent/15 text-[10px] sm:text-xs font-medium text-accent uppercase tracking-wider">{t("bento.eco")}</span>
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
          </div>
          <div className="mt-2 sm:mt-3">
            <h4 className="text-2xl sm:text-3xl font-display font-bold text-foreground">85%</h4>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{t("bento.ecoDesc")}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BentoGrid;
