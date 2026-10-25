import { forwardRef, ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedSection = forwardRef<HTMLDivElement, AnimatedSectionProps>(
  ({ children, className = "" }, ref) => (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
);

AnimatedSection.displayName = "AnimatedSection";

export default AnimatedSection;
