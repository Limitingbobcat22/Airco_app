type HeadingProps = {
  title: string
  description?: string
  className?: string
}

export default function Heading({ title, description, className }: HeadingProps) {
  return (
    <div className={className}>
      <h2 className="text-ink text-xl font-bold tracking-tight sm:text-2xl">
        {title}
      </h2>
      {description ? (
        <p className="text-ink/70 text-sm">{description}</p>
      ) : null}
    </div>
  )
}
