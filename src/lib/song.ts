export type SongEmbed =
  | { kind: "youtube"; id: string; src: string }
  | { kind: "spotify"; src: string }
  | { kind: "audio"; src: string }
  | null;

export function parseSong(raw: string): SongEmbed {
  const url = raw.trim();
  if (!url) return null;

  // YouTube
  const yt =
    url.match(/youtu\.be\/([\w-]{6,})/) ||
    url.match(/youtube\.com\/watch\?[^#]*v=([\w-]{6,})/) ||
    url.match(/youtube\.com\/embed\/([\w-]{6,})/) ||
    url.match(/youtube\.com\/shorts\/([\w-]{6,})/);
  if (yt) {
    const id = yt[1];
    const src = `https://www.youtube.com/embed/${id}?autoplay=1&loop=1&playlist=${id}&controls=0&modestbranding=1&rel=0&playsinline=1`;
    return { kind: "youtube", id, src };
  }

  // Spotify
  const sp = url.match(/open\.spotify\.com\/(track|album|playlist|episode)\/([\w]+)/);
  if (sp) {
    return { kind: "spotify", src: `https://open.spotify.com/embed/${sp[1]}/${sp[2]}?utm_source=generator&autoplay=1` };
  }

  // Direct audio file
  if (/\.(mp3|ogg|wav|m4a)(\?.*)?$/i.test(url)) {
    return { kind: "audio", src: url };
  }

  return null;
}