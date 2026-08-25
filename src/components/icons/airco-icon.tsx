import { forwardRef, type SVGProps } from 'react'

type AircoIconProps = SVGProps<SVGSVGElement> & {
  size?: number | string
}

/** Wandunit met luchtstromen — vervangt Lucide Wind voor airco. */
const AircoIcon = forwardRef<SVGSVGElement, AircoIconProps>(
  (
    {
      className,
      size = 24,
      width,
      height,
      strokeWidth = 2,
      ...props
    },
    ref,
  ) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={width ?? size}
      height={height ?? size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="3" width="18" height="11" rx="2.5" />
      <path d="M6.5 9.75h11" />
      <path d="M6.5 12.5h11" />
      <path d="M8 16.25c1.6 1.1 1.6 2.1 0 3.25 1.6 1.1 1.6 2.1 0 3.25" />
      <path d="M12 16.25c1.6 1.1 1.6 2.1 0 3.25 1.6 1.1 1.6 2.1 0 3.25" />
      <path d="M16 16.25c1.6 1.1 1.6 2.1 0 3.25 1.6 1.1 1.6 2.1 0 3.25" />
    </svg>
  ),
)

AircoIcon.displayName = 'AircoIcon'

export default AircoIcon
