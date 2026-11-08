import { useEffect, useRef, useState, type ReactNode } from "react";

type DeferredSectionProps = {
  children: ReactNode;
  minHeight: string;
  rootMargin?: string;
};

/**
 * Mounts below-the-fold content before it enters the viewport.
 * The reserved space prevents the document from collapsing while the
 * component's lazy chunk is being downloaded.
 */
const DeferredSection = ({
  children,
  minHeight,
  rootMargin = "1000px 0px",
}: DeferredSectionProps) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    if (!("IntersectionObserver" in window)) {
      setReady(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setReady(true);
        observer.disconnect();
      },
      { rootMargin, threshold: 0 },
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={hostRef} style={ready ? undefined : { minHeight }} data-deferred-section>
      {ready ? children : null}
    </div>
  );
};

export default DeferredSection;
