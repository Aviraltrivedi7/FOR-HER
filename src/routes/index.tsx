import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Heart, Sparkles, Link2, Check, Copy, ArrowLeft, ArrowRight, Gem } from "lucide-react";
import { MusicPlayer } from "@/components/MusicPlayer";
import { RomanceBackdrop } from "@/components/RomanceBackdrop";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "for her — Craft a cinematic love card, free forever" },
      { name: "description", content: "Design a breathtaking proposal card for the one you love. Free, forever. No payment, just poetry." },
      { property: "og:title", content: "for her — Say it beautifully" },
      { property: "og:description", content: "A cinematic, free love card generator. Write, preview, share." },
    ],
  }),
  component: Index,
});

type CardData = {
  to: string;
  from: string;
  greeting: string;
  letter: string;
  song: string;
  question: string;
};

const DEFAULTS: CardData = {
  to: "",
  from: "",
  greeting: "You are my favourite feeling.",
  letter:
    "There are a thousand things I wanted to say — but every one of them starts with you.\n\nYou make the ordinary feel like a scene from a film. Thank you for being the softest part of my every day.\n\nYours, entirely.",
  song: "",
  question: "Will you be mine, forever?",
};

function encodeCard(data: CardData): string {
  const json = JSON.stringify(data);
  if (typeof window === "undefined") return "";
  return window.btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function Index() {
  const [data, setData] = useState<CardData>(DEFAULTS);
  const [step, setStep] = useState<"form" | "preview">("form");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof CardData>(k: K, v: CardData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const link = useMemo(() => {
    if (typeof window === "undefined") return "";
    if (!data.to.trim() || !data.from.trim()) return "";
    return `${window.location.origin}/c/${encodeCard(data)}`;
  }, [data]);

  const copy = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const goPreview = () => {
    if (!data.to.trim() || !data.from.trim()) {
      setError("Please fill in both names to preview.");
      return;
    }
    setError(null);
    setStep("preview");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <RomanceBackdrop />

      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 fill-primary text-primary" />
          <span className="font-display text-2xl tracking-wide">for her</span>
        </div>
        <span className="hidden text-xs uppercase tracking-[0.3em] text-muted-foreground sm:block">
          Free · Forever · No paywall
        </span>
      </header>

      {step === "form" ? (
        <>
          {/* Hero */}
          <section className="relative z-10 mx-auto max-w-3xl px-6 pt-6 pb-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-4 py-1.5 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs tracking-widest uppercase text-muted-foreground">
                A love letter, in cinema form
              </span>
            </div>
            <h1 className="mt-6 text-5xl leading-[1.05] sm:text-7xl">
              Say it in a way
              <br />
              <span className="font-script text-6xl text-gold sm:text-8xl">
                she'll never forget.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              Fill in the details, preview your card, then share a private link.
              Always free — no payment, no expiry.
            </p>
          </section>

          {/* Form */}
          <section className="relative z-10 mx-auto max-w-xl px-6 pb-24">
            <div className="rounded-3xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl sm:p-8">
              <div className="space-y-5">
                <Field label="Her name" required>
                  <input
                    value={data.to}
                    onChange={(e) => set("to", e.target.value)}
                    placeholder="e.g. Anaya"
                    className="input-field font-display text-xl"
                  />
                </Field>

                <Field label="From" required>
                  <input
                    value={data.from}
                    onChange={(e) => set("from", e.target.value)}
                    placeholder="e.g. Aarav"
                    className="input-field font-display text-xl"
                  />
                </Field>

                <Field label="One-line greeting">
                  <input
                    value={data.greeting}
                    onChange={(e) => set("greeting", e.target.value)}
                    maxLength={120}
                    className="input-field"
                  />
                </Field>

                <Field label="Your letter">
                  <textarea
                    value={data.letter}
                    onChange={(e) => set("letter", e.target.value)}
                    rows={8}
                    className="input-field resize-none leading-relaxed"
                  />
                </Field>

                <Field label="Song URL — optional">
                  <input
                    value={data.song}
                    onChange={(e) => set("song", e.target.value)}
                    placeholder="YouTube or Spotify link"
                    className="input-field"
                  />
                </Field>

                <Field label="The big question">
                  <input
                    value={data.question}
                    onChange={(e) => set("question", e.target.value)}
                    maxLength={120}
                    placeholder="Will you be mine?"
                    className="input-field font-display text-lg"
                  />
                </Field>

                {error && (
                  <p className="text-center text-sm text-primary">{error}</p>
                )}

                <button
                  onClick={goPreview}
                  className="group relative w-full overflow-hidden rounded-full bg-primary px-8 py-4 text-sm font-medium uppercase tracking-[0.25em] text-primary-foreground transition hover:brightness-110"
                  style={{ boxShadow: "var(--shadow-glow)" }}
                >
                  <span className="relative inline-flex items-center gap-3">
                    Preview my card
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </button>
              </div>
            </div>
          </section>
        </>
      ) : (
        /* Preview screen */
        <section className="relative z-10 mx-auto max-w-2xl px-6 pb-24">
          {data.song && <MusicPlayer url={data.song} autostart />}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => setStep("form")}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground backdrop-blur transition hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Edit
            </button>
            <span className="text-[11px] uppercase tracking-[0.3em] text-accent/80">
              Preview mode
            </span>
          </div>

          <p className="mb-4 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            This is how the card will look ✦
          </p>

          <CardPreview data={data} />

          {/* Share panel */}
          <div className="mt-8 rounded-3xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <Link2 className="h-3.5 w-3.5" /> Your shareable link
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex-1 truncate rounded-xl bg-background/70 px-4 py-3 font-mono text-xs text-foreground/80">
                {link}
              </div>
              <button
                onClick={copy}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-medium uppercase tracking-widest text-primary-foreground transition hover:brightness-110"
                style={{ boxShadow: "var(--shadow-glow)" }}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy link"}
              </button>
            </div>
            <p className="mt-4 text-center text-[11px] uppercase tracking-[0.3em] text-accent/80">
              ✦ Always free — hosted forever, no paywall ever
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`I made something just for you — ${link}`)}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-border/60 bg-background/40 px-4 py-2 text-muted-foreground transition hover:text-foreground"
              >
                Share on WhatsApp
              </a>
              <a
                href={link || undefined}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-border/60 bg-background/40 px-4 py-2 text-muted-foreground transition hover:text-foreground"
              >
                Open card
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/40 py-8 text-center text-xs text-muted-foreground">
        Made with <Heart className="inline h-3 w-3 fill-primary text-primary" /> — for the people who deserve the words.
      </footer>

      <style>{`
        .input-field {
          width: 100%;
          background: var(--input);
          border: 1px solid var(--border);
          color: var(--foreground);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          font-size: 0.95rem;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .input-field:focus {
          border-color: var(--ring);
          box-shadow: 0 0 0 3px oklch(0.72 0.18 15 / 20%);
        }
        .input-field::placeholder { color: oklch(0.6 0.03 25 / 60%); }
      `}</style>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {label} {required && <span className="text-primary">*</span>}
      </span>
      {children}
    </label>
  );
}

export function CardPreview({ data }: { data: CardData }) {
  const to = data.to.trim() || "Her Name";
  const from = data.from.trim() || "You";
  const question = data.question?.trim() || "Will you be mine, forever?";
  const [said, setSaid] = useState(false);
  const [dodges, setDodges] = useState(0);
  const noMsgs = ["hmm… try again 🙈", "are you sure? 🥺", "pretty please 💕", "one more chance 🌸", "it's really you 💖"];
  return (
    <div
      className="relative overflow-hidden rounded-3xl p-[1.5px]"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.92 0.10 340) 0%, oklch(0.72 0.20 350) 45%, oklch(0.55 0.18 355) 100%)",
        boxShadow: "var(--shadow-card), 0 0 60px oklch(0.78 0.20 350 / 25%)",
      }}
    >
     <div
       className="relative overflow-hidden rounded-[calc(1.5rem-1.5px)] p-8 sm:p-12"
       style={{
         background:
           "linear-gradient(160deg, oklch(0.24 0.07 350) 0%, oklch(0.15 0.04 350) 55%, oklch(0.10 0.02 350) 100%)",
       }}
     >
      {/* corner ornaments */}
      <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
        <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -bottom-20 -right-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="relative">
        <div className="mb-6 flex items-center justify-center gap-3 text-accent/80">
          <span className="h-px w-10 bg-current" />
          <span className="text-[10px] uppercase tracking-[0.4em]">For you</span>
          <span className="h-px w-10 bg-current" />
        </div>

        <h3 className="text-center font-script text-6xl leading-none text-gold sm:text-7xl">
          {to}
        </h3>

        <p className="mx-auto mt-6 max-w-md text-center font-display text-xl italic text-foreground/90 sm:text-2xl">
          “{data.greeting || "You are my favourite feeling."}”
        </p>

        <div className="my-8 flex items-center justify-center">
          <Heart className="h-5 w-5 fill-primary text-primary" />
        </div>

        <div className="mx-auto max-w-md whitespace-pre-line text-center font-display text-[15px] leading-relaxed text-foreground/80 sm:text-base">
          {data.letter || "Write something she'll remember forever…"}
        </div>

        <div className="mt-10 text-center">
          <div className="mx-auto mb-2 h-px w-16 bg-border" />
          <span className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            Yours,
          </span>
          <div className="mt-1 font-script text-3xl text-gold">{from}</div>
        </div>

        {/* The proposal moment */}
        <div className="mt-12 border-t border-border/40 pt-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-primary">
            <Gem className="h-3 w-3" /> One question
          </div>
          <p className="mx-auto max-w-md font-script text-4xl leading-tight text-gold sm:text-5xl">
            {question}
          </p>

          {said ? (
            <div className="mt-8 animate-fade-in">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary text-primary-foreground"
                   style={{ boxShadow: "var(--shadow-glow)", animation: "pulse-glow 1.6s ease-in-out infinite" }}>
                <Heart className="h-10 w-10 fill-current" />
              </div>
              <p className="mt-6 font-script text-5xl text-gold">She said YES 💍</p>
              <p className="mt-2 text-sm uppercase tracking-[0.35em] text-muted-foreground">
                {from} &nbsp;♥&nbsp; {to}
              </p>
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {Array.from({ length: 24 }).map((_, i) => (
                  <span
                    key={i}
                    className="absolute text-primary"
                    style={{
                      left: `${(i * 13) % 100}%`,
                      bottom: "-10%",
                      fontSize: `${14 + (i % 5) * 4}px`,
                      animation: `float-heart ${5 + (i % 4)}s linear ${(i * 0.2) % 3}s infinite`,
                    }}
                  >
                    ♥
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setSaid(true)}
                className="rounded-full bg-primary px-10 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-primary-foreground transition hover:brightness-110"
                style={{
                  boxShadow: "var(--shadow-glow)",
                  transform: `scale(${1 + Math.min(dodges, 6) * 0.09})`,
                  transition: "transform .35s ease",
                }}
              >
                Yes 💍
              </button>
              <button
                onClick={() => setDodges((n) => n + 1)}
                className="rounded-full border border-border/60 bg-card/40 px-6 py-3 text-xs uppercase tracking-[0.3em] text-muted-foreground backdrop-blur"
                style={{
                  transform: `translate(${Math.sin(dodges * 1.7) * dodges * 24}px, ${Math.cos(dodges * 1.9) * dodges * 18}px) rotate(${dodges * 6}deg)`,
                  opacity: Math.max(1 - dodges * 0.14, 0.15),
                  transition: "transform .3s ease, opacity .3s ease",
                  pointerEvents: dodges > 6 ? "none" : "auto",
                }}
              >
                No
              </button>
              {dodges > 0 && (
                <p className="w-full font-script text-2xl text-primary">
                  {noMsgs[Math.min(dodges - 1, noMsgs.length - 1)]}
                </p>
              )}
            </div>
          )}
        </div>

        {data.song && (
          <div className="mt-8 rounded-xl border border-border/50 bg-background/40 px-4 py-3 text-center text-xs text-muted-foreground">
            <span className="mr-2 uppercase tracking-widest text-accent/80">Our song</span>
            <a href={data.song} target="_blank" rel="noreferrer" className="truncate underline-offset-4 hover:underline">
              {data.song}
            </a>
          </div>
        )}
      </div>
     </div>
    </div>
  );
}
