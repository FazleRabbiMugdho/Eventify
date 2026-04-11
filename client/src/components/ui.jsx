import React, { useEffect, useRef, useState } from "react";

// ─── Global Animation Styles ──────────────────────────────────────────────────
// Inject once at app level via <AnimationStyles />

export function AnimationStyles() {
  return (
    <style>{`
      /* ── Fade + slide up ── */
      @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(28px) scale(0.98); }
        to   { opacity: 1; transform: translateY(0)    scale(1);    }
      }

      /* ── Fade in only ── */
      @keyframes fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }

      /* ── Slide in from right ── */
      @keyframes slideInRight {
        from { opacity: 0; transform: translateX(40px); }
        to   { opacity: 1; transform: translateX(0);    }
      }

      /* ── Slide in from left ── */
      @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-40px); }
        to   { opacity: 1; transform: translateX(0);     }
      }

      /* ── Scale pop ── */
      @keyframes scalePop {
        from { opacity: 0; transform: scale(0.88); }
        to   { opacity: 1; transform: scale(1);    }
      }

      /* ── Skeleton shimmer ── */
      @keyframes shimmer {
        0%   { background-position: -600px 0; }
        100% { background-position:  600px 0; }
      }

      /* ── Skeleton pulse ── */
      @keyframes skeletonPulse {
        0%, 100% { opacity: 1;   }
        50%      { opacity: 0.4; }
      }

      /* ── Count up blur ── */
      @keyframes countBlur {
        from { filter: blur(8px); opacity: 0; transform: translateY(12px); }
        to   { filter: blur(0);   opacity: 1; transform: translateY(0);    }
      }

      /* ── Utility classes ── */
      .anim-fade-slide-up   { animation: fadeSlideUp  0.55s cubic-bezier(0.22, 1, 0.36, 1) both; }
      .anim-fade-in         { animation: fadeIn       0.4s  ease both; }
      .anim-slide-right     { animation: slideInRight 0.5s  cubic-bezier(0.22, 1, 0.36, 1) both; }
      .anim-slide-left      { animation: slideInLeft  0.5s  cubic-bezier(0.22, 1, 0.36, 1) both; }
      .anim-scale-pop       { animation: scalePop     0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
      .anim-count           { animation: countBlur    0.5s  cubic-bezier(0.22, 1, 0.36, 1) both; }

      .skeleton-shimmer {
        background: linear-gradient(90deg,
          rgba(148,163,184,0.12) 0px,
          rgba(148,163,184,0.28) 200px,
          rgba(148,163,184,0.12) 400px
        );
        background-size: 600px 100%;
        animation: shimmer 1.6s linear infinite;
      }

      .skeleton-pulse {
        animation: skeletonPulse 1.8s ease-in-out infinite;
      }

      /* Respect reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .anim-fade-slide-up,
        .anim-fade-in,
        .anim-slide-right,
        .anim-slide-left,
        .anim-scale-pop,
        .anim-count {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
          filter: none !important;
        }
        .skeleton-shimmer {
          animation: skeletonPulse 1.8s ease-in-out infinite;
        }
      }
    `}</style>
  );
}

// ─── FadeIn ───────────────────────────────────────────────────────────────────

export function FadeIn({
  children,
  delay   = 0,
  className = "",
  style   = {},
}) {
  return (
    <div
      className={`anim-fade-slide-up ${className}`}
      style={{ animationDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
}

// ─── FadeInGroup ──────────────────────────────────────────────────────────────

export function FadeInGroup({ children, stagger = 80, baseDelay = 0, className = "" }) {
  return (
    <>
      {React.Children.map(children, (child, i) =>
        child ? (
          <div
            key={i}
            className={`anim-fade-slide-up ${className}`}
            style={{ animationDelay: `${baseDelay + i * stagger}ms` }}
          >
            {child}
          </div>
        ) : null
      )}
    </>
  );
}

// ─── SlideIn ──────────────────────────────────────────────────────────────────

export function SlideIn({ children, from = "right", delay = 0, className = "" }) {
  const cls = from === "left" ? "anim-slide-left" : "anim-slide-right";
  return (
    <div
      className={`${cls} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─── ScalePop ─────────────────────────────────────────────────────────────────

export function ScalePop({ children, delay = 0, className = "" }) {
  return (
    <div
      className={`anim-scale-pop ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─── PageTransition ───────────────────────────────────────────────────────────

export function PageTransition({ children, className = "" }) {
  return (
    <div
      className={`anim-fade-in ${className}`}
      style={{ animationDuration: "0.35s" }}
    >
      {children}
    </div>
  );
}

// ─── CountUp ─────────────────────────────────────────────────────────────────

export function CountUp({
  value,
  duration  = 1400,
  delay     = 0,
  className = "",
}) {
  const [display,  setDisplay]  = useState("0");
  const [animated, setAnimated] = useState(false);
  const ref        = useRef(null);
  const rafRef     = useRef(null);
  const startRef   = useRef(null);

  const parse = (v) => {
    const str    = String(v).replace(/,/g, "");
    const prefix = str.match(/^[^\d.-]*/)?.[0]  || "";
    const suffix = str.match(/[^\d.]+$/)?.[0]   || "";
    const num    = parseFloat(str.replace(/[^\d.-]/g, "")) || 0;
    return { prefix, suffix, num };
  };

  const format = (num, prefix, suffix) => {
    const isInt = Number.isInteger(parseFloat(String(value).replace(/[^\d.-]/g, "")));
    const n     = isInt ? Math.round(num) : parseFloat(num.toFixed(1));
    return `${prefix}${n.toLocaleString()}${suffix}`;
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated) {
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animated]);

  useEffect(() => {
    if (!animated) return;
    const { prefix, suffix, num } = parse(value);
    const timeout = setTimeout(() => {
      const animate = (timestamp) => {
        if (!startRef.current) startRef.current = timestamp;
        const elapsed  = timestamp - startRef.current;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        setDisplay(format(eased * num, prefix, suffix));
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          setDisplay(format(num, prefix, suffix));
        }
      };
      rafRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
    };
  }, [animated, value, duration, delay]);

  return (
    <span
      ref={ref}
      className={`anim-count inline-block ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {display || "0"}
    </span>
  );
}

// ─── Skeleton Base ────────────────────────────────────────────────────────────

function SkeletonBox({ className = "", rounded = "rounded-2xl" }) {
  return (
    <div className={`skeleton-shimmer ${rounded} ${className}`} />
  );
}

// ─── SkeletonEventCard ────────────────────────────────────────────────────────

export function SkeletonEventCard({ darkMode }) {
  return (
    <div
      className={`
        rounded-[40px] sm:rounded-[48px] p-4 sm:p-5 skeleton-pulse
        ${darkMode ? "bg-[#1E0B3B]" : "bg-white border border-slate-100"}
      `}
    >
      <SkeletonBox
        className={`w-full h-48 sm:h-72 mb-5 sm:mb-8 ${darkMode ? "bg-white/5" : "bg-slate-100"}`}
        rounded="rounded-[28px] sm:rounded-[36px]"
      />
      <div className="px-2 sm:px-4 pb-2 sm:pb-4 space-y-4">
        <SkeletonBox className={`h-6 w-20 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-xl" />
        <SkeletonBox className={`h-5 w-4/5 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-lg" />
        <SkeletonBox className={`h-5 w-3/5 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-lg" />
        <div className={`flex justify-between pt-4 border-t-2 ${darkMode ? "border-white/5" : "border-slate-50"}`}>
          <SkeletonBox className={`h-4 w-24 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-md" />
          <SkeletonBox className={`h-4 w-16 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-md" />
        </div>
      </div>
    </div>
  );
}

// ─── SkeletonStatCard ─────────────────────────────────────────────────────────

export function SkeletonStatCard({ darkMode, gradient = false }) {
  return (
    <div
      className={`
        p-5 sm:p-8 rounded-[28px] sm:rounded-[40px] skeleton-pulse
        ${gradient
          ? darkMode ? "bg-indigo-900/40" : "bg-indigo-100"
          : darkMode ? "bg-[#1E0B3B]"    : "bg-white border border-slate-100"
        }
      `}
    >
      <SkeletonBox className={`w-10 h-10 sm:w-14 sm:h-14 mb-4 sm:mb-6 ${darkMode ? "bg-white/10" : "bg-slate-100"}`} rounded="rounded-xl sm:rounded-2xl" />
      <SkeletonBox className={`h-3 w-20 mb-2 ${darkMode ? "bg-white/10" : "bg-slate-100"}`} rounded="rounded-md" />
      <SkeletonBox className={`h-8 sm:h-10 w-24 ${darkMode ? "bg-white/10" : "bg-slate-100"}`} rounded="rounded-lg" />
    </div>
  );
}

// ─── SkeletonHostedCard ───────────────────────────────────────────────────────

export function SkeletonHostedCard({ darkMode }) {
  return (
    <div
      className={`
        rounded-[36px] sm:rounded-[48px] overflow-hidden skeleton-pulse
        ${darkMode ? "bg-[#1E0B3B]" : "bg-white border border-slate-100"}
      `}
    >
      <SkeletonBox className={`w-full h-44 sm:h-64 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-none" />
      <div className="p-5 sm:p-10 space-y-4">
        <SkeletonBox className={`h-5 w-3/4 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-lg" />
        <SkeletonBox className={`h-4 w-1/2 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-md" />
        <SkeletonBox className={`h-4 w-1/3 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-md" />
        <div className={`pt-5 border-t flex items-center justify-between ${darkMode ? "border-white/5" : "border-slate-50"}`}>
          <div className="space-y-2">
            <SkeletonBox className={`h-3 w-16 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-md" />
            <SkeletonBox className={`h-6 w-24 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-lg" />
          </div>
          <SkeletonBox className={`h-8 w-8 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// ─── SkeletonProfileCard ──────────────────────────────────────────────────────

export function SkeletonProfileCard({ darkMode }) {
  return (
    <div className="bg-gradient-to-br from-indigo-600/60 to-violet-700/60 rounded-[32px] sm:rounded-[45px] p-7 sm:p-10 skeleton-pulse">
      <div className="flex flex-col items-center">
        <SkeletonBox className={`w-24 h-24 sm:w-32 sm:h-32 mb-5 ${darkMode ? "bg-white/10" : "bg-white/20"}`} rounded="rounded-full" />
        <SkeletonBox className={`h-6 w-32 mb-2 ${darkMode ? "bg-white/10" : "bg-white/20"}`} rounded="rounded-lg" />
        <SkeletonBox className={`h-4 w-24 mb-8 ${darkMode ? "bg-white/10" : "bg-white/20"}`} rounded="rounded-md" />
        <div className="grid grid-cols-3 gap-3 w-full mb-7">
          {[1, 2, 3].map((i) => (
            <SkeletonBox key={i} className={`h-14 ${darkMode ? "bg-white/10" : "bg-white/20"}`} rounded="rounded-xl" />
          ))}
        </div>
        <SkeletonBox className={`h-12 w-full ${darkMode ? "bg-white/10" : "bg-white/20"}`} rounded="rounded-xl" />
      </div>
    </div>
  );
}

// ─── SkeletonInfoSection ──────────────────────────────────────────────────────

export function SkeletonInfoSection({ darkMode, rows = 2 }) {
  return (
    <div
      className={`
        p-5 sm:p-10 rounded-[28px] sm:rounded-[40px] skeleton-pulse
        ${darkMode ? "bg-[#1E0B3B]" : "bg-white border border-slate-100"}
      `}
    >
      <SkeletonBox className={`h-5 w-40 mb-6 sm:mb-8 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-lg" />
      <div className="space-y-5">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <SkeletonBox className={`w-11 h-11 sm:w-14 sm:h-14 shrink-0 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-xl sm:rounded-2xl" />
            <div className="flex-1 space-y-2">
              <SkeletonBox className={`h-3 w-20 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-md" />
              <SkeletonBox className={`h-4 w-40 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SkeletonEventDetail ──────────────────────────────────────────────────────
// Mimics EventDetails page layout (hero image + about + booking card)

export function SkeletonEventDetail({ darkMode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">

      {/* Left column */}
      <div className="lg:col-span-8 space-y-5 sm:space-y-8">

        {/* Hero image */}
        <SkeletonBox
          className={`w-full h-[220px] sm:h-[320px] lg:h-[420px] skeleton-pulse ${darkMode ? "bg-white/5" : "bg-slate-100"}`}
          rounded="rounded-[24px] sm:rounded-[32px]"
        />

        {/* Title + About */}
        <div className="space-y-4 skeleton-pulse">
          <SkeletonBox className={`h-8 w-3/4 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-xl" />
          <SkeletonBox className={`h-6 w-1/2 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-lg" />

          {/* About card */}
          <div className={`p-5 sm:p-7 rounded-[20px] sm:rounded-[24px] space-y-3 ${darkMode ? "bg-[#1E0B3B]" : "bg-white border border-slate-100"}`}>
            <SkeletonBox className={`h-5 w-40 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-lg" />
            <SkeletonBox className={`h-4 w-full ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-md" />
            <SkeletonBox className={`h-4 w-full ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-md" />
            <SkeletonBox className={`h-4 w-2/3 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-md" />
          </div>
        </div>
      </div>

      {/* Right column — booking card */}
      <div className="lg:col-span-4">
        <div className={`p-5 sm:p-7 rounded-[22px] sm:rounded-[28px] space-y-5 skeleton-pulse ${darkMode ? "bg-[#1E0B3B]" : "bg-white border border-slate-100 shadow-md"}`}>
          <SkeletonBox className={`h-4 w-24 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-md" />
          <SkeletonBox className={`h-10 w-36 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-xl" />
          <div className={`h-px ${darkMode ? "bg-white/5" : "bg-slate-100"}`} />
          <SkeletonBox className={`h-4 w-28 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-md" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <SkeletonBox className={`w-9 h-9 sm:w-10 sm:h-10 shrink-0 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-xl" />
              <div className="flex-1 space-y-1.5">
                <SkeletonBox className={`h-3 w-16 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-md" />
                <SkeletonBox className={`h-4 w-32 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-md" />
              </div>
            </div>
          ))}
          <div className={`h-px ${darkMode ? "bg-white/5" : "bg-slate-100"}`} />
          <SkeletonBox className={`h-12 w-full ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-xl sm:rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

// ─── SkeletonCreateEvent ──────────────────────────────────────────────────────
// Mimics CreateEvent page layout (AI widget + image upload + form fields)

export function SkeletonCreateEvent({ darkMode }) {
  return (
    <div className="space-y-8 sm:space-y-10 skeleton-pulse">

      {/* AI Magic widget */}
      <div className={`rounded-[32px] p-6 sm:p-8 ${darkMode ? "bg-[#1E0B3B]" : "bg-white border border-slate-100"}`}>
        <div className="flex gap-6 items-center">
          <SkeletonBox className={`w-14 h-14 shrink-0 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-2xl" />
          <div className="flex-1 space-y-3">
            <SkeletonBox className={`h-5 w-40 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-lg" />
            <SkeletonBox className={`h-4 w-full ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-md" />
            <div className="flex gap-3">
              <SkeletonBox className={`h-11 flex-1 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-xl" />
              <SkeletonBox className={`h-11 w-32 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Cover image upload */}
      <div className={`p-5 sm:p-10 rounded-[32px] sm:rounded-[48px] ${darkMode ? "bg-[#1E0B3B]" : "bg-white border border-slate-50"}`}>
        <SkeletonBox className={`h-4 w-28 mb-4 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-md" />
        <SkeletonBox
          className={`w-full h-[200px] sm:h-[300px] lg:h-[400px] ${darkMode ? "bg-white/5" : "bg-slate-100"}`}
          rounded="rounded-[24px] sm:rounded-[36px]"
        />
      </div>

      {/* Core details form */}
      <div className={`p-5 sm:p-12 rounded-[32px] sm:rounded-[56px] ${darkMode ? "bg-[#1E0B3B]" : "bg-white border border-slate-50"}`}>
        <SkeletonBox className={`h-7 w-48 mb-8 sm:mb-12 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
          <div className="sm:col-span-2 space-y-2">
            <SkeletonBox className={`h-3 w-24 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-md" />
            <SkeletonBox className={`h-14 w-full ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-xl sm:rounded-2xl" />
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <SkeletonBox className={`h-3 w-20 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-md" />
              <SkeletonBox className={`h-14 w-full ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-xl sm:rounded-2xl" />
            </div>
          ))}
          <div className="sm:col-span-2 space-y-2">
            <SkeletonBox className={`h-3 w-32 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-md" />
            <SkeletonBox className={`h-36 w-full ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-xl sm:rounded-2xl" />
          </div>
        </div>
        <div className={`flex gap-4 mt-10 pt-8 border-t ${darkMode ? "border-white/5" : "border-slate-100"}`}>
          <SkeletonBox className={`h-14 flex-1 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-[22px] sm:rounded-[28px]" />
          <SkeletonBox className={`h-14 flex-1 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-[22px] sm:rounded-[28px]" />
        </div>
      </div>
    </div>
  );
}

// ─── SkeletonCarousel ─────────────────────────────────────────────────────────

export function SkeletonCarousel({ darkMode }) {
  return (
    <div className="mb-10 sm:mb-16 skeleton-pulse">
      <div className="flex items-center justify-between mb-4">
        <SkeletonBox className={`h-8 w-48 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-xl" />
        <div className="hidden sm:flex gap-3">
          <SkeletonBox className={`w-10 h-10 sm:w-12 sm:h-12 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-xl sm:rounded-2xl" />
          <SkeletonBox className={`w-10 h-10 sm:w-12 sm:h-12 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} rounded="rounded-xl sm:rounded-2xl" />
        </div>
      </div>
      <SkeletonBox
        className={`w-full h-[280px] sm:h-[380px] lg:h-[480px] ${darkMode ? "bg-white/5" : "bg-slate-100"}`}
        rounded="rounded-[32px] sm:rounded-[40px] lg:rounded-[50px]"
      />
    </div>
  );
}

// ─── SkeletonEventGrid ────────────────────────────────────────────────────────

export function SkeletonEventGrid({ darkMode, count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-12">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonEventCard key={i} darkMode={darkMode} />
      ))}
    </div>
  );
}

// ─── usePageLoad ──────────────────────────────────────────────────────────────

export function usePageLoad(delay = 600) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return loaded;
}

// ─── useInView ────────────────────────────────────────────────────────────────

export function useInView(threshold = 0.15) {
  const ref    = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

// ─── InViewFade ───────────────────────────────────────────────────────────────

export function InViewFade({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${className}`}
      style={{
        opacity:   inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}