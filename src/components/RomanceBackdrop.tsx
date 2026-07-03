import { useMemo } from "react";

/**
 * Cinematic proposal atmosphere: soft rose glow orbs, drifting petals,
 * floating hearts, and twinkling sparkles. Purely decorative.
 */
export function RomanceBackdrop() {
  const petals = useMemo(() => Array.from({ length: 14 }), []);
  const hearts = useMemo(() => Array.from({ length: 10 }), []);
  const sparkles = useMemo(() => Array.from({ length: 26 }), []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Soft rose glow orbs */}
      <div
        className="absolute -left-24 top-10 h-[38rem] w-[38rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.62 0.20 15 / 35%) 0%, transparent 65%)",
          animation: "drift-glow 16s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -right-32 top-1/3 h-[34rem] w-[34rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.66 0.16 350 / 30%) 0%, transparent 65%)",
          animation: "drift-glow 22s ease-in-out -6s infinite",
        }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[30rem] w-[30rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.72 0.14 40 / 22%) 0%, transparent 60%)",
          animation: "drift-glow 26s ease-in-out -12s infinite",
        }}
      />

      {/* Falling rose petals */}
      {petals.map((_, i) => {
        const left = (i * 7.9) % 100;
        const delay = (i * 1.4) % 14;
        const duration = 14 + ((i * 3) % 10);
        const size = 14 + ((i * 5) % 18);
        return (
          <span
            key={`p-${i}`}
            className="absolute select-none"
            style={{
              left: `${left}%`,
              top: 0,
              fontSize: `${size}px`,
              animation: `petal-fall ${duration}s linear ${delay}s infinite`,
              filter: "drop-shadow(0 0 6px oklch(0.72 0.18 15 / 40%))",
            }}
          >
            🌹
          </span>
        );
      })}

      {/* Rising hearts */}
      {hearts.map((_, i) => {
        const left = (i * 11.3) % 100;
        const delay = (i * 1.9) % 12;
        const duration = 16 + ((i * 3) % 10);
        const size = 12 + ((i * 4) % 16);
        return (
          <span
            key={`h-${i}`}
            className="absolute text-primary/60"
            style={{
              left: `${left}%`,
              bottom: `-10vh`,
              fontSize: `${size}px`,
              animation: `float-heart ${duration}s linear ${delay}s infinite`,
              filter: "drop-shadow(0 0 8px oklch(0.72 0.18 15 / 60%))",
            }}
          >
            ♥
          </span>
        );
      })}

      {/* Twinkling sparkles */}
      {sparkles.map((_, i) => {
        const left = (i * 3.7) % 100;
        const top = (i * 6.1) % 100;
        const delay = (i * 0.4) % 5;
        const duration = 2 + ((i * 0.3) % 3);
        return (
          <span
            key={`s-${i}`}
            className="absolute h-1 w-1 rounded-full bg-accent"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              boxShadow: "0 0 8px 2px oklch(0.85 0.12 80 / 70%)",
              animation: `twinkle ${duration}s ease-in-out ${delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}