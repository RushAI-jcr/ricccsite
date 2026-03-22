"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/config";

interface Metric {
  label: string;
  value: number;
  suffix?: string;
}

const metrics: Metric[] = [
  { label: "Publications", value: siteConfig.metrics.publications, suffix: "+" },
  { label: "Active Projects", value: siteConfig.metrics.activeProjects },
  { label: "Team Members", value: siteConfig.metrics.teamMembers },
  { label: "Founded", value: siteConfig.metrics.founded },
];

function AnimatedCounter({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  useEffect(() => {
    if (prefersReducedMotion.current) {
      // Skip to final value immediately — no animation needed
      requestAnimationFrame(() => setCount(target));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 1500;
          const start = performance.now();

          function animate(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          }

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export function MetricsBar() {
  return (
    <section className="bg-rush-teal text-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <div className="text-4xl lg:text-5xl font-bold mb-1">
                <AnimatedCounter
                  target={metric.value}
                  suffix={metric.suffix}
                />
              </div>
              <div className="text-white/70 text-sm uppercase tracking-wider">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
