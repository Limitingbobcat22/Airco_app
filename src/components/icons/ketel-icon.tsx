import { forwardRef, type SVGProps } from 'react'

type KetelIconProps = SVGProps<SVGSVGElement> & {
  size?: number | string
}

/** Combi-ketel met vlam — custom icoon voor ketels. */
const KetelIcon = forwardRef<SVGSVGElement, KetelIconProps>(
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
      <rect x="5" y="5" width="14" height="15" rx="2.5" />
      <path d="M8.5 9h7" />
      <path d="M8.5 12h7" />
      <path d="M10.5 16c.4-.6.8-.6 1.2 0 .4.6.8.6 1.2 0 .4-.6.8-.6 1.2 0" />
      <path d="M12 5V3" />
      <path d="M9 20h6" />
      <path d="M12 20v1.5" />
    </svg>
  ),
)

KetelIcon.displayName = 'KetelIcon'

export default KetelIcon
