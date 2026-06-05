import sharp from 'sharp'

export type ProcessedProfileImage = {
  buffer: Buffer
  width: number
  height: number
  blurDataUrl: string
}

export type ProfileImageCrop = {
  left: number
  top: number
  width: number
  height: number
}

export async function processProfileImage(
  input: Buffer,
  crop?: ProfileImageCrop
): Promise<ProcessedProfileImage> {
  const targetSize = 1024
  let image = sharp(input).rotate()

  if (crop) {
    image = image.extract(crop)
  }

  image = image.resize(targetSize, targetSize, { fit: 'cover', position: 'attention' })
  const metadata = await image.metadata()
  const buffer = await image
    .webp({ quality: 84, effort: 4 })
    .toBuffer()

  const blurDataUrl = await sharp(input)
    .rotate()
    .resize(32, 32, { fit: 'cover', position: 'attention' })
    .blur(2)
    .webp({ quality: 30 })
    .toBuffer()
    .then((data) => `data:image/webp;base64,${data.toString('base64')}`)

  return {
    buffer,
    width: metadata.width ?? targetSize,
    height: metadata.height ?? targetSize,
    blurDataUrl,
  }
}

export function normalizeProfileImageAlt(name: string) {
  return `${name} profile portrait`
}
