import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, MoveUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const HomepageHero = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute right-[-10rem] top-[-10rem] h-[32rem] w-[32rem] rounded-full border border-foreground/[0.045]" />
        <div className="absolute right-[-5rem] top-[-5rem] h-[22rem] w-[22rem] rounded-full border border-foreground/[0.045]" />
        <div className="absolute right-0 top-0 h-full w-[45%] opacity-30" style={{ backgroundImage: "linear-gradient(hsl(var(--foreground) / 0.045) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.045) 1px, transparent 1px)", backgroundSize: "44px 44px", maskImage: "linear-gradient(to left, black, transparent)" }} />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-10 pt-12 sm:px-6 sm:pb-16 sm:pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:pb-20 lg:pt-24">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-6 flex items-center gap-3"
          >
            <span className="h-px w-8 bg-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">{t("hero.eyebrow")}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="max-w-4xl font-display text-[clamp(2.7rem,7.2vw,6.6rem)] font-semibold leading-[0.94] tracking-[-0.065em] text-foreground"
          >
            {t("hero.titleA")}
            <span className="block text-foreground/45">{t("hero.titleB")}</span>
            <span className="block">{t("hero.titleC")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="mt-6 max-w-xl text-sm leading-7 text-muted-foreground sm:mt-8 sm:text-base sm:leading-8"
          >
            {t("hero.description")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.25 }}
            className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row"
          >
            <button onClick={() => navigate("/contacts")} className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110">
              {t("hero.primary")}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
            <button onClick={() => navigate("/services")} className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl border border-border/70 bg-card/35 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-card/70">
              {t("hero.secondary")}
              <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </motion.div>

          <div className="mt-9 flex flex-wrap gap-x-5 gap-y-2 border-t border-border/50 pt-5 text-xs text-muted-foreground sm:mt-12 sm:pt-6">
            <span>{t("hero.location")}</span>
            <span className="hidden h-1 w-1 self-center rounded-full bg-primary/70 sm:block" />
            <span>{t("hero.scope")}</span>
            <span className="hidden h-1 w-1 self-center rounded-full bg-primary/70 sm:block" />
            <span>{t("hero.format")}</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, delay: 0.2 }}
          className="relative mx-auto w-full max-w-xl lg:ml-auto"
        >
          <div className="relative min-h-[330px] overflow-hidden rounded-2xl border border-border/70 bg-card/45 p-5 sm:min-h-[430px] sm:p-7">
            <div className="absolute inset-0 opacity-40" aria-hidden="true" style={{ backgroundImage: "linear-gradient(hsl(var(--foreground) / 0.05) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.05) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
            <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full border border-primary/20 sm:h-72 sm:w-72" />
            <div className="absolute -right-1 -top-1 h-40 w-40 rounded-full border border-foreground/[0.08] sm:h-52 sm:w-52" />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">SKOL / WORKFLOW</p>
                <p className="mt-2 text-sm font-medium text-foreground">{t("hero.panelTitle")}</p>
              </div>
              <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono text-[10px] text-primary">01 — 03</span>
            </div>

            <div className="relative mt-12 space-y-3 sm:mt-16 sm:space-y-4">
              {[
                { n: "01", title: t("hero.stage1"), detail: t("hero.stage1Desc"), width: "w-full" },
                { n: "02", title: t("hero.stage2"), detail: t("hero.stage2Desc"), width: "w-[88%]" },
                { n: "03", title: t("hero.stage3"), detail: t("hero.stage3Desc"), width: "w-[76%]" },
              ].map((stage, index) => (
                <motion.div
                  key={stage.n}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + index * 0.12, duration: 0.4 }}
                  className={`relative ${stage.width} rounded-xl border border-border/70 bg-background/75 p-4 backdrop-blur-sm sm:p-5`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <span className="pt-0.5 font-mono text-xs text-primary">{stage.n}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-base font-semibold text-foreground sm:text-lg">{stage.title}</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">{stage.detail}</p>
                    </div>
                    {index === 2 && <MoveUpRight className="mt-1 h-4 w-4 shrink-0 text-primary" />}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="relative mt-6 flex items-center justify-between border-t border-border/50 pt-4">
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{t("hero.panelFoot")}</span>
              <span className="font-display text-sm font-bold tracking-[0.2em] text-foreground">СКОЛ<span className="text-primary">.</span></span>
            </div>
          </div>
          <div className="absolute -bottom-2 left-6 right-6 -z-10 h-10 rounded-2xl bg-primary/10 blur-2xl" />
        </motion.div>
      </div>
    </section>
  );
};

export default HomepageHero;
