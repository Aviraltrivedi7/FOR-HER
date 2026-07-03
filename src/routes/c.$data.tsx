import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, ArrowLeft, Sparkles } from "lucide-react";
import { CardPreview } from "./index";
import { MusicPlayer } from "@/components/MusicPlayer";
import { RomanceBackdrop } from "@/components/RomanceBackdrop";

type CardData = {
  to: string;
  from: string;
  greeting: string;
  letter: string;
  song: string;
  question: string;
};

function decodeCard(encoded: string): CardData | null {
  try {
    const b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4 ? "=".repeat(4 - (b64.length % 4)) : "";
    const json = decodeURIComponent(escape(atob(b64 + pad)));
    const obj = JSON.parse(json);
    if (typeof obj !== "object" || obj === null) return null;
    return {
      to: String(obj.to ?? ""),
      from: String(obj.from ?? ""),
      greeting: String(obj.greeting ?? ""),
      letter: String(obj.letter ?? ""),
      song: String(obj.song ?? ""),
      question: String(obj.question ?? "Will you be mine, forever?"),
    };
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/c/$data")({
  head: ({ params }) => {
    const decoded = typeof atob !== "undefined" ? decodeCard(params.data) : null;
    const to = decoded?.to?.trim() || "Someone special";
    const from = decoded?.from?.trim() || "";
    const title = `A love letter for ${to}`;
    const desc = from ? `${from} wrote something just for you. Open it.` : "Someone wrote something just for you.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  loader: ({ params }) => {
    const data = decodeCard(params.data);
    if (!data) throw notFound();
    return { data };
  },
  component: CardPage,
});

function CardPage() {
  const { data } = Route.useLoaderData();
  const [opened, setOpened] = useState(false);
  const [started, setStarted] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const noMessages = ["Are you sure? 🥺", "Pretty please? 💕", "Just one peek? 🌸", "It's really for you… 💖"];

  useEffect(() => {
    const t = setTimeout(() => setOpened(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Intro overlay — cute yes/no reveal (also unlocks audio autoplay) */}
      {!started && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-background/95 px-6 backdrop-blur-md">
          <RomanceBackdrop />
          <div className="relative z-[110] flex flex-col items-center text-center">
            <div
              className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground"
              style={{
                boxShadow: "var(--shadow-glow)",
                animation: "pulse-glow 2.4s ease-in-out infinite",
              }}
            >
              <Heart className="h-8 w-8 fill-current" />
            </div>
            <p className="font-script text-5xl text-gold sm:text-6xl">Hey love</p>
            <p className="mt-6 max-w-sm font-display text-xl leading-relaxed text-foreground/90 sm:text-2xl">
              I made something just for you,{" "}
              <span className="ml-1 font-script text-3xl text-gold sm:text-4xl">
                {data.to || "you"}
              </span>
              <br />
              <span className="text-foreground/70">— want to see it?</span>
            </p>

            {noCount > 0 && (
              <p className="mt-4 font-script text-2xl text-primary">
                {noMessages[Math.min(noCount - 1, noMessages.length - 1)]}
              </p>
            )}

            <div className="relative z-[120] mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setStarted(true)}
                className="cursor-pointer rounded-full bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary-foreground transition hover:brightness-110 active:scale-95"
                style={{
                  boxShadow: "var(--shadow-glow)",
                  transform: `scale(${1 + Math.min(noCount, 6) * 0.08})`,
                }}
              >
                Yes please
              </button>
              <button
                type="button"
                onClick={() => setNoCount((n) => n + 1)}
                className="cursor-pointer rounded-full border border-border/60 bg-card/40 px-6 py-3 text-xs uppercase tracking-[0.25em] text-muted-foreground backdrop-blur transition hover:text-foreground"
                style={{
                  transform: `translate(${Math.sin(noCount * 1.7) * Math.min(noCount, 6) * 30}px, ${Math.cos(noCount * 1.9) * Math.min(noCount, 6) * 18}px)`,
                  opacity: Math.max(1 - noCount * 0.14, 0.2),
                  pointerEvents: noCount > 6 ? "none" : "auto",
                }}
              >
                No thanks
              </button>
            </div>
          </div>
        </div>
      )}

      {data.song && started && <MusicPlayer url={data.song} autostart />}

      <RomanceBackdrop />

      <div className="relative z-10 mx-auto max-w-2xl px-6 py-16">
        <div
          className={`text-center transition-all duration-1000 ${opened ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              A private letter
            </span>
          </div>
          <h1 className="mt-6 font-script text-5xl text-gold sm:text-6xl">
            Dear {data.to || "you"},
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Take a breath. Read slowly.</p>
        </div>

        <div
          className={`mt-10 transition-all duration-1000 delay-300 ${opened ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <CardPreview data={data} />
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground transition hover:text-foreground"
          >
            <Heart className="h-3 w-3 fill-primary text-primary" />
            Make one of your own
            <ArrowLeft className="h-3 w-3 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}