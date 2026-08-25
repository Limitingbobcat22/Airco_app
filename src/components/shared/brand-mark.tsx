import { cn } from '@/lib/utils'

type BrandMarkProps = {
  withText?: boolean
  className?: string
}

export default function BrandMark({
  withText = false,
  className,
}: BrandMarkProps) {
  if (withText) {
    return (
      <img
        src="/images/LogoMetNaam-removebg.png"
        alt="Airco & Warmte"
        width={895}
        height={279}
        className={cn('h-auto w-full max-w-full object-contain', className)}
      />
    )
  }

  return (
    <img
      src="/images/logo-icon.png"
      alt="Airco & Warmte"
      width={500}
      height={500}
      className={cn('size-20 object-contain', className)}
    />
  )
}
