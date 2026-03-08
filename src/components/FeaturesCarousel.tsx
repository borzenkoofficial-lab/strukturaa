import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ClipboardCheck, Briefcase, ShoppingBag, Shield, Zap, Users, MessageSquare, Heart,
  ChevronLeft, ChevronRight
} from "lucide-react";

interface Feature {
  icon: typeof ClipboardCheck;
  title: string;
  description: string;
  gradient: string;
  link?: string;
}

const features: Feature[] = [
  {
    icon: ClipboardCheck,
    title: "Трекер проектов",
    description: "Отслеживайте каждый этап вашего ремонта или демонтажа в реальном времени — от начала работ до сдачи объекта. Фото-отчёты, статусы, прогресс.",
    gradient: "from-primary/20 to-accent/10",
    link: "/dashboard",
  },
  {
    icon: Briefcase,
    title: "Биржа заказов",
    description: "Не подходит наш прайс? Разместите заявку на бирже — десятки проверенных исполнителей предложат свои цены. Выберите лучшего!",
    gradient: "from-blue-500/20 to-cyan-500/10",
    link: "/marketplace",
  },
  {
    icon: ShoppingBag,
    title: "Маркетплейс инструментов",
    description: "Покупайте и продавайте б/у и новый строительный инструмент. Экономьте до 70% на профессиональном оборудовании.",
    gradient: "from-emerald-500/20 to-green-500/10",
    link: "/shop",
  },
  {
    icon: MessageSquare,
    title: "Встроенный чат",
    description: "Общайтесь напрямую с исполнителями и заказчиками через защищённый чат. Все переписки привязаны к заявкам.",
    gradient: "from-violet-500/20 to-purple-500/10",
    link: "/marketplace",
  },
  {
    icon: Shield,
    title: "Гарантия 3 года",
    description: "Даём гарантию на все виды работ. Если что-то пошло не так — исправим бесплатно. Работаем по договору.",
    gradient: "from-amber-500/20 to-orange-500/10",
    link: "/services",
  },
  {
    icon: Users,
    title: "Личный кабинет",
    description: "Управляйте профилем, избранными услугами, историей заказов и общением — всё в одном месте.",
    gradient: "from-rose-500/20 to-pink-500/10",
    link: "/dashboard",
  },
  {
    icon: Zap,
    title: "Реакция за 30 минут",
    description: "Оставьте заявку — и мы свяжемся с вами в течение 30 минут. Быстрый выезд на объект в день обращения.",
    gradient: "from-yellow-500/20 to-amber-500/10",
    link: "/contacts",
  },
];

const FeaturesCarousel = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const paginate = useCallback((dir: number) => {
    setDirection(dir);
    setCurrent((prev) => (prev + dir + features.length) % features.length);
  }, []);

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => paginate(1), 5000);
    return () => clearInterval(timer);
  }, [autoplay, paginate]);

  const feature = features[current];

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -200 : 200, opacity: 0 }),
  };

  return (
    <section className="py-12 sm:py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Возможности платформы
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Больше, чем строительная компания — целая экосистема
          </p>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
        >
          {/* Main card */}
          <div className="relative overflow-hidden rounded-2xl glass-card min-h-[220px] sm:min-h-[200px]">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 cursor-pointer"
                onClick={() => feature.link && navigate(feature.link)}
              >
                <div className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center border border-border/20`}>
                  <feature.icon className="w-8 h-8 sm:w-10 sm:h-10 text-foreground" />
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h3 className="font-display text-lg sm:text-xl font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-lg">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Nav arrows */}
            <button
              onClick={(e) => { e.stopPropagation(); paginate(-1); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background/80 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); paginate(1); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background/80 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {features.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-6 bg-primary"
                    : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesCarousel;
