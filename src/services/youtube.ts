// Suggested code may be subject to a license. Learn more: ~LicenseLog:1161755147.
/**
 * Represents the metadata of a YouTube video.
 */
export interface YouTubeVideo {
  /**
   * The title of the video.
   */
  title: string;
  /**
   * The description of the video.
   */
  description: string;
  /**
   * The URL of the video thumbnail.
   */
  thumbnailUrl: string;
}

/**
 * Asynchronously retrieves YouTube video metadata for a given video URL.
 *
 * @param videoUrl The URL of the YouTube video.
 * @returns A promise that resolves to a YouTubeVideo object containing the video's metadata.
 */
export async function getYoutubeVideoMetadata(videoUrl: string): Promise<YouTubeVideo> {
  try {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      throw new Error('Invalid YouTube video URL');
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      throw new Error('YouTube API key is not set in environment variables.');
    }

    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch video metadata: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.items || data.items.length === 0) {
      throw new Error('No video found with the given ID.');
    }

    const snippet = data.items[0].snippet;
  return {
      title: snippet.title,
      description: snippet.description,
      thumbnailUrl: snippet.thumbnails.high.url,
    };
  } catch (error: any) {
    console.error('Error fetching YouTube video metadata:', error);
    throw new Error(`Failed to get video metadata: ${error.message}`);
  }
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}
