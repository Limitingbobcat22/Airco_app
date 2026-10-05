import { useId } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { VisuallyHidden } from '@/components/ui/visually-hidden'

interface ModalProps {
  title?: string
  description?: string
  isOpen: boolean
  onClose: () => void
  children?: React.ReactNode
  className?: string
  /** Ligt boven een andere modal. Klikken hierin sluit de modal eronder niet. */
  stacked?: boolean
}

function foreignStackId(event: {
  target: EventTarget | null
  currentTarget: EventTarget | null
}) {
  if (!(event.target instanceof Element)) return false
  const hit = event.target.closest('[data-stack-id]')?.getAttribute('data-stack-id')
  if (!hit) return false
  const own =
    event.currentTarget instanceof Element
      ? event.currentTarget.getAttribute('data-stack-id')
      : null
  return hit !== own
}

export function Modal({
  title,
  description,
  isOpen,
  onClose,
  children,
  className,
  stacked = false,
}: ModalProps) {
  const stackId = useId()

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          if (!stacked && document.querySelector('[data-stacked-dialog]')) return
          onClose()
        }
      }}
    >
      <DialogContent
        stacked={stacked}
        stackId={stacked ? stackId : undefined}
        className={className}
        onCloseClick={onClose}
        onInteractOutside={(event) => {
          if (foreignStackId(event)) event.preventDefault()
        }}
        onFocusOutside={(event) => {
          if (document.querySelector('[data-stacked-dialog]')) {
            event.preventDefault()
          }
        }}
        onPointerDownOutside={(event) => {
          event.preventDefault()
          if (foreignStackId(event)) return
          onClose()
        }}
        onEscapeKeyDown={(event) => {
          event.preventDefault()
          if (!stacked && document.querySelector('[data-stacked-dialog]')) return
          onClose()
        }}
      >
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  )
}
