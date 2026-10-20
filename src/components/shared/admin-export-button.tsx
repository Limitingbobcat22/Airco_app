import { Download } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

export function useAdminExcelExport() {
  const { token } = useAuth()
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  const exportExcel = async (download: (token: string) => Promise<void>) => {
    if (!token || isExporting) return
    setIsExporting(true)
    setExportError(null)
    try {
      await download(token)
    } catch (error: unknown) {
      setExportError(
        error instanceof Error ? error.message : 'Exporteren mislukt',
      )
    } finally {
      setIsExporting(false)
    }
  }

  return {
    isExporting,
    exportError,
    canExport: Boolean(token),
    exportExcel,
  }
}

export function AdminExportButton({
  onClick,
  loading,
  disabled,
  className,
}: {
  onClick: () => void
  loading: boolean
  disabled?: boolean
  className?: string
}) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={disabled || loading}
      className={cn('gap-2', className)}
    >
      <Download className="size-4" />
      {loading ? 'Exporteren…' : 'Exporteer Excel'}
    </Button>
  )
}

export function AdminExportError({ message }: { message: string | null }) {
  if (!message) return null
  return <p className="text-sm text-destructive">{message}</p>
}
