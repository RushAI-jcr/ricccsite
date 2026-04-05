import sharp from "sharp";

// Validate by magic bytes — never trust Content-Type header
const MAGIC: Record<string, number[]> = {
  "image/jpeg": [0xff, 0xd8, 0xff],
  "image/png": [0x89, 0x50, 0x4e, 0x47],
  "image/webp": [0x52, 0x49, 0x46, 0x46],
};

export function sniffMimeType(buf: Buffer): string | null {
  for (const [mime, magic] of Object.entries(MAGIC)) {
    if (magic.every((b, i) => buf[i] === b)) return mime;
  }
  return null;
}

export async function processPhoto(file: File): Promise<Buffer> {
  const arrayBuf = await file.arrayBuffer();
  const buf = Buffer.from(arrayBuf);

  const mime = sniffMimeType(buf);
  if (!mime) throw new Error("Unsupported image type");

  return sharp(buf)
    .resize(400, 400, { fit: "cover", position: "attention" })
    .jpeg({ quality: 80 })
    .toBuffer();
}
