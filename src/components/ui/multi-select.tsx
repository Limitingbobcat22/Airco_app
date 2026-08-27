import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { CheckIcon, ChevronDown, XCircle, XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'

const multiSelectVariants = cva(
  'm-1 transition ease-in-out delay-150 duration-300 hover:-translate-y-1 hover:scale-110',
  {
    variants: {
      variant: {
        default:
          'border-foreground/10 text-foreground bg-card hover:bg-card/80',
        secondary:
          'border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        inverted:
          'border-transparent bg-sky-400 text-white hover:bg-sky-400/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type MultiSelectOption = {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

type MultiSelectProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'value'
> &
  VariantProps<typeof multiSelectVariants> & {
    options: MultiSelectOption[]
    onValueChange: (value: string[]) => void
    onClear?: () => void
    defaultValue?: string[]
    placeholder?: string
    animation?: number
    maxCount?: number
    modalPopover?: boolean
    value?: string[]
  }

export const MultiSelect = React.forwardRef<
  HTMLButtonElement,
  MultiSelectProps
>(
  (
    {
      options,
      onValueChange,
      onClear,
      variant,
      defaultValue = [],
      placeholder = 'Selecteer opties',
      animation = 0,
      maxCount = 3,
      modalPopover = false,
      className,
      value,
      ...props
    },
    ref,
  ) => {
    const [selectedValues, setSelectedValues] = React.useState<string[]>(
      value ?? defaultValue,
    )
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)

    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedValues(value)
      }
    }, [value])

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
      if (event.key === 'Enter') {
        setIsPopoverOpen(true)
      } else if (event.key === 'Backspace' && !event.currentTarget.value) {
        const next = selectedValues.slice(0, -1)
        setSelectedValues(next)
        onValueChange(next)
      }
    }

    const toggleOption = (option: string) => {
      const next = selectedValues.includes(option)
        ? selectedValues.filter((item) => item !== option)
        : [...selectedValues, option]
      setSelectedValues(next)
      onValueChange(next)
    }

    const handleClear = () => {
      setSelectedValues([])
      if (onClear) onClear()
      else onValueChange([])
    }

    const clearExtraOptions = () => {
      const next = selectedValues.slice(0, maxCount)
      setSelectedValues(next)
      onValueChange(next)
    }

    const toggleAll = () => {
      if (selectedValues.length === options.length) {
        setSelectedValues([])
        onValueChange([])
      } else {
        const allValues = options.map((option) => option.value)
        setSelectedValues(allValues)
        onValueChange(allValues)
      }
    }

    return (
      <Popover
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
        modal={modalPopover}
      >
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            type="button"
            onClick={() => setIsPopoverOpen((prev) => !prev)}
            className={cn(
              'flex h-auto min-h-10 w-full items-center justify-between rounded-md border bg-inherit p-1 hover:bg-inherit [&_svg]:pointer-events-auto',
              className,
            )}
          >
            {selectedValues.length > 0 ? (
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-wrap items-center">
                  {selectedValues.slice(0, maxCount).map((item) => {
                    const option = options.find((o) => o.value === item)
                    const IconComponent = option?.icon
                    return (
                      <Badge
                        key={item}
                        className={cn(multiSelectVariants({ variant }))}
                        style={
                          animation
                            ? { animationDuration: `${animation}s` }
                            : undefined
                        }
                      >
                        {IconComponent ? (
                          <IconComponent className="mr-2 size-4" />
                        ) : null}
                        {option?.label}
                        <XCircle
                          className="ml-2 size-4 cursor-pointer"
                          onClick={(event) => {
                            event.stopPropagation()
                            toggleOption(item)
                          }}
                        />
                      </Badge>
                    )
                  })}
                  {selectedValues.length > maxCount ? (
                    <Badge className="border-sky-300 bg-sky-50 m-1 text-sky-700 hover:bg-sky-50">
                      {`+ ${selectedValues.length - maxCount} more`}
                      <XCircle
                        className="ml-2 size-4 cursor-pointer"
                        onClick={(event) => {
                          event.stopPropagation()
                          clearExtraOptions()
                        }}
                      />
                    </Badge>
                  ) : null}
                </div>
                <div className="flex items-center justify-between">
                  <XIcon
                    className="text-muted-foreground mx-2 h-4 cursor-pointer"
                    onClick={(event) => {
                      event.stopPropagation()
                      handleClear()
                    }}
                  />
                  <Separator
                    orientation="vertical"
                    className="flex h-full min-h-6"
                  />
                  <ChevronDown className="text-muted-foreground mx-2 h-4 cursor-pointer" />
                </div>
              </div>
            ) : (
              <div className="mx-auto flex w-full items-center justify-between">
                <span className="text-muted-foreground mx-3 text-sm">
                  {placeholder}
                </span>
                <ChevronDown className="text-muted-foreground mx-2 h-4 cursor-pointer" />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="end"
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
        >
          <Command>
            <CommandInput
              placeholder="Zoeken…"
              onKeyDown={handleInputKeyDown}
            />
            <CommandList>
              <CommandEmpty>Geen resultaten.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  key="all"
                  onSelect={toggleAll}
                  className="cursor-pointer"
                >
                  <div
                    className={cn(
                      'border-primary mr-2 flex size-4 items-center justify-center rounded-sm border',
                      selectedValues.length === options.length
                        ? 'bg-primary text-primary-foreground'
                        : 'opacity-50 [&_svg]:invisible',
                    )}
                  >
                    <CheckIcon className="size-4" />
                  </div>
                  <span>(Alles selecteren)</span>
                </CommandItem>
                {options.map((option) => {
                  const isSelected = selectedValues.includes(option.value)
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => toggleOption(option.value)}
                      className="cursor-pointer"
                    >
                      <div
                        className={cn(
                          'border-primary mr-2 flex size-4 items-center justify-center rounded-sm border',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible',
                        )}
                      >
                        <CheckIcon className="size-4" />
                      </div>
                      {option.icon ? (
                        <option.icon className="text-muted-foreground mr-2 size-4" />
                      ) : null}
                      <span>{option.label}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <div className="flex items-center justify-between">
                  <CommandItem
                    onSelect={handleClear}
                    className="flex-1 cursor-pointer justify-center"
                  >
                    Wissen
                  </CommandItem>
                  <Separator
                    orientation="vertical"
                    className="flex h-full min-h-6"
                  />
                  <CommandItem
                    onSelect={() => setIsPopoverOpen(false)}
                    className="max-w-full flex-1 cursor-pointer justify-center"
                  >
                    Sluiten
                  </CommandItem>
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  },
)

MultiSelect.displayName = 'MultiSelect'
