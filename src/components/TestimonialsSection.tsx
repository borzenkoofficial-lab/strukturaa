import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const testimonials = [
  {
    name: "Алексей Петров",
    role: "Владелец ООО «СтройИнвест»",
    text: "STRUKTURA выполнила демонтаж старого здания за 3 дня. Профессионально, чисто, без лишнего шума. Рекомендую!",
    rating: 5,
  },
  {
    name: "Мария Козлова",
    role: "Главный инженер, ГК «Развитие»",
    text: "Работаем с командой уже 5 лет. Каждый проект — как по часам. Качество неизменно на высоте.",
    rating: 5,
  },
  {
    name: "Дмитрий Сидоров",
    role: "Частный заказчик",
    text: "Заказывал капитальный ремонт квартиры. Сдали в срок, бюджет не превысили. Очень доволен результатом!",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <AnimatedSection>
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">Отзывы клиентов</h2>
        <p className="text-muted-foreground mb-10">Что говорят те, кто уже работал с нами</p>
      </AnimatedSection>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {testimonials.map((t, i) => (
          <AnimatedSection key={t.name} delay={i * 0.15}>
            <motion.div
              className="glass-card-hover p-6 h-full flex flex-col justify-between relative overflow-hidden group"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-12 h-12 text-primary" />
              </div>
              <div>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">{t.text}</p>
              </div>
              <div className="mt-5 pt-4 border-t border-border/30">
                <p className="text-sm font-display font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t.role}</p>
              </div>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
