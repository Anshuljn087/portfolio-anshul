import Image from 'next/image'

type ProfileImage = {
  src: string
  alt: string
  width?: number
  height?: number
  blurDataUrl?: string
}

export function ProfileAvatar({
  image,
  size = 'md',
  className = '',
}: {
  image?: ProfileImage | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  if (!image?.src) {
    return (
      <div
        className={[
          'grid shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-sm font-medium text-muted-foreground',
          size === 'sm' ? 'h-10 w-10' : size === 'lg' ? 'h-24 w-24' : 'h-14 w-14',
          className,
        ].join(' ')}
      >
        AJ
      </div>
    )
  }

  const dimension = size === 'sm' ? 40 : size === 'lg' ? 96 : 56

  return (
    <div
      className={[
        'relative shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/[0.04]',
        size === 'sm' ? 'h-10 w-10' : size === 'lg' ? 'h-24 w-24' : 'h-14 w-14',
        className,
      ].join(' ')}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={`${dimension}px`}
        priority={size !== 'sm'}
        placeholder={image.blurDataUrl ? 'blur' : 'empty'}
        blurDataURL={image.blurDataUrl}
        className="object-cover"
      />
    </div>
  )
}
