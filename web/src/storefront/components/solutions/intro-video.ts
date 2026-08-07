/** Resolve YouTube / Vimeo / direct embed URLs for Solutions intro video. */

export function toVideoEmbedUrl(raw: string | undefined | null): string | null {
  const input = raw?.trim();
  if (!input) return null;

  try {
    const url = new URL(input);

    // Already embed
    if (
      url.hostname.includes("youtube.com") &&
      url.pathname.startsWith("/embed/")
    ) {
      return url.toString();
    }

    // youtu.be/<id>
    if (url.hostname === "youtu.be") {
      const id = url.pathname.replace(/^\//, "").split("/")[0];
      if (id) return `https://www.youtube.com/embed/${id}?rel=0`;
    }

    // youtube.com/watch?v=<id>
    if (url.hostname.includes("youtube.com")) {
      const id = url.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}?rel=0`;
      const shorts = url.pathname.match(/^\/shorts\/([^/]+)/);
      if (shorts?.[1]) return `https://www.youtube.com/embed/${shorts[1]}?rel=0`;
    }

    // vimeo.com/<id>
    if (url.hostname.includes("vimeo.com")) {
      const id = url.pathname.split("/").filter(Boolean).pop();
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
    }

    // Direct .mp4 / known embed hosts — use as-is in iframe/video
    if (/\.(mp4|webm)(\?|$)/i.test(url.pathname) || url.hostname.includes("player.")) {
      return url.toString();
    }
  } catch {
    return null;
  }

  return null;
}
