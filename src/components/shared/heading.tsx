type HeadingProps = {
  title: string
  description?: string
  className?: string
}

export default function Heading({ title, description, className }: HeadingProps) {
  return (
    <div className={className}>
      <h2 className="text-primary text-xl font-bold tracking-tight sm:text-2xl">
        {title}
      </h2>
      {description ? (
        <p className="text-muted-foreground text-sm">{description}</p>
      ) : null}
    </div>
  )
}
