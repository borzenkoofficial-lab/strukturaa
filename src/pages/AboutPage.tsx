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


type AboutMockupKind = "demolition" | "preparation" | "assembly";

const aboutMockups: { kind: AboutMockupKind; number: string; eyebrow: string; title: string; description: string }[] = [
  {
    kind: "demolition",
    number: "01",
    eyebrow: "DEMOLITION / ZONING",
    title: "Демонтаж и разборка",
    description: "Границы работ, сохраняемые элементы и зоны разборки в одной объёмной схеме.",
  },
  {
    kind: "preparation",
    number: "02",
    eyebrow: "SPACE / LAYERS",
    title: "Подготовка пространства",
    description: "Основания, перегородки и уровни помещения — отдельными читаемыми слоями.",
  },
  {
    kind: "assembly",
    number: "03",
    eyebrow: "ASSEMBLY / DETAILS",
    title: "Сборка и монтаж",
    description: "Конструктивные элементы и узлы собраны в единую изометрическую модель.",
  },
];

function AboutMockupDrawing({ kind }: { kind: AboutMockupKind }) {
  return (
    <svg viewBox="0 0 520 340" className="block h-auto w-full overflow-visible" role="img"
      aria-label={kind === "demolition" ? "Изометрический макет помещения и зон демонтажа" : kind === "preparation" ? "Объёмная схема слоёв помещения" : "Изометрическая схема монтажа конструктивных элементов"}>
      <g fill="none" stroke="hsl(var(--foreground) / .07)" strokeWidth="1">
        <path d="M24 286H496M48 302H472M70 318H450M48 72H472M32 94H488" />
        <path d="M70 45V300M120 45V300M170 45V300M220 45V300M270 45V300M320 45V300M370 45V300M420 45V300M470 45V300" opacity=".45" />
      </g>
      {kind === "demolition" && (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M78 226 250 130 449 229 275 326Z" fill="hsl(var(--foreground) / .035)" stroke="hsl(var(--foreground) / .25)" strokeWidth="1.3" />
          <path d="M128 137 259 65 390 137 259 211Z" fill="hsl(var(--primary) / .13)" stroke="hsl(var(--primary) / .75)" strokeWidth="1.5" />
          <path d="M128 137 259 211 259 287 128 212Z" fill="hsl(var(--foreground) / .055)" stroke="hsl(var(--foreground) / .3)" strokeWidth="1.2" />
          <path d="M259 211 390 137 390 213 259 287Z" fill="hsl(var(--primary) / .12)" stroke="hsl(var(--primary) / .8)" strokeWidth="1.4" />
          <path d="M289 194 348 160 348 205 289 239Z" fill="hsl(var(--background) / .85)" stroke="hsl(var(--foreground) / .42)" strokeWidth="1.2" />
          <path d="M142 148 244 206 244 257 142 199Z" fill="none" stroke="hsl(var(--foreground) / .24)" strokeWidth="1" />
          <path d="M269 218 379 156" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeDasharray="7 5" />
          <path d="M265 239 282 230M265 251 282 242M265 263 282 254M265 275 282 266" stroke="hsl(var(--primary))" strokeWidth="2" />
          <path d="M355 112 417 79 449 97" fill="none" stroke="hsl(var(--primary) / .9)" strokeWidth="1.3" strokeDasharray="3 5" />
          <circle cx="355" cy="112" r="4" fill="hsl(var(--primary))" />
          <path d="M407 74h64v29h-64z" fill="hsl(var(--card))" stroke="hsl(var(--primary) / .55)" strokeWidth="1" />
          <text x="439" y="86" textAnchor="middle" fill="hsl(var(--primary))" fontSize="7.5" letterSpacing="1">ZONE A</text>
          <text x="439" y="96" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="8.5">REMOVE</text>
          <path d="M93 244V273M86 251l7-7 7 7M86 266l7 7 7-7" fill="none" stroke="hsl(var(--foreground) / .45)" strokeWidth="1.1" />
          <text x="103" y="263" fill="hsl(var(--muted-foreground))" fontSize="8" letterSpacing="1">LEVEL 00</text>
        </g>
      )}
      {kind === "preparation" && (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M74 240 251 143 447 237 268 332Z" fill="hsl(var(--foreground) / .035)" stroke="hsl(var(--foreground) / .28)" strokeWidth="1.2" />
          <path d="M96 209 251 124 423 207 267 294Z" fill="hsl(var(--primary) / .05)" stroke="hsl(var(--primary) / .55)" strokeWidth="1.3" />
          <path d="M96 209 267 294 267 307 96 223Z" fill="hsl(var(--foreground) / .08)" stroke="hsl(var(--foreground) / .3)" strokeWidth="1" />
          <path d="M267 294 423 207 423 220 267 307Z" fill="hsl(var(--primary) / .12)" stroke="hsl(var(--primary) / .5)" strokeWidth="1" />
          <path d="M124 172 251 103 390 171 262 242Z" fill="hsl(var(--primary) / .12)" stroke="hsl(var(--primary) / .75)" strokeWidth="1.3" />
          <path d="M124 172 262 242 262 268 124 198Z" fill="hsl(var(--foreground) / .06)" stroke="hsl(var(--foreground) / .3)" strokeWidth="1.1" />
          <path d="M262 242 390 171 390 197 262 268Z" fill="hsl(var(--primary) / .13)" stroke="hsl(var(--primary) / .6)" strokeWidth="1.1" />
          <path d="M160 152 205 128 250 150 205 175Z" fill="hsl(var(--background) / .75)" stroke="hsl(var(--foreground) / .38)" strokeWidth="1.2" />
          <path d="M205 175V210M250 150V184" stroke="hsl(var(--foreground) / .3)" strokeWidth="1" />
          <path d="M143 113 143 84 206 52 206 80M143 84 206 114" fill="none" stroke="hsl(var(--primary) / .55)" strokeWidth="1.2" strokeDasharray="3 4" />
          <path d="M311 99 378 64 412 80" fill="none" stroke="hsl(var(--primary) / .8)" strokeWidth="1.3" />
          <circle cx="311" cy="99" r="3.5" fill="hsl(var(--primary))" />
          <path d="M381 52h81v28h-81z" fill="hsl(var(--card))" stroke="hsl(var(--primary) / .55)" strokeWidth="1" />
          <text x="421" y="64" textAnchor="middle" fill="hsl(var(--primary))" fontSize="7.5" letterSpacing="1">LAYER 02</text>
          <text x="421" y="74" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="8.5">BASE / LEVEL</text>
          <path d="M110 250 157 275M110 250l1 10m-1-10 10 1" fill="none" stroke="hsl(var(--foreground) / .4)" strokeWidth="1.1" />
          <text x="83" y="244" fill="hsl(var(--muted-foreground))" fontSize="8" letterSpacing="1">SUBSTRATE</text>
        </g>
      )}
      {kind === "assembly" && (
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d="M73 263 258 162 449 258 264 334Z" fill="hsl(var(--foreground) / .03)" stroke="hsl(var(--foreground) / .28)" strokeWidth="1.2" />
          <path d="M122 211 258 136 397 206 261 282Z" fill="hsl(var(--primary) / .08)" stroke="hsl(var(--primary) / .65)" strokeWidth="1.2" />
          <path d="M122 145 188 109 254 143 188 180Z" fill="hsl(var(--primary) / .22)" stroke="hsl(var(--primary) / .8)" strokeWidth="1.2" />
          <path d="M188 180 254 143 254 191 188 228Z" fill="hsl(var(--foreground) / .075)" stroke="hsl(var(--foreground) / .36)" strokeWidth="1.2" />
          <path d="M122 145 188 180 188 228 122 193Z" fill="hsl(var(--foreground) / .04)" stroke="hsl(var(--foreground) / .3)" strokeWidth="1.2" />
          <path d="M257 111 323 75 389 108 323 146Z" fill="hsl(var(--primary) / .22)" stroke="hsl(var(--primary) / .8)" strokeWidth="1.2" />
          <path d="M323 146 389 108 389 157 323 194Z" fill="hsl(var(--primary) / .12)" stroke="hsl(var(--primary) / .6)" strokeWidth="1.2" />
          <path d="M257 111 323 146 323 194 257 159Z" fill="hsl(var(--foreground) / .055)" stroke="hsl(var(--foreground) / .3)" strokeWidth="1.2" />
          <path d="M255 201 321 165 387 199 321 236Z" fill="hsl(var(--foreground) / .09)" stroke="hsl(var(--foreground) / .45)" strokeWidth="1.2" />
          <path d="M321 236 387 199 387 222 321 259Z" fill="hsl(var(--primary) / .16)" stroke="hsl(var(--primary) / .6)" strokeWidth="1.1" />
          <path d="M255 201 321 236 321 259 255 224Z" fill="hsl(var(--foreground) / .05)" stroke="hsl(var(--foreground) / .3)" strokeWidth="1.1" />
          <path d="M203 94 227 81 248 92M227 81V65M219 72l8-7 8 7" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.2" />
          <path d="M397 121 436 100M429 100h7v7" fill="none" stroke="hsl(var(--primary) / .8)" strokeWidth="1.2" />
          <path d="M408 86h72v27h-72z" fill="hsl(var(--card))" stroke="hsl(var(--primary) / .55)" strokeWidth="1" />
          <text x="444" y="98" textAnchor="middle" fill="hsl(var(--primary))" fontSize="7.5" letterSpacing="1">NODE 03</text>
          <text x="444" y="108" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="8.5">ASSEMBLY</text>
          <path d="M100 275 127 290M100 275v9m0-9 9 1" fill="none" stroke="hsl(var(--foreground) / .4)" strokeWidth="1.1" />
          <text x="82" y="269" fill="hsl(var(--muted-foreground))" fontSize="8" letterSpacing="1">MODULES</text>
        </g>
      )}
      <g fill="hsl(var(--muted-foreground))" fontSize="8" fontFamily="ui-monospace, monospace" letterSpacing="1.4">
        <text x="24" y="24">SKOL / SPATIAL STUDY</text>
        <text x="392" y="325">AXONOMETRY</text>
      </g>
      <path d="M24 36H76M24 36V54M496 286V304H478" fill="none" stroke="hsl(var(--primary) / .55)" strokeWidth="1" />
    </svg>
  );
}

function AboutMockupGallery() {
  return (
    <section className="skol-about-mockup-gallery mb-11">
      <div className="mb-5 grid gap-4 border-b border-border/60 pb-5 sm:grid-cols-[.8fr_1.2fr] sm:items-end">
        <div>
          <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-primary">
            <span className="h-px w-6 bg-primary" /> 03 / SPATIAL STUDIES
          </p>
          <h2 className="max-w-xl font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Один объект — несколько точек зрения.</h2>
        </div>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
          Три дополнительных объёмных макета показывают, как можно разложить пространство на понятные части: что убрать, что подготовить и как связать элементы между собой.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {aboutMockups.map((item, index) => (
          <AboutMockupCard key={item.kind} item={item} index={index} />
        ))}
      </div>
      <p className="mt-3 text-[10px] leading-5 text-muted-foreground/80">
        Схемы концептуальные: это визуализация подхода, а не рабочие чертежи конкретного объекта.
      </p>
    </section>
  );
}

function AboutMockupCard({ item, index }: { item: (typeof aboutMockups)[number]; index: number }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    setTilt({
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 4,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * -4,
    });
  };

  return (
    <motion.article
      className="group relative min-w-0 overflow-hidden border border-border/65 bg-card/35 transition-colors hover:border-primary/45"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.22 }}
    >
      <div className="flex items-center justify-between border-b border-border/55 px-4 py-3">
        <span className="font-mono text-[9px] tracking-[.15em] text-muted-foreground">{item.eyebrow}</span>
        <span className="font-mono text-xs text-primary">{item.number}</span>
      </div>
      <div className="relative flex min-h-[230px] items-center justify-center overflow-hidden px-2 py-3 sm:min-h-[255px]">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[.035] via-transparent to-transparent" />
        <motion.div
          className="relative z-10 w-full max-w-[450px]"
          style={{ rotateX: tilt.y, rotateY: tilt.x, transformStyle: "preserve-3d" }}
          transition={{ type: "spring", stiffness: 125, damping: 20, mass: 0.8 }}
        >
          <motion.div
            animate={{ y: [0, index % 2 === 0 ? -3 : 3, 0] }}
            transition={{ duration: 5 + index * 0.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <AboutMockupDrawing kind={item.kind} />
          </motion.div>
        </motion.div>
        <span className="absolute bottom-3 right-3 border border-border/60 bg-background/80 px-2 py-1 font-mono text-[8px] tracking-[.12em] text-muted-foreground">
          INTERACTIVE / 3D
        </span>
      </div>
      <div className="border-t border-border/55 p-4 sm:p-5">
        <h3 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">{item.title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
      </div>
    </motion.article>
  );
}



type AboutInspectionZone = "structure" | "engineering" | "access" | "surfaces";

const aboutInspectionZones: {
  id: AboutInspectionZone;
  label: string;
  icon: typeof Box;
  code: string;
  title: string;
  text: string;
  checks: string[];
}[] = [
  {
    id: "structure",
    label: "Конструкции",
    icon: Layers3,
    code: "01 / STRUCTURE",
    title: "Что разбираем, а что сохраняем",
    text: "До демонтажа отделяем рабочую зону от элементов, которые должны остаться нетронутыми. Границы фиксируем до начала работ.",
    checks: ["Границы и состав демонтажа", "Сохраняемые конструкции и отделка", "Последовательность разборки"],
  },
  {
    id: "engineering",
    label: "Инженерия",
    icon: ScanLine,
    code: "02 / ENGINEERING",
    title: "Коммуникации требуют отдельного внимания",
    text: "Уточняем расположение инженерных систем и согласуем необходимые отключения, защиту и доступ к ним с ответственными на объекте.",
    checks: ["Расположение коммуникаций", "Порядок отключений и допусков", "Защита действующих систем"],
  },
  {
    id: "access",
    label: "Доступ и вывоз",
    icon: ClipboardList,
    code: "03 / LOGISTICS",
    title: "Работы должны вписываться в режим объекта",
    text: "Продумываем маршруты перемещения материалов, доступ бригады, зоны погрузки и вывоз отходов с учётом ограничений площадки.",
    checks: ["Доступ и маршруты перемещения", "Временные окна и ограничения", "Место погрузки и вывоз отходов"],
  },
  {
    id: "surfaces",
    label: "Основания",
    icon: Ruler,
    code: "04 / SURFACES",
    title: "Состояние основания влияет на следующий этап",
    text: "Уточняем требуемый результат после демонтажа: что нужно оставить, очистить, подготовить или передать следующему исполнителю.",
    checks: ["Состояние стен, пола и потолка", "Требования к подготовке", "Критерии передачи следующему этапу"],
  },
];

function AboutObjectInspector() {
  const [activeZone, setActiveZone] = useState<AboutInspectionZone>("structure");
  const active = aboutInspectionZones.find((zone) => zone.id === activeZone) ?? aboutInspectionZones[0];
  const ActiveIcon = active.icon;

  return (
    <section className="skol-about-inspector mb-11 overflow-hidden border border-border/60 bg-card/35">
      <div className="relative border-b border-border/55 p-5 sm:p-7 lg:p-9">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-primary/[.045] to-transparent" />
        <div className="relative grid gap-4 sm:grid-cols-[.9fr_1.1fr] sm:items-end">
          <div>
            <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-primary">
              <span className="h-px w-6 bg-primary" /> 04 / FIELD INSPECTION
            </p>
            <h2 className="max-w-xl font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Объект — это не только стены. Важны все условия.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            Переключайте зоны на схеме. Для каждой показали отдельный набор вопросов, которые стоит прояснить до согласования объёма и последовательности работ.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.08fr_.92fr]">
        <div className="min-w-0 border-b border-border/55 p-3 sm:p-5 lg:border-b-0 lg:border-r lg:p-6">
          <div className="relative flex min-h-[255px] items-center justify-center overflow-hidden border border-border/50 bg-background/35 sm:min-h-[335px]">
            <div className="pointer-events-none absolute inset-0 opacity-70" style={{ backgroundImage: "linear-gradient(hsl(var(--foreground)/.045) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)/.045) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
            <motion.svg
              key={activeZone}
              viewBox="0 0 540 360"
              className="relative z-10 block h-auto w-full max-w-[580px] overflow-visible p-1 sm:p-3"
              role="img"
              aria-label={"Изометрическая схема объекта. Активная зона: " + active.label}
              initial={{ opacity: 0, y: 5, scale: .985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: .24 }}
            >
              <defs>
                <linearGradient id="inspector-wall" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--foreground) / .09)" />
                  <stop offset="100%" stopColor="hsl(var(--foreground) / .025)" />
                </linearGradient>
                <linearGradient id="inspector-highlight" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary) / .30)" />
                  <stop offset="100%" stopColor="hsl(var(--primary) / .07)" />
                </linearGradient>
              </defs>
              <g fill="none" stroke="hsl(var(--foreground) / .08)" strokeWidth="1">
                <path d="M38 280H502M54 297H486M80 314H460" />
                <path d="M80 45V314M130 45V314M180 45V314M230 45V314M280 45V314M330 45V314M380 45V314M430 45V314M480 45V314" opacity=".45" />
              </g>
              <g strokeLinejoin="round" strokeLinecap="round">
                <path d="M75 239 259 137 469 238 286 340Z" fill="hsl(var(--foreground) / .035)" stroke="hsl(var(--foreground) / .32)" strokeWidth="1.5" />
                <path d="M107 145 260 60 421 142 268 230Z" fill="url(#inspector-wall)" stroke="hsl(var(--foreground) / .36)" strokeWidth="1.5" />
                <path d="M107 145 268 230 268 311 107 227Z" fill={activeZone === "structure" ? "url(#inspector-highlight)" : "hsl(var(--foreground) / .035)"} stroke={activeZone === "structure" ? "hsl(var(--primary) / .95)" : "hsl(var(--foreground) / .32)"} strokeWidth={activeZone === "structure" ? 2.4 : 1.3} />
                <path d="M268 230 421 142 421 223 268 311Z" fill={activeZone === "structure" ? "hsl(var(--primary) / .16)" : "hsl(var(--foreground) / .025)"} stroke={activeZone === "structure" ? "hsl(var(--primary) / .8)" : "hsl(var(--foreground) / .32)"} strokeWidth={activeZone === "structure" ? 2.1 : 1.3} />
                <path d="M145 166 241 113 241 185 145 239Z" fill="hsl(var(--background) / .32)" stroke="hsl(var(--foreground) / .25)" strokeWidth="1.2" />
                <path d="M301 213 374 171 374 224 301 266Z" fill="hsl(var(--background) / .65)" stroke="hsl(var(--foreground) / .3)" strokeWidth="1.2" />
                <path d="M301 213 337 234 337 286 301 266Z" fill="hsl(var(--foreground) / .045)" stroke="hsl(var(--foreground) / .22)" strokeWidth="1" />
                <path d="M337 234 374 213" stroke="hsl(var(--foreground) / .25)" strokeWidth="1" />
                <path d="M259 137 259 60" stroke="hsl(var(--foreground) / .25)" strokeWidth="1.2" />
              </g>
              <g opacity={activeZone === "engineering" ? 1 : .28} fill="none" stroke="hsl(var(--primary))" strokeLinecap="round" strokeLinejoin="round">
                <path d="M194 105 194 73 273 30 273 83 331 113 331 143" strokeWidth="3" />
                <path d="M194 73 218 86M273 30 298 44M331 113 354 101" strokeWidth="1.3" strokeDasharray="4 5" />
                <circle cx="194" cy="105" r="4" fill="hsl(var(--primary))" />
                <circle cx="331" cy="143" r="4" fill="hsl(var(--primary))" />
              </g>
              <g opacity={activeZone === "access" ? 1 : .26} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M75 239 121 263 168 237 192 250" strokeDasharray="6 5" />
                <path d="M183 239 192 250 178 252" />
                <circle cx="121" cy="263" r="5" fill="hsl(var(--background))" />
              </g>
              <g opacity={activeZone === "surfaces" ? 1 : .25} fill="none" stroke="hsl(var(--primary))" strokeWidth="1.1">
                <path d="M98 248 281 348M125 233 308 333M152 218 335 318M179 203 362 303M206 188 389 288M233 173 416 273" />
                <path d="M130 269 313 168M172 291 355 190M214 312 397 211M256 330 439 229" strokeDasharray="3 5" />
              </g>
              <g>
                <circle cx="212" cy="191" r={activeZone === "structure" ? 13 : 9} fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="1.6" />
                <text x="212" y="195" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10" fontFamily="monospace">01</text>
                <circle cx="331" cy="143" r={activeZone === "engineering" ? 13 : 9} fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="1.6" />
                <text x="331" y="147" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10" fontFamily="monospace">02</text>
                <circle cx="121" cy="263" r={activeZone === "access" ? 13 : 9} fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="1.6" />
                <text x="121" y="267" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10" fontFamily="monospace">03</text>
                <circle cx="288" cy="294" r={activeZone === "surfaces" ? 13 : 9} fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="1.6" />
                <text x="288" y="298" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10" fontFamily="monospace">04</text>
              </g>
              <g fill="hsl(var(--muted-foreground))" fontSize="9" fontFamily="ui-monospace, monospace" letterSpacing="1.25">
                <text x="24" y="22">SKOL / OBJECT REVIEW</text>
                <text x="366" y="334">SCHEMATIC / 01:04</text>
              </g>
              <path d="M24 34H84M24 34V53M516 296V316H496" fill="none" stroke="hsl(var(--primary) / .65)" strokeWidth="1" />
            </motion.svg>
            <span className="absolute bottom-3 left-3 border border-border/60 bg-background/90 px-2.5 py-1.5 font-mono text-[9px] tracking-[.12em] text-muted-foreground">
              ZONE {active.code.slice(0, 2)} / 04
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {aboutInspectionZones.map((zone) => {
              const Icon = zone.icon;
              const selected = activeZone === zone.id;
              return (
                <button key={zone.id} type="button" aria-pressed={selected} onClick={() => setActiveZone(zone.id)}
                  className={"skol-about-zone-tab flex min-h-[58px] items-center gap-2 border px-3 py-2.5 text-left transition-colors " + (selected ? "border-primary/65 bg-primary/10 text-foreground" : "border-border/55 bg-background/45 text-muted-foreground hover:border-primary/40 hover:text-foreground")}>
                  <span className={"flex h-8 w-8 shrink-0 items-center justify-center border " + (selected ? "border-primary/40 text-primary" : "border-border/70")}><Icon className="h-4 w-4" strokeWidth={1.6} /></span>
                  <span className="min-w-0">
                    <span className={"block font-mono text-[8px] " + (selected ? "text-primary" : "text-muted-foreground")}>{zone.code}</span>
                    <span className="mt-0.5 block text-xs font-semibold leading-tight">{zone.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex min-w-0 flex-col p-5 sm:p-7 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={activeZone} className="flex h-full flex-col" initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: .2 }}>
              <div className="flex items-start justify-between gap-3 border-b border-border/55 pb-5">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[.19em] text-primary">{active.code}</p>
                  <h3 className="mt-3 max-w-md font-display text-xl font-semibold leading-tight tracking-tight text-foreground sm:text-2xl">{active.title}</h3>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-primary/30 bg-primary/10 text-primary"><ActiveIcon className="h-5 w-5" strokeWidth={1.6} /></span>
              </div>
              <p className="mt-5 text-sm leading-7 text-muted-foreground">{active.text}</p>
              <div className="mt-6">
                <p className="mb-3 font-mono text-[9px] uppercase tracking-[.16em] text-muted-foreground">Что уточняем до старта</p>
                <ul className="space-y-3">
                  {active.checks.map((check, index) => (
                    <li key={check} className="flex items-start gap-3 text-sm leading-6 text-foreground">
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center border border-primary/45 text-primary"><CheckCircle2 className="h-3 w-3" /></span>
                      <span>{check}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto pt-7">
                <div className="border-t border-border/55 pt-4">
                  <p className="font-mono text-[9px] uppercase tracking-[.16em] text-muted-foreground">Следующий шаг</p>
                  <p className="mt-2 text-sm leading-6 text-foreground">Согласовать состав работ и условия площадки — затем переходить к смете и срокам.</p>
                </div>
                <Link to="/contacts" className="mt-5 inline-flex min-h-11 items-center gap-2 border border-primary/50 px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:bg-primary/10">
                  Обсудить свой объект <ArrowUpRight className="h-4 w-4 text-primary" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
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

        <AnimatedSection delay={0.055}>
          <AboutMockupGallery />
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

        <AnimatedSection delay={0.055}>
          <AboutObjectInspector />
        </AnimatedSection>

        <AnimatedSection delay={0.06}>
          <AboutProcessExplorer />
        </AnimatedSection>
      </main>
    </>
  );
};

export default AboutPage;
