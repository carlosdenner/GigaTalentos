export function getYouTubeEmbedUrl(url: string): string {
  try {
    const videoId = url.match(
      /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^"&?\/\s]{11})/
    )?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  } catch (error) {
    console.error("Error parsing YouTube URL:", error);
    return "";
  }
}
