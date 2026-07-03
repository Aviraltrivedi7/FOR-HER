import { useEffect, useRef, useState } from "react";
import { Music, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { parseSong } from "@/lib/song";

export function MusicPlayer({
  url,
  autostart = true,
}: {
  url: string;
  autostart?: boolean;
}) {
  const song = parseSong(url);
  const [playing, setPlaying] = useState(autostart);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    setPlaying(autostart);
  }, [url, autostart]);

  // Direct audio control
  useEffect(() => {
    if (!song || song.kind !== "audio" || !audioRef.current) return;
    audioRef.current.muted = muted;
    if (playing) {
      audioRef.current.play().catch(() => setPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [playing, muted, song]);

  // YouTube postMessage control
  const ytCommand = (fn: string, args: unknown[] = []) => {
    if (!iframeRef.current || !song || song.kind !== "youtube") return;
    iframeRef.current.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: fn, args }),
      "*",
    );
  };

  useEffect(() => {
    if (!song || song.kind !== "youtube") return;
    ytCommand(playing ? "playVideo" : "pauseVideo");
    ytCommand(muted ? "mute" : "unMute");
  }, [playing, muted, song]);

  if (!song) return null;

  const ytSrc =
    song.kind === "youtube"
      ? song.src + "&enablejsapi=1" + (muted ? "&mute=1" : "")
      : "";

  return (
    <>
      {/* Hidden media */}
      {song.kind === "youtube" && (
        <iframe
          ref={iframeRef}
          key={song.id + (autostart ? "-a" : "")}
          src={ytSrc}
          allow="autoplay; encrypted-media"
          className="pointer-events-none absolute h-px w-px opacity-0"
          title="Background music"
        />
      )}
      {song.kind === "audio" && (
        <audio ref={audioRef} src={song.src} loop autoPlay={autostart} />
      )}
      {song.kind === "spotify" && (
        // Spotify requires the visible embed to autoplay reliably
        <div className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-md rounded-2xl border border-border/60 bg-card/80 p-2 backdrop-blur-xl">
          <iframe
            src={song.src}
            className="h-20 w-full rounded-xl"
            allow="autoplay; encrypted-media"
            title="Spotify player"
          />
        </div>
      )}

      {/* Floating control (for YT / audio) */}
      {song.kind !== "spotify" && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-border/60 bg-card/80 py-2 pl-3 pr-2 shadow-lg backdrop-blur-xl">
          <Music className="h-3.5 w-3.5 text-accent" />
          <span className="hidden text-[11px] uppercase tracking-widest text-muted-foreground sm:inline">
            Our song
          </span>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:brightness-110"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={() => setMuted((m) => !m)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-foreground transition hover:brightness-110"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      )}
    </>
  );
}