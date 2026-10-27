import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Ruler, ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

interface ProjectDetailProps {
  project: {
    title: string;
    description: string;
    image: string;
    area: string;
    duration: string;
    category: string;
    gallery?: string[];
    visualReference?: boolean;
  };
  onClose: () => void;
}

const ProjectDetailModal = ({ project, onClose }: ProjectDetailProps) => {
  const allImages = [project.image, ...(project.gallery || [])];
  const [currentImg, setCurrentImg] = useState(0);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-md sm:p-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative my-auto max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-[1.5rem] border border-border/50 bg-card shadow-2xl sm:rounded-[2rem]"
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image gallery */}
          <div className="relative aspect-[16/9] overflow-hidden bg-muted sm:aspect-[2/1]">
            {allImages[currentImg] ? (
              <motion.img
                key={currentImg}
                src={allImages[currentImg]}
                alt={project.title}
                className="h-full w-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#242629] p-6 sm:p-9">
                <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(241,239,234,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(241,239,234,.08) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
                <div className="relative flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.22em] text-white/45">СКОЛ / АРХИВ ОБЪЕКТА</span>
                  <span className="font-mono text-xs text-white/55">01—03</span>
                </div>
                <div className="relative">
                  <div className="mb-3 h-px w-14 bg-[#b7838d]" />
                  <p className="max-w-sm font-display text-xl font-medium text-white/85 sm:text-2xl">Фотографии и видео объекта будут добавлены</p>
                </div>
                <div className="absolute -right-10 top-1/4 h-64 w-64 rounded-full border border-white/10" />
                <div className="absolute -right-2 top-1/3 h-40 w-40 rounded-full border border-[#b7838d]/35" />
              </div>
            )}

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Nav arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImg(i => (i - 1 + allImages.length) % allImages.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentImg(i => (i + 1) % allImages.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}

            {project.visualReference && <div className="absolute right-16 top-3 rounded-full border border-white/20 bg-black/45 px-3 py-2 text-[9px] uppercase tracking-[0.14em] text-white/90 backdrop-blur-md sm:right-20 sm:top-4">Визуальный референс · не фото объекта</div>}

            {/* Category badge */}
            <div className="absolute bottom-3 left-3">
              <span className="px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                {project.category}
              </span>
            </div>

            {/* Dots */}
            {allImages.length > 1 && (
              <div className="absolute bottom-3 right-3 flex gap-1.5">
                {allImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImg(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === currentImg ? "bg-white scale-110" : "bg-white/40"}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Case story */}
          <div className="relative grid gap-6 overflow-hidden p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-10 lg:p-10">
            <div aria-hidden="true" className="pointer-events-none absolute -right-8 bottom-0 h-44 w-44 rounded-full border border-rose-200/15" />
            <div className="relative">
              <p className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary"><span className="h-px w-6 bg-primary" />История объекта / кейс</p>
              <h2 className="font-display text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl">{project.title}</h2>
              <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">{project.description}</p>
              <div className="mt-6 border-l-2 border-primary/50 pl-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Контекст работы</p>
                <p className="mt-2 text-sm leading-6 text-foreground/85">Состав работ и последовательность действий зависят от состояния объекта, доступа к рабочей зоне и требований к следующему этапу.</p>
              </div>
            </div>
            <aside className="relative space-y-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Параметры объекта</p>
              {project.category && <div className="rounded-xl border border-border/60 bg-background/50 p-4"><span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Направление</span><p className="mt-1 text-sm font-semibold text-foreground">{project.category}</p></div>}
              {project.area && <div className="rounded-xl border border-border/60 bg-background/50 p-4"><div className="flex items-center gap-2 text-muted-foreground"><Ruler className="h-4 w-4 text-primary" /><span className="text-[10px] uppercase tracking-[0.12em]">Площадь</span></div><p className="mt-1 text-lg font-semibold text-foreground">{project.area}</p></div>}
              {project.duration && <div className="rounded-xl border border-border/60 bg-background/50 p-4"><div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4 text-primary" /><span className="text-[10px] uppercase tracking-[0.12em]">Срок</span></div><p className="mt-1 text-lg font-semibold text-foreground">{project.duration}</p></div>}
              <p className="pt-2 text-xs leading-5 text-muted-foreground">Дополнительные фото и документы показываются, если они добавлены в архив проекта.</p>
            </aside>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectDetailModal;
