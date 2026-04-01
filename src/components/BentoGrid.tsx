import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Heart, ShoppingBag, Star, Mail, MapPin, Wrench, Shield, Clock, Zap, Megaphone, Smartphone, Share, MoreVertical, Download, Plus, Newspaper, FolderOpen, Truck, Sparkles, Hammer, HardHat, Building2, Trash2 as TrashIcon, Gem, Cable, Pickaxe } from "lucide-react";
import heroDemolition from "@/assets/hero-demolition.jpg";
import serviceConstruction from "@/assets/service-construction.jpg";
import serviceRenovation from "@/assets/service-renovation.jpg";
import teamWorker from "@/assets/team-worker.jpg";
import projectIndustrial from "@/assets/project-industrial-demo.jpg";
import projectWaste from "@/assets/project-waste-removal.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const RatingStars = memo(({ id }: { id: string }) => {
  const { getRating, setRating } = useFavorites();
  const rating = getRating(id);
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <button
          key={s}
          className="p-0 transition-transform hover:scale-125 active:scale-90"
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={(e) => { e.stopPropagation(); setRating(id, s === rating ? 0 : s); }}
        >
          <Star className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-colors ${(hover || rating) >= s ? "text-primary fill-primary" : "text-muted-foreground/30"}`} />
        </button>
      ))}
    </div>
  );
});

const FavButton = memo(({ id, className = "" }: { id: string; className?: string }) => {
  const { isFavorite, toggleFavorite, requireAuth } = useFavorites();
  const navigate = useNavigate();
  const fav = isFavorite(id);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!requireAuth()) {
      navigate("/auth");
      return;
    }
    toggleFavorite(id, "service");
  }, [id, toggleFavorite, requireAuth, navigate]);

  return (
    <button
      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-110 active:scale-90 ${fav ? "bg-primary/30" : "bg-primary/20"} ${className}`}
      onClick={handleClick}
    >
      <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all ${fav ? "text-primary fill-primary scale-110" : "text-primary"}`} />
    </button>
  );
});

const BentoGrid = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 auto-rows-[minmax(140px,auto)] sm:auto-rows-[minmax(180px,auto)] [&>*]:overflow-hidden">

        {/* ═══════ 1. СТРОИТЕЛЬНАЯ БИРЖА — главный CTA ═══════ */}
        <motion.div
          className="col-span-2 lg:col-span-2 relative overflow-hidden rounded-2xl cursor-pointer group"
          variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
          whileHover={{ scale: 1.01 }}
          onClick={() => navigate("/marketplace")}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary" />
          <div className="absolute inset-0 shimmer-overlay" />
          {/* Spring petals */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`mp-${i}`}
              className="absolute pointer-events-none select-none"
              style={{ left: `${10 + i * 15}%`, top: `-8%`, fontSize: 12 + (i % 3) * 4 }}
              animate={{
                y: ["0%", "1200%"],
                x: [0, (i % 2 === 0 ? 1 : -1) * (15 + i * 5)],
                rotate: [0, (i % 2 === 0 ? 1 : -1) * 360],
                opacity: [0, 0.5, 0.35, 0],
              }}
              transition={{ duration: 6 + i * 1.5, repeat: Infinity, delay: i * 1.2, ease: "easeInOut" }}
            >
              {["🌸", "🌿", "✿", "🍃", "❀", "🌱"][i]}
            </motion.div>
          ))}
          <div className="relative h-full flex flex-col justify-between p-5 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
                  <Megaphone className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-primary-foreground/20 text-[10px] font-bold text-primary-foreground uppercase tracking-wider">Новинка</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center group-hover:rotate-45 transition-transform">
                <ArrowUpRight className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl font-display font-bold text-primary-foreground leading-tight">{t("bento.marketplace")}</h3>
              <p className="text-primary-foreground/80 text-xs sm:text-sm mt-1 max-w-md">{t("bento.marketplaceDesc")}</p>
              <div className="flex items-center gap-3 mt-3">
                <span className="px-3 py-1.5 rounded-full bg-primary-foreground/20 text-xs font-semibold text-primary-foreground">Разместить заявку</span>
                <span className="px-3 py-1.5 rounded-full bg-primary-foreground/10 text-xs font-medium text-primary-foreground/70">Найти подрядчика</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══════ 1.5. МАГАЗИН ИНСТРУМЕНТОВ — б/у и новые ═══════ */}
        <motion.div
          className="col-span-2 lg:col-span-2 relative overflow-hidden rounded-2xl cursor-pointer group"
          variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
          whileHover={{ scale: 1.01 }}
          onClick={() => navigate("/shop")}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent via-secondary to-accent" />
          <div className="absolute inset-0 shimmer-overlay opacity-20" />
          {/* Spring petals */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`sh-${i}`}
              className="absolute pointer-events-none select-none"
              style={{ right: `${5 + i * 18}%`, top: `-10%`, fontSize: 12 + (i % 3) * 3 }}
              animate={{
                y: ["0%", "1100%"],
                x: [0, (i % 2 === 0 ? -1 : 1) * (12 + i * 6)],
                rotate: [0, (i % 2 === 0 ? -1 : 1) * 300],
                opacity: [0, 0.45, 0.3, 0],
              }}
              transition={{ duration: 7 + i * 1.2, repeat: Infinity, delay: i * 1.5 + 0.5, ease: "easeInOut" }}
            >
              {["🍃", "🌸", "🌱", "✿", "🌿"][i]}
            </motion.div>
          ))}
          <div className="relative h-full flex flex-col justify-between p-5 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-foreground/10 backdrop-blur-sm flex items-center justify-center">
                  <Wrench className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-foreground/10 text-[10px] font-bold text-foreground uppercase tracking-wider">Магазин</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-foreground/10 flex items-center justify-center group-hover:rotate-45 transition-transform">
                <ArrowUpRight className="w-4 h-4 text-foreground" />
              </div>
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl font-display font-bold text-foreground leading-tight">{t("bento.shop")}</h3>
              <p className="text-foreground/70 text-xs sm:text-sm mt-1 max-w-md">{t("bento.shopDesc")}</p>
              <div className="flex items-center gap-3 mt-3">
                <span className="px-3 py-1.5 rounded-full bg-foreground/10 text-xs font-semibold text-foreground">Б/У инструмент</span>
                <span className="px-3 py-1.5 rounded-full bg-foreground/5 text-xs font-medium text-foreground/70">Новый инструмент</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══════ 2. ВСЕ УСЛУГИ — сетка карточек ═══════ */}
        <motion.div
          className="col-span-2 lg:col-span-4 relative overflow-hidden rounded-2xl"
          variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}
        >
          <div className="mb-3 flex items-center justify-between px-1">
            <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">Наши услуги</h3>
            <button onClick={() => navigate("/services")} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              Все услуги <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {[
              { slug: "demolition", label: "Демонтаж", price: "от 500₽/м²", icon: Hammer, gradient: "from-primary/20 to-accent/10" },
              { slug: "diamond-cutting", label: "Алмазная резка", price: "от 1500₽/м.п.", icon: Gem, gradient: "from-blue-500/20 to-cyan-500/10" },
              { slug: "renovation", label: "Ремонт под ключ", price: "от 800₽/м²", icon: Wrench, gradient: "from-emerald-500/20 to-green-500/10" },
              { slug: "construction", label: "Монтаж конструкций", price: "от 1200₽/м²", icon: HardHat, gradient: "from-violet-500/20 to-purple-500/10" },
              { slug: "apartment-demolition", label: "Демонтаж квартир", price: "от 400₽/м²", icon: Building2, gradient: "from-rose-500/20 to-pink-500/10" },
              { slug: "building-demolition", label: "Снос зданий", price: "от 350₽/м²", icon: TrashIcon, gradient: "from-amber-500/20 to-orange-500/10" },
              { slug: "waste-removal", label: "Вывоз мусора", price: "от 8000₽", icon: Truck, gradient: "from-teal-500/20 to-cyan-500/10" },
              { slug: "dismantling", label: "Демонтаж коммуникаций", price: "от 600₽/м²", icon: Cable, gradient: "from-indigo-500/20 to-blue-500/10" },
            ].map((svc, i) => (
              <motion.div
                key={svc.slug}
                className="glass-card p-3 sm:p-4 flex flex-col justify-between cursor-pointer group hover:border-primary/30 transition-colors"
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate(`/services/${svc.slug}`)}
              >
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${svc.gradient} flex items-center justify-center mb-2 sm:mb-3`}>
                  <svc.icon className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-display font-semibold text-foreground leading-tight">{svc.label}</p>
                  <p className="text-[10px] sm:text-xs text-primary font-medium mt-1">{svc.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ═══════ 3. ДЕМОНТАЖ — основная услуга, большая карточка ═══════ */}
        <motion.div className="col-span-2 md:col-span-1 lg:col-span-1 md:row-span-2 glass-card overflow-hidden relative group cursor-pointer" variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2} whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }} onClick={() => navigate("/services/demolition")}>
          <img src={heroDemolition} alt={t("bento.demolition")} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
          <div className="absolute inset-0 shimmer-overlay opacity-20" />
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
                <button className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-secondary/60 backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-110 active:scale-90" onClick={(e) => { e.stopPropagation(); navigate("/services/demolition"); }}>
                  <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary-foreground" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══════ 4. АЛМАЗНАЯ РЕЗКА ═══════ */}
        <motion.div className="glass-card-hover p-4 sm:p-5 flex flex-col justify-between cursor-pointer" variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3} whileHover={{ scale: 1.03 }} onClick={() => navigate("/services/diamond-cutting")}>
          <div className="flex items-center justify-between">
            <span className="px-2 sm:px-3 py-1 rounded-lg bg-primary/15 text-[10px] sm:text-xs font-medium text-primary uppercase tracking-wider w-fit">{t("bento.exclusive")}</span>
            <FavButton id="exclusive" />
          </div>
          <div className="mt-2 sm:mt-3">
            <h4 className="text-base sm:text-lg font-display font-semibold text-foreground">{t("bento.exclusiveTitle")}</h4>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{t("bento.exclusiveDesc")}</p>
          </div>
        </motion.div>

        {/* ═══════ 5. РЕМОНТ — с фото ═══════ */}
        <motion.div className="glass-card overflow-hidden relative cursor-pointer" variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={4} whileHover={{ scale: 1.02 }} onClick={() => navigate("/services/renovation")}>
          <img src={serviceRenovation} alt={t("services.renovation")} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="absolute inset-0 shimmer-overlay opacity-15" />
          <div className="relative h-full flex flex-col justify-end p-4 sm:p-5">
            <FavButton id="renovation" className="absolute top-3 right-3 sm:top-4 sm:right-4" />
            <div className="flex items-center gap-2">
              <RatingStars id="renovation" />
              <span className="text-xs sm:text-sm font-medium text-foreground">{t("bento.open")}</span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center group-hover:rotate-45 transition-transform">
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══════ 6. СКИДКИ ═══════ */}
        <motion.div className="col-span-2 lg:col-span-2 glass-card overflow-hidden relative cursor-pointer" variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={5} whileHover={{ scale: 1.01 }} onClick={() => navigate("/services/waste-removal")}>
          <img src={serviceConstruction} alt={t("bento.bestDeals")} className="absolute inset-0 w-full h-full object-cover opacity-40" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-card/80 to-card/40" />
          <div className="absolute inset-0 shimmer-overlay opacity-10" />
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

        {/* ═══════ 7. ПАРК ТЕХНИКИ ═══════ */}
        <motion.div className="glass-card-hover p-4 sm:p-5 flex flex-col justify-between cursor-pointer" variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={6} whileHover={{ scale: 1.03 }} onClick={() => navigate("/equipment")}>
          <div className="flex items-center justify-between">
            <span className="px-2 sm:px-3 py-1 rounded-lg bg-secondary text-[10px] sm:text-xs font-medium text-secondary-foreground uppercase tracking-wider">{t("bento.equipment")}</span>
            <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <div className="mt-2 sm:mt-3">
            <h4 className="text-base sm:text-lg font-display font-semibold text-foreground">{t("bento.equipmentTitle")}</h4>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{t("bento.equipmentDesc")}</p>
          </div>
        </motion.div>

        {/* ═══════ 8. НОВОСТИ — видное место ═══════ */}
        <motion.div
          className="col-span-2 lg:col-span-2 glass-card-hover p-4 sm:p-5 flex flex-col justify-between cursor-pointer group"
          variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={7}
          whileHover={{ scale: 1.01 }}
          onClick={() => navigate("/news")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
                <Newspaper className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-display font-bold text-foreground">{t("bento.newsTitle")}</h4>
                <p className="text-[10px] sm:text-xs text-muted-foreground">{t("bento.newsDesc")}</p>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center group-hover:rotate-45 transition-transform">
              <ArrowUpRight className="w-4 h-4 text-secondary-foreground" />
            </div>
          </div>
        </motion.div>

        {/* ═══════ 9. ПРОЕКТЫ ═══════ */}
        <motion.div className="col-span-2 md:col-span-1 glass-card overflow-hidden relative cursor-pointer group" variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={8} whileHover={{ scale: 1.02 }} onClick={() => navigate("/projects")}>
          <img src={projectIndustrial} alt={t("bento.projectsTitle")} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
          <div className="relative h-full flex flex-col justify-between p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="px-2 sm:px-3 py-1 rounded-lg bg-primary/20 backdrop-blur-sm text-[10px] sm:text-xs font-medium text-primary uppercase tracking-wider">{t("bento.projectsTitle")}</span>
              <div className="w-8 h-8 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center group-hover:rotate-45 transition-transform">
                <FolderOpen className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-foreground font-medium">{t("bento.projectsDesc")}</p>
            </div>
          </div>
        </motion.div>

        {/* ═══════ 10. СКОРОСТЬ ОТВЕТА ═══════ */}
        <motion.div className="glass-card-hover p-4 sm:p-5 flex flex-col justify-between cursor-pointer" variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={9} whileHover={{ scale: 1.03 }} onClick={() => navigate("/contacts")}>
          <div className="flex items-center justify-between">
            <span className="px-2 sm:px-3 py-1 rounded-lg bg-secondary text-[10px] sm:text-xs font-medium text-secondary-foreground uppercase tracking-wider">{t("bento.speed")}</span>
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <div className="mt-2 sm:mt-3">
            <h4 className="text-2xl sm:text-3xl font-display font-bold text-primary">30 {t("bento.minutes")}</h4>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{t("bento.speedDesc")}</p>
          </div>
        </motion.div>

        {/* ═══════ 11. ГАРАНТИЯ ═══════ */}
        <motion.div className="glass-card-hover p-4 sm:p-5 flex flex-col justify-between cursor-pointer" variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={10} whileHover={{ scale: 1.03 }} onClick={() => navigate("/projects")}>
          <div className="flex items-center justify-between">
            <span className="px-2 sm:px-3 py-1 rounded-lg bg-primary/15 text-[10px] sm:text-xs font-medium text-primary uppercase tracking-wider">{t("bento.guarantee")}</span>
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <div className="mt-2 sm:mt-3">
            <h4 className="text-base sm:text-lg font-display font-bold text-foreground">{t("bento.guaranteeTitle")}</h4>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{t("bento.guaranteeDesc")}</p>
          </div>
        </motion.div>

        {/* ═══════ 12. КОМАНДА ═══════ */}
        <motion.div className="glass-card-hover p-4 sm:p-5 flex flex-col justify-between cursor-pointer" variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={11} whileHover={{ scale: 1.03 }} onClick={() => navigate("/about")}>
          <div className="flex items-center justify-between">
            <span className="px-2 sm:px-3 py-1 rounded-lg bg-secondary text-[10px] sm:text-xs font-medium text-secondary-foreground uppercase tracking-wider">{t("bento.team")}</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary-foreground" />
            </div>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3">{t("bento.teamDesc")}</p>
            <div className="flex -space-x-2 mt-2 sm:mt-3">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary border-2 border-card overflow-hidden">
                  <img src={teamWorker} alt="" className="w-full h-full object-cover" loading="lazy" style={{ objectPosition: `${i * 20}% center` }} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ═══════ 13. ЭКОЛОГИЯ ═══════ */}
        <motion.div className="glass-card-hover p-4 sm:p-5 flex flex-col justify-between cursor-pointer" variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={12} whileHover={{ scale: 1.03 }} onClick={() => navigate("/services/waste-removal")}>
          <div className="flex items-center justify-between">
            <span className="px-2 sm:px-3 py-1 rounded-lg bg-accent/15 text-[10px] sm:text-xs font-medium text-accent uppercase tracking-wider">{t("bento.eco")}</span>
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
          </div>
          <div className="mt-2 sm:mt-3">
            <h4 className="text-2xl sm:text-3xl font-display font-bold text-foreground">85%</h4>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{t("bento.ecoDesc")}</p>
          </div>
        </motion.div>

        {/* ═══════ 14. ОФИС ═══════ */}
        <motion.div className="glass-card-hover p-4 sm:p-5 flex flex-col justify-between cursor-pointer" variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={13} whileHover={{ scale: 1.03 }} onClick={() => navigate("/contacts")}>
          <div className="flex items-center justify-between">
            <span className="px-2 sm:px-3 py-1 rounded-lg bg-secondary text-[10px] sm:text-xs font-medium text-secondary-foreground uppercase tracking-wider">{t("bento.office")}</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary-foreground" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <p className="text-xs sm:text-sm text-muted-foreground">{t("bento.address")}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{t("bento.hours")}</p>
          </div>
        </motion.div>

        {/* ═══════ 15. ПОДПИСКА ═══════ */}
        <motion.div className="glass-card-hover p-4 sm:p-5 flex flex-col justify-between" variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={14} whileHover={{ scale: 1.03 }}>
          <div className="flex items-center justify-between">
            <span className="px-2 sm:px-3 py-1 rounded-lg bg-secondary text-[10px] sm:text-xs font-medium text-secondary-foreground uppercase tracking-wider">{t("bento.subscribe")}</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary flex items-center justify-center">
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary-foreground" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <input type="email" placeholder="Email" className="w-full bg-input border border-border rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            <button className="w-full mt-2 py-2 sm:py-2.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98]">{t("bento.subscribeBtn")}</button>
          </div>
        </motion.div>

        {/* ═══════ 16. УСТАНОВИТЬ ПРИЛОЖЕНИЕ ═══════ */}
        <motion.div
          className="col-span-2 glass-card-hover p-4 sm:p-5 flex flex-col gap-3 cursor-pointer overflow-hidden relative"
          variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={15}
          whileHover={{ scale: 1.01 }}
          onClick={() => navigate("/install")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
                <Smartphone className="w-4.5 h-4.5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-display font-bold text-foreground leading-tight">Установить приложение</h4>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Без App Store — прямо из браузера</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Download className="w-4 h-4 text-primary" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-card/60 rounded-xl p-3 border border-border/30 space-y-2">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">iPhone / iPad</span>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <Share className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-[10px] sm:text-xs text-foreground">Нажмите «Поделиться»</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <Plus className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-[10px] sm:text-xs text-foreground">«На экран Домой»</span>
                </div>
              </div>
            </div>

            <div className="bg-card/60 rounded-xl p-3 border border-border/30 space-y-2">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Android</span>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <MoreVertical className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-[10px] sm:text-xs text-foreground">Меню браузера (⋮)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <Download className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-[10px] sm:text-xs text-foreground">«Установить»</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BentoGrid;
