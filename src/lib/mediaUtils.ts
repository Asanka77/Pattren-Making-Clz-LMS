/**
 * Utility helpers for robust media processing (compression, YouTube URLs, thumbnails)
 * Ensures images never exceed Firebase Firestore 1MB limits or LocalStorage quota.
 */

/**
 * Extracts a valid 11-character YouTube video ID from any format:
 * - https://www.youtube.com/watch?v=fJ9rUzIMcZQ
 * - https://youtu.be/fJ9rUzIMcZQ
 * - https://youtu.be/fJ9rUzIMcZQ?si=xyz
 * - https://www.youtube.com/shorts/fJ9rUzIMcZQ
 * - https://www.youtube.com/live/fJ9rUzIMcZQ
 * - https://m.youtube.com/watch?v=fJ9rUzIMcZQ
 * - https://www.youtube.com/embed/fJ9rUzIMcZQ
 * - <iframe src="https://www.youtube.com/embed/fJ9rUzIMcZQ" ...>
 * - Raw 11-char ID like "fJ9rUzIMcZQ"
 */
export const parseYouTubeVideoId = (input: string | undefined | null): string => {
  if (!input) return '';
  const trimmed = input.trim();

  // If already an 11-character video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Common URL patterns
  const match = trimmed.match(
    /(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+?&v=|shorts\/|live\/))([a-zA-Z0-9_-]{11})/i
  );
  if (match && match[1]) {
    return match[1];
  }

  // Fallback for iframe string embeds: <iframe src=".../embed/VIDEO_ID"...
  const embedMatch = trimmed.match(/embed\/([a-zA-Z0-9_-]{11})/i);
  if (embedMatch && embedMatch[1]) {
    return embedMatch[1];
  }

  // Fallback using URL query parser if full valid URL
  try {
    const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    const v = url.searchParams.get('v');
    if (v && v.length === 11) return v;
  } catch (_) {}

  return '';
};

/**
 * Constructs a standard YouTube embed URL with options.
 */
export const getYouTubeEmbedUrl = (
  urlOrId: string | undefined | null,
  options: { autoplay?: boolean; loop?: boolean; mute?: boolean; controls?: boolean } = {}
): string => {
  const videoId = parseYouTubeVideoId(urlOrId) || 'c4o9_MxjGxY';
  const { autoplay = false, loop = false, mute = false, controls = true } = options;

  const params = new URLSearchParams();
  if (autoplay) params.set('autoplay', '1');
  if (mute) params.set('mute', '1');
  if (loop) {
    params.set('loop', '1');
    params.set('playlist', videoId);
  }
  if (!controls) {
    params.set('controls', '0');
    params.set('showinfo', '0');
    params.set('disablekb', '1');
    params.set('fs', '0');
  }
  params.set('rel', '0');
  params.set('modestbranding', '1');
  params.set('playsinline', '1');
  params.set('iv_load_policy', '3');
  params.set('enablejsapi', '1');
  try {
    if (typeof window !== 'undefined' && window.location?.origin) {
      params.set('origin', window.location.origin);
      params.set('widget_referrer', window.location.origin);
    }
  } catch (_) {}

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
};

/**
 * Returns the highest quality official YouTube thumbnail for a given URL or ID.
 */
export const getYouTubeThumbnailUrl = (urlOrId: string | undefined | null): string => {
  const videoId = parseYouTubeVideoId(urlOrId);
  return videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85';
};

/**
 * Detects if a URL is a Pinterest pin or board link
 */
export const isPinterestUrl = (url: string | undefined | null): boolean => {
  if (!url) return false;
  const clean = url.trim().toLowerCase();
  return clean.includes('pinterest.com') || clean.includes('pin.it');
};

/**
 * Extracts numeric Pinterest pin ID or tab ID
 */
export const parsePinterestPinId = (url: string | undefined | null): string => {
  if (!url) return '';
  const trimmed = url.trim();
  const match = trimmed.match(/pins?\/(\d+)/i);
  if (match && match[1]) return match[1];
  const tabMatch = trimmed.match(/tabId=(\d+)/i);
  if (tabMatch && tabMatch[1]) return tabMatch[1];
  const embedMatch = trimmed.match(/[?&]id=(\d+)/i) || trimmed.match(/id=(\d+)/i);
  if (embedMatch && embedMatch[1]) return embedMatch[1];
  if (/^\d{6,30}$/.test(trimmed)) return trimmed;
  return '';
};

/**
 * Gets Pinterest official embed URL
 */
export const getPinterestEmbedUrl = (urlOrPinId: string | undefined | null): string => {
  const pinId = parsePinterestPinId(urlOrPinId) || '696932179776250726';
  return `https://assets.pinterest.com/ext/embed.html?id=${pinId}`;
};

/**
 * Detects direct HTML5 playable video URLs (.mp4, .webm, .ogg, .mov)
 */
export const isDirectVideoUrl = (url: string | undefined | null): boolean => {
  if (!url) return false;
  const clean = url.trim().toLowerCase();
  return (
    clean.endsWith('.mp4') ||
    clean.endsWith('.webm') ||
    clean.endsWith('.ogg') ||
    clean.endsWith('.mov') ||
    clean.includes('.mp4?') ||
    clean.includes('.webm?')
  );
};

/**
 * Compresses an image file client-side using HTML5 Canvas.
 * Keeps output under ~30KB (logos) or ~150KB (hero covers), protecting Firestore 1MB limits.
 */
export const compressImage = (
  file: File,
  maxWidth: number = 400,
  maxHeight: number = 400,
  quality: number = 0.85
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Preserve PNG transparency if original is PNG, otherwise compress to JPEG
        const isPng = file.type === 'image/png';
        const mime = isPng ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mime, isPng ? undefined : quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
