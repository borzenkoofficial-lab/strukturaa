import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Clock, Ruler, ArrowLeft, ArrowRight } from "lucide-react";
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
  };
  onClose: () => void;
}

const ProjectDetailModal = ({ project, onClose }: ProjectDetailProps) => {
  const allImages = [project.image, ...(project.gallery || [])];
  const [currentImg, setCurrentImg] = useState(0);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-card rounded-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border/30"
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image gallery */}
          <div className="relative aspect-[16/9] bg-muted">
            {allImages[currentImg] ? (
              <motion.img
                key={currentImg}
                src={allImages[currentImg]}
                alt={project.title}
                className="w-full h-full object-cover"
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

          {/* Content */}
          <div className="p-6 space-y-4">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
              {project.title}
            </h2>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-primary" />
                <span>Площадь: <strong className="text-foreground">{project.area}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                <span>Срок: <strong className="text-foreground">{project.duration}</strong></span>
              </div>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed">
              {project.description}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectDetailModal;
