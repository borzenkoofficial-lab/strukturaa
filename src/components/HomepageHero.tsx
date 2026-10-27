import { ArrowDownRight, ArrowUpRight, MoveUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const HomepageHero = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="skol-home-hero relative isolate overflow-hidden" aria-label="СКОЛ — строительные работы">
      <div className="skol-signature-stamp pointer-events-none absolute right-5 top-5 z-10 hidden xl:flex" aria-hidden="true"><span>СКОЛ</span><i /><span>МСК / МО</span><span className="skol-stamp-index">01—26</span></div>
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute right-[-10rem] top-[-10rem] h-[32rem] w-[32rem] rounded-full border border-foreground/[0.045]" />
        <div className="absolute right-[-5rem] top-[-5rem] h-[22rem] w-[22rem] rounded-full border border-foreground/[0.045]" />
        <div className="absolute right-0 top-0 h-full w-[45%] opacity-30" style={{ backgroundImage: "linear-gradient(hsl(var(--foreground) / 0.045) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.045) 1px, transparent 1px)", backgroundSize: "44px 44px", maskImage: "linear-gradient(to left, black, transparent)" }} />
      </div>

      <div className="mx-auto grid max-w-[88rem] items-end gap-8 px-4 pb-8 pt-9 sm:px-6 sm:pb-14 sm:pt-14 lg:grid-cols-[1.18fr_0.82fr] lg:gap-10 lg:px-8 lg:pb-20 lg:pt-16 xl:gap-14">
        <div className="relative z-10">
          <div
            className="mb-6 flex items-center gap-3 sm:mb-8"
          >
            <span className="skol-signature-rule h-px w-8 bg-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">{t("hero.eyebrow")}</span>
          </div>

          <h1
            className="max-w-[12ch] font-display text-[clamp(3.35rem,8.8vw,8.8rem)] font-semibold leading-[0.82] tracking-[-0.085em] text-foreground sm:max-w-[11ch] lg:text-[clamp(5.5rem,8.4vw,8.8rem)]"
          >
            {t("hero.titleA")}
            <span className="block text-foreground/48">{t("hero.titleB")}</span>
            <span className="block">{t("hero.titleC")}</span>
          </h1>

          <p
            className="mt-6 max-w-[34rem] text-sm leading-7 text-foreground/72 sm:mt-7 sm:text-base sm:leading-8 lg:max-w-[31rem]"
          >
            {t("hero.description")}
          </p>

          <div
            className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap"
          >
            <button onClick={() => navigate("/contacts")} className="skol-hero-cta group inline-flex min-h-12 items-center justify-center gap-4 rounded-md bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors duration-150 hover:brightness-105">
              {t("hero.primary")}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
            <button onClick={() => navigate("/services")} className="inline-flex min-h-12 items-center justify-center gap-3 border-b border-foreground/25 px-4 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary">
              {t("hero.secondary")}
              <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 border-t border-border/60 pt-4 text-[10px] uppercase tracking-[0.12em] text-muted-foreground sm:mt-10 sm:gap-x-5 sm:pt-5">
            <span>{t("hero.location")}</span>
            <span className="hidden h-1 w-1 self-center rounded-full bg-primary/70 sm:block" />
            <span>{t("hero.scope")}</span>
            <span className="hidden h-1 w-1 self-center rounded-full bg-primary/70 sm:block" />
            <span>{t("hero.format")}</span>
          </div>
        </div>

        <div
            className="relative mx-auto w-full max-w-[34rem] lg:ml-auto lg:translate-y-2"
        >
          <div className="skol-hero-panel relative min-h-[300px] overflow-hidden border-y border-border/65 bg-card/20 px-4 py-5 sm:min-h-[370px] sm:px-6 sm:py-7 lg:min-h-[390px]">
            <div className="absolute inset-0 opacity-25" aria-hidden="true" style={{ backgroundImage: "linear-gradient(hsl(var(--foreground) / 0.05) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.05) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border border-primary/20 sm:h-80 sm:w-80" />
            <div className="absolute -right-2 -top-2 h-44 w-44 rounded-full border border-foreground/[0.08] sm:h-56 sm:w-56" />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground"><span className="text-primary">SK—01</span><span className="mx-2 text-foreground/20">/</span>СКОЛ · ПОРЯДОК РАБОТ</p>
                <p className="mt-2 text-sm font-medium text-foreground">{t("hero.panelTitle")}</p>
              </div>
              <span className="border border-border/70 px-2.5 py-1 font-mono text-[10px] tracking-widest text-muted-foreground">01 — 03</span>
            </div>

            <div className="relative mt-7 space-y-2 sm:mt-9 sm:space-y-3">
              {[
                { n: "01", title: t("hero.stage1"), detail: t("hero.stage1Desc"), width: "w-full" },
                { n: "02", title: t("hero.stage2"), detail: t("hero.stage2Desc"), width: "w-[88%]" },
                { n: "03", title: t("hero.stage3"), detail: t("hero.stage3Desc"), width: "w-[76%]" },
              ].map((stage, index) => (
                <div
                  key={stage.n}
            className={`skol-hero-stage relative ${stage.width} border-l border-border/70 bg-background/35 py-3.5 pl-3.5 pr-3 transition-colors duration-150 hover:border-primary sm:py-4 sm:pl-4`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <span className="pt-0.5 font-mono text-xs text-primary">{stage.n}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-base font-semibold text-foreground sm:text-lg">{stage.title}</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">{stage.detail}</p>
                    </div>
                    {index === 2 && <MoveUpRight className="mt-1 h-4 w-4 shrink-0 text-primary" />}
                  </div>
                </div>
              ))}
            </div>

            <div className="relative mt-5 flex items-center justify-between gap-3 border-t border-border/50 pt-3.5 sm:mt-6 sm:pt-4">
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{t("hero.panelFoot")}</span>
              <span className="skol-signature-wordmark font-display text-sm font-bold tracking-[0.2em] text-foreground">СКОЛ<span className="text-primary">.</span></span>
              <span className="font-mono text-[9px] tracking-[0.16em] text-muted-foreground">РАБОТАЕМ ПО ПЛАНУ</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomepageHero;
