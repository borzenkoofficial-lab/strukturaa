import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Shield, Award, Leaf, ArrowUpRight, ClipboardList, Search, Ruler, CheckCircle2, Box, Layers3, ScanLine, Move3D, ArrowRight, CircleDot } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import { useLanguage, TranslationKey } from "@/contexts/LanguageContext";
import SEOHead from "@/components/SEOHead";

const values: { icon: typeof Shield; titleKey: TranslationKey; descKey: TranslationKey }[] = [
  { icon: Shield, titleKey: "about.value1", descKey: "about.value1Desc" },
  { icon: Award, titleKey: "about.value2", descKey: "about.value2Desc" },
  { icon: Leaf, titleKey: "about.value3", descKey: "about.value3Desc" },
];

const principles = [
  { icon: ClipboardList, title: "Сначала задача", text: "Уточняем, что требуется демонтировать, подготовить или смонтировать — и какой результат нужен заказчику." },
  { icon: Search, title: "Затем условия", text: "Учитываем материалы, доступ, ограничения площадки, объём работ и вывоз отходов." },
  { icon: Ruler, title: "Потом расчёт", text: "Согласуем состав работ, последовательность, сроки и сметные позиции до старта." },
  { icon: CheckCircle2, title: "Работа по этапам", text: "Двигаемся по согласованному плану и отдельно фиксируем изменения объёма." },
];


type AboutModelMode = "volume" | "plan" | "sequence";

const aboutModelModes: { id: AboutModelMode; label: string; icon: typeof Box; title: string }[] = [
  { id: "volume", label: "Объём", icon: Box, title: "Объёмная схема объекта" },
  { id: "plan", label: "План", icon: Layers3, title: "Слои и структура пространства" },
  { id: "sequence", label: "Этапы", icon: ScanLine, title: "Последовательность решений" },
];

function AboutModelStudio() {
  const [mode, setMode] = useState<AboutModelMode>("volume");
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const current = aboutModelModes.find((item) => item.id === mode) ?? aboutModelModes[0];

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    setTilt({
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 7,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * -6,
    });
  };

  return (
    <section className="skol-about-studio relative mb-10 overflow-hidden border border-border/60 bg-background/60">
      <div className="skol-about-studio-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative z-10 grid lg:grid-cols-[.72fr_1.28fr]">
        <div className="flex flex-col justify-between border-b border-border/50 p-5 sm:p-8 lg:border-b-0 lg:border-r lg:p-9">
          <div>
            <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-primary"><span className="h-px w-6 bg-primary" /> 02 / DIGITAL WORKSPACE</p>
            <h2 className="max-w-md font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">У каждого объекта своя логика. Показываем её в деталях.</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">Переключайте виды макета: объёмную схему, планировочную структуру и последовательность этапов. На компьютере модель реагирует на движение указателя.</p>
          </div>
          <div className="mt-7 border-t border-border/50 pt-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center border border-primary/25 bg-primary/10 text-primary"><Move3D className="h-4 w-4" /></span>
              <div>
                <p className="text-sm font-medium text-foreground">Интерактивный макет</p>
                <p className="mt-1 text-xs text-muted-foreground">Концептуальная схема, не чертёж для производства</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative min-w-0 p-3 sm:p-5 lg:p-6">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {aboutModelModes.map((item) => {
              const Icon = item.icon;
              const selected = mode === item.id;
              return (
                <button key={item.id} type="button" aria-pressed={selected} onClick={() => setMode(item.id)}
                  className={`skol-about-model-tab inline-flex min-h-10 items-center gap-2 border px-3 py-2 text-xs font-medium transition-colors ${selected ? "border-primary/60 bg-primary text-primary-foreground" : "border-border/60 bg-card/80 text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}>
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.7} />{item.label}
                </button>
              );
            })}
          </div>
          <div className="skol-about-model-stage relative flex min-h-[270px] items-center justify-center overflow-hidden sm:min-h-[335px]"
            onPointerMove={handlePointerMove} onPointerLeave={() => setTilt({ x: 0, y: 0 })}
            aria-label="Интерактивная 3D-схема СКОЛ">
            <motion.div className="skol-about-model-object w-full max-w-[510px]"
              style={{ rotateX: tilt.y, rotateY: tilt.x, transformStyle: "preserve-3d" }}
              transition={{ type: "spring", stiffness: 120, damping: 20, mass: 0.7 }}>
              <AnimatePresence mode="wait">
                <motion.svg key={mode} viewBox="0 0 600 390" className="block h-auto w-full overflow-visible"
                  role="img" aria-label={current.title}
                  initial={{ opacity: 0, scale: .95, y: 7 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: .97, y: -4 }} transition={{ duration: .28 }}>
                  <defs>
                    <pattern id="about-grid" width="22" height="22" patternUnits="userSpaceOnUse">
                      <path d="M22 0H0V22" fill="none" stroke="hsl(var(--foreground) / .085)" strokeWidth="1" />
                    </pattern>
                    <linearGradient id="about-volume-top" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary) / .28)" /><stop offset="100%" stopColor="hsl(var(--primary) / .07)" />
                    </linearGradient>
                    <linearGradient id="about-volume-side" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--foreground) / .14)" /><stop offset="100%" stopColor="hsl(var(--foreground) / .035)" />
                    </linearGradient>
                  </defs>
                  <rect x="8" y="8" width="584" height="374" fill="url(#about-grid)" />
                  {mode === "volume" && <g stroke="hsl(var(--primary) / .75)" strokeWidth="1.35" strokeLinejoin="round">
                    <path d="M75 252 291 128 524 260 309 378Z" fill="hsl(var(--foreground) / .025)" strokeDasharray="4 6" />
                    <path d="M167 189 296 115 438 196 309 271Z" fill="url(#about-volume-top)" strokeWidth="2" />
                    <path d="M167 189 309 271 309 337 167 255Z" fill="url(#about-volume-side)" />
                    <path d="M309 271 438 196 438 262 309 337Z" fill="hsl(var(--primary) / .15)" />
                    <path d="M201 209 296 154 401 214 309 268Z M201 209V252 M249 236V280 M296 154V294 M354 242V311 M401 214V283" fill="none" opacity=".65" />
                    <path d="M146 166V248M139 173l7-7 7 7M139 241l7 7 7-7M451 183l46 26m-13-1 13 1-5-11" fill="none" strokeDasharray="3 4" />
                    <circle cx="296" cy="115" r="4" fill="hsl(var(--primary))"/><circle cx="438" cy="196" r="4" fill="hsl(var(--primary))"/>
                    <circle cx="309" cy="271" r="4" fill="hsl(var(--primary))"/><circle cx="167" cy="189" r="4" fill="hsl(var(--primary))"/>
                  </g>}
                  {mode === "plan" && <g stroke="hsl(var(--primary) / .8)" strokeWidth="1.5" strokeLinejoin="round">
                    <path d="M95 139 293 62 510 157 312 236Z" fill="hsl(var(--foreground) / .025)" strokeDasharray="4 5"/>
                    <path d="M153 139 244 103 293 126 202 163Z" fill="url(#about-volume-top)"/>
                    <path d="M244 103 354 64 406 88 293 126Z" fill="hsl(var(--primary) / .13)"/>
                    <path d="M202 163 293 126 293 195 202 233Z" fill="url(#about-volume-side)"/>
                    <path d="M293 126 406 88 406 157 293 195Z" fill="hsl(var(--primary) / .12)"/>
                    <path d="M202 163 293 195 348 220 257 259Z" fill="hsl(var(--foreground) / .05)"/>
                    <path d="M293 195 406 157 462 183 348 220Z" fill="url(#about-volume-top)"/>
                    <path d="M257 259 348 220 462 183 462 244 348 283 257 319Z" fill="none" strokeDasharray="4 5" opacity=".5"/>
                    <path d="M132 116V231m-7-108 7-7 7 7m-14 101 7 7 7-7M480 138l42 19m-13-1 13 1-5-11" fill="none"/>
                    <circle cx="293" cy="126" r="4" fill="hsl(var(--primary))"/><circle cx="406" cy="88" r="4" fill="hsl(var(--primary))"/>
                  </g>}
                  {mode === "sequence" && <g stroke="hsl(var(--primary) / .78)" strokeWidth="1.5" strokeLinejoin="round">
                    <path d="M72 250 200 177 327 251 455 178" fill="none" strokeDasharray="4 6" opacity=".7"/>
                    {[{x:65,y:220,n:"01"},{x:190,y:148,n:"02"},{x:315,y:220,n:"03"},{x:440,y:148,n:"04"}].map((p) => <g key={p.n}>
                      <path d={`M${p.x} ${p.y} l42 -24 42 24 -42 24z`} fill="url(#about-volume-top)"/>
                      <path d={`M${p.x} ${p.y} l42 24 v47 l-42 -24z`} fill="url(#about-volume-side)"/>
                      <path d={`M${p.x+42} ${p.y+24} l42 -24 v47 l-42 24z`} fill="hsl(var(--primary) / .14)"/>
                      <text x={p.x+42} y={p.y+8} textAnchor="middle" fill="hsl(var(--foreground))" stroke="none" fontSize="11" fontFamily="monospace">{p.n}</text>
                    </g>)}
                    <path d="M155 196l19-11m-8 0 8 0-2 8m106 11 19-11m-8 0 8 0-2 8m106-8 19-11m-8 0 8 0-2 8" fill="none"/>
                  </g>}
                  <g fill="hsl(var(--muted-foreground))" fontSize="10" fontFamily="monospace" letterSpacing="1.3">
                    <text x="25" y="31">SK / TECHNICAL VIEW</text><text x="424" y="360">SCHEMATIC / {mode.toUpperCase()}</text>
                  </g>
                  <g fill="none" stroke="hsl(var(--primary) / .55)"><path d="M26 46H94M26 46V69M574 320V344H550M574 46H548M574 46V70"/></g>
                </motion.svg>
              </AnimatePresence>
            </motion.div>
            <motion.div className="absolute bottom-3 right-3 border border-primary/25 bg-card/90 px-3 py-2 backdrop-blur-sm"
              animate={{ y: [0, -4, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}>
              <span className="flex items-center gap-2 text-[10px] text-foreground"><CircleDot className="h-3.5 w-3.5 text-primary"/> {current.label} / 3D</span>
            </motion.div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-border/50 pt-3">
            <p className="text-sm font-medium text-foreground">{current.title}</p>
            <span className="font-mono text-[9px] tracking-[.12em] text-muted-foreground">DRAG / HOVER</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutProcessExplorer() {
  const [activeStep, setActiveStep] = useState(0);
  const active = principles[activeStep];
  const ActiveIcon = active.icon;
  return (
    <section className="skol-about-process mb-11 overflow-hidden border border-border/60 bg-card/35">
      <div className="grid lg:grid-cols-[.78fr_1.22fr]">
        <div className="relative flex flex-col justify-between border-b border-border/50 p-5 sm:p-8 lg:border-b-0 lg:border-r lg:p-9">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-primary/15"/>
          <div className="relative">
            <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-primary"><span className="h-px w-6 bg-primary"/> 05 / Последовательность</p>
            <h2 className="max-w-md font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">От задачи к результату — по понятным этапам.</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">Выберите этап, чтобы посмотреть, какие условия учитываем перед следующим решением.</p>
          </div>
          <div className="relative mt-7 flex items-center gap-3 border-t border-border/50 pt-4">
            <span className="flex h-10 w-10 items-center justify-center border border-primary/30 bg-primary/10 text-primary"><ActiveIcon className="h-5 w-5"/></span>
            <div><p className="font-mono text-[9px] uppercase tracking-[.18em] text-muted-foreground">CURRENT PHASE</p><p className="mt-1 text-sm font-semibold text-foreground">0{activeStep + 1} / 04</p></div>
          </div>
        </div>
        <div className="min-w-0 p-4 sm:p-7 lg:p-8">
          <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {principles.map((step, index) => {
              const Icon = step.icon;
              const selected = activeStep === index;
              return <button key={step.title} type="button" aria-pressed={selected} onClick={() => setActiveStep(index)}
                className={`skol-about-step-button min-h-[100px] border p-3 text-left transition-colors sm:p-4 ${selected ? "border-primary/55 bg-primary/10" : "border-border/55 bg-background/45 hover:border-primary/35"}`}>
                <span className={`mb-3 flex h-7 w-7 items-center justify-center border ${selected ? "border-primary/35 bg-primary text-primary-foreground" : "border-border/70 text-muted-foreground"}`}><Icon className="h-3.5 w-3.5"/></span>
                <span className={`block font-mono text-[9px] ${selected ? "text-primary" : "text-muted-foreground"}`}>0{index + 1}</span>
                <span className="mt-1 block text-xs font-semibold text-foreground sm:text-sm">{step.title}</span>
              </button>;
            })}
          </div>
          <div className="skol-about-process-detail relative min-h-[180px] overflow-hidden border border-border/55 bg-background/60 p-5 sm:p-7">
            <div className="pointer-events-none absolute right-0 top-0 h-px w-2/3 bg-gradient-to-l from-primary/65 to-transparent"/>
            <AnimatePresence mode="wait"><motion.div key={activeStep} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}} transition={{duration:.22}}>
              <p className="font-mono text-[9px] uppercase tracking-[.2em] text-primary">PROCESS / 0{activeStep + 1}</p>
              <h3 className="mt-3 font-display text-xl font-semibold text-foreground sm:text-2xl">{active.title}</h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{active.text}</p>
            </motion.div></AnimatePresence>
          </div>
          <div className="mt-4 flex justify-end"><button type="button" onClick={() => setActiveStep((activeStep + 1) % principles.length)} className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-foreground transition-colors hover:text-primary">Следующий этап <ArrowRight className="h-4 w-4"/></button></div>
        </div>
      </div>
    </section>
  );
}


const AboutPage = () => {
  const { t } = useLanguage();

  return (
    <>
      <SEOHead title="О компании — СКОЛ" description="Подход СКОЛ к демонтажным и строительным работам: понятные этапы, согласованные объёмы и контроль исполнения." canonical="/about" />
      <main className="relative mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        <AnimatedSection>
          <header className="relative mb-7 grid overflow-hidden rounded-2xl border border-border/60 bg-card/35 shadow-[0_28px_90px_-56px_hsl(var(--primary)/0.35)] lg:grid-cols-[1.05fr_.95fr]">
            <div className="relative z-10 flex flex-col justify-center p-6 sm:p-9 lg:p-12">
              <p className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.22em] text-primary sm:text-xs">
                <span className="h-px w-8 bg-primary" /> СКОЛ / ПОДХОД К РАБОТЕ
              </p>
              <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[.98] tracking-[-.045em] text-foreground sm:text-5xl lg:text-6xl">
                {t("about.title")}
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                {t("about.subtitle")}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/services" className="inline-flex min-h-11 items-center gap-2 rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110">
                  Изучить направления <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link to="/contacts" className="inline-flex min-h-11 items-center gap-2 border border-border/70 px-5 py-3 text-sm font-medium text-foreground transition hover:border-primary/50">
                  Обсудить объект
                </Link>
              </div>
              <div className="mt-9 flex items-center gap-3 border-t border-border/60 pt-4 text-[10px] uppercase tracking-[.17em] text-muted-foreground">
                <span className="font-mono text-primary">01</span>
                <span>Принцип работы — ясность до начала работ</span>
              </div>
            </div>
            <div className="relative min-h-[270px] overflow-hidden border-t border-border/50 sm:min-h-[360px] lg:border-l lg:border-t-0">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url(https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1400&q=85)" }}
                role="img"
                aria-label="Архитектурный визуальный образ"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-background/5 lg:bg-gradient-to-r lg:from-background/15 lg:via-transparent lg:to-background/10" />
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(hsl(var(--foreground)/.15) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)/.15) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-7 sm:left-7 sm:right-7">
                <div className="max-w-xs">
                  <span className="mb-2 block font-mono text-[10px] uppercase tracking-[.18em] text-primary">СКОЛ / 01</span>
                  <p className="text-lg font-medium leading-snug text-white sm:text-xl">Порядок в деталях. Предсказуемость в работе.</p>
                </div>
                <span className="hidden border border-white/25 bg-black/25 px-3 py-2 text-[9px] uppercase tracking-[.15em] text-white/80 backdrop-blur-sm sm:inline-block">Визуальный образ</span>
              </div>
            </div>
          </header>
        </AnimatedSection>

        <AnimatedSection delay={0.045}>
          <AboutModelStudio />
        </AnimatedSection>

        <AnimatedSection delay={0.06}>
          <section className="relative mb-10 overflow-hidden border border-border/60 bg-card/45 p-6 sm:p-9 lg:p-11">
            <div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full border border-primary/15" />
            <div className="pointer-events-none absolute -right-1 top-0 h-full w-px bg-gradient-to-b from-transparent via-primary/35 to-transparent" />
            <div className="relative grid gap-7 lg:grid-cols-[.35fr_1fr] lg:gap-12">
              <div>
                <p className="font-mono text-xs uppercase tracking-[.18em] text-primary">02 / Принцип</p>
                <p className="mt-3 text-sm text-muted-foreground">Не усложнять процесс ради красивых обещаний</p>
              </div>
              <div>
                <p className="max-w-4xl text-xl font-medium leading-relaxed tracking-tight text-foreground sm:text-2xl lg:text-3xl">{t("about.story")}</p>
                <div className="mt-6 max-w-3xl border-l-2 border-primary pl-4">
                  <p className="text-sm leading-7 text-muted-foreground sm:text-base">{t("about.mission")}</p>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

        <section className="mb-11">
          <div className="mb-5 flex items-end justify-between gap-4 border-b border-border/60 pb-4">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.2em] text-primary">03 / В основе</p>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Принципы работы</h2>
            </div>
            <span className="hidden font-mono text-xs text-muted-foreground sm:block">03 / 03</span>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {values.map((value, i) => (
              <AnimatedSection key={value.titleKey} delay={0.08 + i * 0.07}>
                <motion.article className="group relative flex h-full min-h-[220px] flex-col justify-between overflow-hidden border border-border/60 bg-card/45 p-5 transition-colors hover:border-primary/40 sm:p-6" whileHover={{ y: -3 }} transition={{ duration: 0.22 }}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">0{i + 1} / PRINCIPLE</span>
                    <div className="flex h-10 w-10 items-center justify-center border border-border/80 bg-background/50 text-primary transition-colors group-hover:border-primary/40">
                      <value.icon className="h-5 w-5" strokeWidth={1.6} />
                    </div>
                  </div>
                  <div className="mt-8">
                    <h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground">{t(value.titleKey)}</h3>
                    <p className="text-sm leading-7 text-muted-foreground">{t(value.descKey)}</p>
                  </div>
                  <div className="mt-5 flex justify-end border-t border-border/60 pt-3 text-muted-foreground">
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                </motion.article>
              </AnimatedSection>
            ))}
          </div>
        </section>

        <AnimatedSection delay={0.06}>
          <AboutProcessExplorer />
        </AnimatedSection>
      </main>
    </>
  );
};

export default AboutPage;
