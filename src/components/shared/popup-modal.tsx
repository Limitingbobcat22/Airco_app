import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Plus } from 'lucide-react'
import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'

type PopupModalContextValue = {
  registerCloseHandler: (handler: (() => void) | null) => void
}

export const PopupModalContext = createContext<PopupModalContextValue | null>(
  null,
)

type PopupModalProps = {
  onConfirm?: () => void
  loading?: boolean
  renderModal: (onClose: () => void) => ReactNode
  renderButton?: (onClick: () => void) => ReactNode
  maxWidth?: string
  maxHeight?: string
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function PopupModal({
  renderModal,
  renderButton,
  maxWidth = 'md:max-w-[500px]',
  maxHeight = 'h-[80dvh]',
  isOpen: controlledIsOpen,
  onOpenChange,
}: PopupModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const closeHandlerRef = useRef<(() => void) | null>(null)
  const isControlled = controlledIsOpen !== undefined
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen

  const forceClose = useCallback(() => {
    if (isControlled) {
      onOpenChange?.(false)
    } else {
      setInternalIsOpen(false)
    }
  }, [isControlled, onOpenChange])

  const handleModalClose = useCallback(() => {
    if (closeHandlerRef.current) {
      closeHandlerRef.current()
    } else {
      forceClose()
    }
  }, [forceClose])

  const registerCloseHandler = useCallback((handler: (() => void) | null) => {
    closeHandlerRef.current = handler
  }, [])

  useEffect(() => {
    if (isOpen) {
      closeHandlerRef.current = null
    }
  }, [isOpen])

  const handleOpen = () => {
    if (isControlled) {
      onOpenChange?.(true)
    } else {
      setInternalIsOpen(true)
    }
  }

  return (
    <>
      {renderButton
        ? renderButton(handleOpen)
        : !isControlled && (
            <Button
              className="border-primary h-10 w-full rounded-full border text-xs md:w-auto md:text-sm"
              onClick={handleOpen}
            >
              <Plus className="mr-2 h-4 w-4" />
              <span className="mr-2 truncate">Add new</span>
            </Button>
          )}
      {isOpen ? (
        <PopupModalContext.Provider value={{ registerCloseHandler }}>
          <Modal
            isOpen={isOpen}
            onClose={handleModalClose}
            className={`!bg-background w-full !px-1 ${maxWidth}`}
          >
            <div className={`overflow-y-auto px-6 ${maxHeight}`}>
              {renderModal(forceClose)}
            </div>
          </Modal>
        </PopupModalContext.Provider>
      ) : null}
    </>
  )
}
