// Helper function to convert YouTube URLs to embed format
export function getYouTubeEmbedUrl(url: string) {
  if (!url) return '';
  
  // If it's already an embed URL, return it
  if (url.includes('youtube.com/embed/')) {
    return url;
  }
  
  // Extract video ID from various YouTube URL formats
  let videoId = '';
  
  // Match format: youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/youtube\.com\/watch\?v=([^&]+)/);
  if (watchMatch) videoId = watchMatch[1];
  
  // Match format: youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) videoId = shortMatch[1];
  
  // If we found a video ID, create an embed URL
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // If we can't parse it, return the original URL
  return url;
}