import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Building2, FolderOpen, Gem, Hammer, HardHat, Truck, Wrench } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import heroDemolition from "@/assets/hero-demolition.jpg";
import serviceConstruction from "@/assets/service-construction.jpg";
import serviceRenovation from "@/assets/service-renovation.jpg";
import projectIndustrial from "@/assets/project-industrial-demo.jpg";
import projectWaste from "@/assets/project-waste-removal.jpg";

const BentoGrid = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const cards = [
    {
      number: "01",
      title: t("services.demolition"),
      description: t("services.demolitionDesc"),
      category: "DEMOLITION / 01",
      image: heroDemolition,
      icon: Hammer,
      href: "/services/demolition",
      size: "skol-bento-card--feature",
    },
    {
      number: "02",
      title: t("services.concrete"),
      description: t("services.concreteDesc"),
      category: "CUTTING / DRILLING",
      image: projectIndustrial,
      icon: Gem,
      href: "/services/diamond-cutting",
      size: "",
    },
    {
      number: "03",
      title: t("services.renovation"),
      description: t("services.renovationDesc"),
      category: "FINISHING",
      image: serviceRenovation,
      icon: Wrench,
      href: "/services/renovation",
      size: "",
    },
    {
      number: "04",
      title: t("services.construction"),
      description: t("services.constructionDesc"),
      category: "INSTALLATION",
      image: serviceConstruction,
      icon: HardHat,
      href: "/services/construction",
      size: "",
    },
    {
      number: "05",
      title: t("services.wasteRemoval"),
      description: t("services.wasteRemovalDesc"),
      category: "SITE LOGISTICS",
      image: projectWaste,
      icon: Truck,
      href: "/services/waste-removal",
      size: "",
    },
    {
      number: "06",
      title: t("bento.projectsTitle"),
      description: t("bento.projectsDesc"),
      category: "SELECTED WORK",
      image: projectIndustrial,
      icon: FolderOpen,
      href: "/projects",
      size: "skol-bento-card--wide",
    },
    {
      number: "07",
      title: t("bento.marketplace"),
      description: t("bento.marketplaceDesc"),
      category: "ONE COORDINATED PLAN",
      image: serviceConstruction,
      icon: Building2,
      href: "/services",
      size: "",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 sm:pb-20">
      <div className="skol-bento-grid" aria-label={t("bento.hotServices")}>
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.button
              key={card.number}
              type="button"
              className={`skol-bento-card ${card.size}`}
              onClick={() => navigate(card.href)}
              aria-label={`${card.title}. ${card.description}`}
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }}
              transition={{ duration: 0.72, delay: reduceMotion ? 0 : (index % 3) * 0.075, ease: [0.16, 1, 0.3, 1] }}
              whileHover={reduceMotion ? undefined : { y: -5 }}
              whileTap={reduceMotion ? undefined : { scale: 0.992 }}
            >
              <img className="skol-bento-card__image" src={card.image} alt="" aria-hidden="true" loading="lazy" />
              <span className="skol-bento-card__shade" aria-hidden="true" />
              <span className="skol-bento-card__grid" aria-hidden="true" />
              <span className="skol-bento-card__top">
                <span className="skol-bento-card__number">{card.number} / SKOL</span>
                <span className="skol-bento-card__icon"><Icon size={19} strokeWidth={1.5} /></span>
              </span>
              <span className="skol-bento-card__bottom">
                <span className="skol-bento-card__category">{card.category}</span>
                <span className="skol-bento-card__title">{card.title}</span>
                <span className="skol-bento-card__description">{card.description}</span>
              </span>
              <span className="skol-bento-card__arrow" aria-hidden="true"><ArrowUpRight size={19} strokeWidth={1.5} /></span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default BentoGrid;
