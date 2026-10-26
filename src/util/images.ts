const MAX_EDGE = 1440;
const JPEG_QUALITY = 0.85;
/** Matches the server's per-file limit. */
const MAX_RAW_BYTES = 20 * 1024 * 1024;

/** A picked photo that can't be uploaded; the message is shown to the user as-is. */
export class PhotoReadError extends Error {}

type Drawable = { source: CanvasImageSource; width: number; height: number; release: () => void };

async function decodeBitmap(file: File, options?: ImageBitmapOptions): Promise<Drawable | null> {
  if (typeof createImageBitmap !== 'function') return null;
  try {
    const bitmap = await createImageBitmap(file, options);
    return { source: bitmap, width: bitmap.width, height: bitmap.height, release: () => bitmap.close() };
  } catch {
    return null;
  }
}

/** <img> decodes formats createImageBitmap may not (HEIC in Safari) and also applies EXIF rotation. */
function decodeImage(file: File): Promise<Drawable | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () =>
      resolve(
        img.naturalWidth > 0
          ? { source: img, width: img.naturalWidth, height: img.naturalHeight, release: () => URL.revokeObjectURL(url) }
          : (URL.revokeObjectURL(url), null),
      );
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

function toJpeg(image: Drawable): Promise<Blob | null> {
  const longEdge = Math.max(image.width, image.height);
  const scale = longEdge > MAX_EDGE ? MAX_EDGE / longEdge : 1;
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) return Promise.resolve(null);
  // JPEG has no transparency; keep transparent PNG/WebP areas white rather than black.
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image.source, 0, 0, canvas.width, canvas.height);
  image.release();
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY));
}

/**
 * Reads a picked photo and returns a JPEG no larger than 1440px on its long
 * edge. Keeps uploads small; the server stores 1080px anyway. Mirrors Android.
 *
 * If this browser can't decode the file (HEIC outside Safari, some AVIF or
 * RAW files), the original is sent as-is and the server converts it to JPEG.
 */
export async function compressForUpload(file: File): Promise<File> {
  const image =
    // Applies EXIF orientation, so portrait photos stay upright.
    (await decodeBitmap(file, { imageOrientation: 'from-image' })) ??
    // Older Safari rejects the options argument.
    (await decodeBitmap(file)) ??
    (await decodeImage(file));
  const jpeg = image ? await toJpeg(image) : null;
  if (jpeg) return new File([jpeg], 'photo.jpg', { type: 'image/jpeg' });

  if (file.size > MAX_RAW_BYTES) throw new PhotoReadError('That photo is too large. Try one under 20 MB.');
  if (file.size === 0) throw new PhotoReadError('We couldn’t read that photo. Try another one.');
  return file;
}

/** Opens the file picker for one image. Resolves null if the user cancels. */
export function pickImage(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => resolve(input.files?.[0] ?? null);
    input.addEventListener('cancel', () => resolve(null));
    input.click();
  });
}
