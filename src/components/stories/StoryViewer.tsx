import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Story {
  id: string;
  title: string;
  image_url: string;
  overlay_text: string | null;
  cta_label: string | null;
  cta_link: string | null;
}

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}

const STORY_DURATION = 5000;

const StoryViewer = ({ stories, initialIndex, onClose }: StoryViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const pausedProgressRef = useRef<number>(0);
  const navigate = useNavigate();

  const story = stories[currentIndex];

  const goNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((i) => i + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  // Animate progress
  useEffect(() => {
    if (isPaused) return;

    startTimeRef.current = performance.now();
    pausedProgressRef.current = progress;
    const remaining = STORY_DURATION * (1 - pausedProgressRef.current);

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const newProgress = pausedProgressRef.current + elapsed / STORY_DURATION;
      if (newProgress >= 1) {
        goNext();
        return;
      }
      setProgress(newProgress);
      timerRef.current = requestAnimationFrame(animate);
    };

    timerRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(timerRef.current);
  }, [currentIndex, isPaused, goNext]);

  // Reset progress on index change
  useEffect(() => {
    setProgress(0);
    pausedProgressRef.current = 0;
  }, [currentIndex]);

  // Keyboard
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, goNext, goPrev]);

  const handleTap = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 3) goPrev();
    else goNext();
  };

  const handleCta = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (story.cta_link) {
      if (story.cta_link.startsWith("http")) {
        window.open(story.cta_link, "_blank");
      } else {
        navigate(story.cta_link);
        onClose();
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-[420px] h-[85vh] max-h-[750px] rounded-2xl overflow-hidden bg-card"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => {
            e.stopPropagation();
            handleTap(e);
          }}
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Progress bars */}
          <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2 px-3">
            {stories.map((_, i) => (
              <div key={i} className="flex-1 h-[3px] rounded-full bg-white/20 overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  style={{
                    width:
                      i < currentIndex
                        ? "100%"
                        : i === currentIndex
                        ? `${progress * 100}%`
                        : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Close */}
          <button
            className="absolute top-6 right-3 z-30 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <X className="w-4 h-4 text-white" />
          </button>

          {/* Image */}
          <AnimatePresence mode="wait">
            <motion.img
              key={story.id}
              src={story.image_url}
              alt={story.title}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 z-10" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 z-20 p-5 pb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-white text-lg font-display font-bold mb-1">
                  {story.title}
                </h3>
                {story.overlay_text && (
                  <p className="text-white/80 text-sm mb-4 line-clamp-3">
                    {story.overlay_text}
                  </p>
                )}
                {story.cta_label && story.cta_link && (
                  <motion.button
                    className="w-full py-3 rounded-xl bg-white text-black font-semibold text-sm flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCta}
                  >
                    {story.cta_label}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </motion.button>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation arrows (desktop) */}
          {currentIndex > 0 && (
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm items-center justify-center hidden sm:flex"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
          )}
          {currentIndex < stories.length - 1 && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm items-center justify-center hidden sm:flex"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StoryViewer;
