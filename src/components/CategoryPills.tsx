import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage, TranslationKey } from "@/contexts/LanguageContext";

const categories: { key: TranslationKey; slug: string }[] = [
  { key: "cat.demolition", slug: "demolition" },
  { key: "cat.construction", slug: "construction" },
  { key: "cat.renovation", slug: "renovation" },
  { key: "cat.facades", slug: "dismantling" },
  { key: "cat.apartments", slug: "apartment-demolition" },
  { key: "cat.buildings", slug: "building-demolition" },
];

const CategoryPills = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 pt-2 sm:px-6 sm:pb-12">
      <div className="mb-4 flex flex-col gap-2 sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">{t("category.heading")}</p>
          <p className="text-sm text-muted-foreground">{t("category.description")}</p>
        </div>
        <button onClick={() => navigate("/services")} className="group inline-flex w-fit items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary">
          {t("services.all")}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat, index) => (
          <motion.button
            key={cat.slug}
            onClick={() => navigate(`/services/${cat.slug}`)}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: index * 0.04, duration: 0.3 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group flex min-h-[54px] items-center justify-between gap-2 rounded-xl border border-border/60 bg-card/35 px-3 py-3 text-left transition-colors hover:border-primary/40 hover:bg-card/75 sm:px-4"
          >
            <span className="text-xs font-medium leading-5 text-foreground sm:text-sm">{t(cat.key)}</span>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
          </motion.button>
        ))}
      </div>
    </section>
  );
};

export default CategoryPills;
