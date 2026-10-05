import { useCallback, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { AdminResponsiveTable } from '@/components/shared/admin-responsive-table'
import Heading from '@/components/shared/heading'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { useAuth } from '@/hooks/use-auth'
import {
  createOnderhoudType,
  deleteOnderhoudType,
  listOnderhoudTypes,
  updateOnderhoudType,
  type OnderhoudType,
} from '@/lib/api/onderhoud-types'
import { useUnsavedChanges } from '@/providers/unsaved-changes'
import OnderhoudTypeForm, {
  type OnderhoudTypeFormValues,
} from './type-form'

export default function AdminOnderhoudTypesPage() {
  const { token } = useAuth()
  const { setDirty } = useUnsavedChanges()
  const queryClient = useQueryClient()
  const {
    data: remoteRows,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['onderhoud-types'],
    queryFn: listOnderhoudTypes,
  })

  const [rows, setRows] = useState<OnderhoudType[]>([])
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorDirty, setEditorDirty] = useState(false)
  const [discardOpen, setDiscardOpen] = useState(false)
  const [editing, setEditing] = useState<OnderhoudType | null>(null)
  const [deleting, setDeleting] = useState<OnderhoudType | null>(null)

  const closeEditor = () => {
    setDiscardOpen(false)
    setEditorDirty(false)
    setEditorOpen(false)
    setEditing(null)
  }

  const handleEditorDirtyChange = useCallback((dirty: boolean) => {
    setEditorDirty(dirty)
  }, [])

  const createMutation = useMutation({
    mutationFn: (values: OnderhoudTypeFormValues) => {
      if (!token) throw new Error('Je bent niet ingelogd als admin.')
      return createOnderhoudType(token, values)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['onderhoud-types'] })
      closeEditor()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string
      values: OnderhoudTypeFormValues
    }) => {
      if (!token) throw new Error('Je bent niet ingelogd als admin.')
      return updateOnderhoudType(token, id, values)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['onderhoud-types'] })
      closeEditor()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error('Je bent niet ingelogd als admin.')
      return deleteOnderhoudType(token, id)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['onderhoud-types'] })
      setDeleting(null)
    },
  })

  useEffect(() => {
    if (remoteRows) setRows(remoteRows)
  }, [remoteRows])

  const openCreate = () => {
    createMutation.reset()
    updateMutation.reset()
    setDiscardOpen(false)
    setEditorDirty(false)
    setEditing(null)
    setEditorOpen(true)
  }

  const openEdit = (type: OnderhoudType) => {
    createMutation.reset()
    updateMutation.reset()
    setDiscardOpen(false)
    setEditorDirty(false)
    setEditing(type)
    setEditorOpen(true)
  }

  const requestCloseEditor = () => {
    if (createMutation.isPending || updateMutation.isPending) return
    if (editorDirty) {
      setDiscardOpen(true)
      return
    }
    closeEditor()
  }

  useEffect(() => {
    setDirty(editorDirty)
    return () => setDirty(false)
  }, [editorDirty, setDirty])

  const nextSortOrder =
    rows.reduce((max, row) => Math.max(max, row.sortOrder), 0) + 1

  const columns = useMemo<ColumnDef<OnderhoudType>[]>(
    () => [
      { accessorKey: 'sortOrder', header: 'Volgorde' },
      { accessorKey: 'name', header: 'Type' },
      {
        accessorKey: 'description',
        header: 'Handelingen',
        cell: ({ getValue }) => {
          const value = getValue<string | null>()
          if (!value?.trim()) return '–'
          const first = value.split(/\r?\n/).find((line) => line.trim()) ?? ''
          return first.length > 80 ? `${first.slice(0, 80)}…` : first
        },
      },
      {
        id: 'actions',
        header: 'Acties',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => openEdit(row.original)}
              aria-label="Bewerken"
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                deleteMutation.reset()
                setDeleting(row.original)
              }}
              aria-label="Verwijderen"
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        ),
      },
    ],
    [],
  )

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  })

  const saveError = editing ? updateMutation.error : createMutation.error
  const formError = saveError instanceof Error ? saveError.message : null

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-col gap-4 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Heading
          title="Onderhoud-type"
          description="Types en handelingen die klanten op de onderhoudspagina zien."
        />
        <Button
          type="button"
          onClick={openCreate}
          className="gap-2 bg-sky-400 text-white shadow hover:bg-sky-500"
        >
          <Plus className="size-4" />
          Toevoegen
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4 sm:p-6">
        {isLoading ? (
          <div className="text-muted-foreground rounded-xl border p-8 text-center text-sm">
            Onderhoudtypes laden…
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
            <p className="text-sm text-destructive">
              {error instanceof Error
                ? error.message
                : 'Kon onderhoudtypes niet ophalen.'}
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              Opnieuw proberen
            </Button>
          </div>
        ) : (
          <AdminResponsiveTable
            table={table}
            emptyMessage="Nog geen onderhoudtypes."
            titleColumnIds={['name']}
          />
        )}
      </div>

      <Modal
        title={editing ? 'Onderhoudtype bewerken' : 'Onderhoudtype toevoegen'}
        description="Naam, volgorde en handelingen"
        isOpen={editorOpen}
        onClose={requestCloseEditor}
        className="max-h-[90vh] overflow-y-auto p-4 sm:max-w-2xl sm:p-6"
      >
        <OnderhoudTypeForm
          key={editing?.id ?? 'create'}
          initial={editing}
          nextSortOrder={nextSortOrder}
          submitting={
            editing ? updateMutation.isPending : createMutation.isPending
          }
          error={formError}
          onSubmit={(values) => {
            if (editing) {
              updateMutation.mutate({ id: editing.id, values })
              return
            }
            createMutation.mutate(values)
          }}
          onDirtyChange={handleEditorDirtyChange}
          onCancel={requestCloseEditor}
        />
      </Modal>

      <Modal
        title="Niet-opgeslagen wijzigingen"
        description="Bevestig of je wilt sluiten"
        isOpen={discardOpen}
        onClose={() => setDiscardOpen(false)}
        className="max-w-md"
      >
        <div className="space-y-5 px-1 py-2">
          <div>
            <h2 className="font-display text-2xl text-ink">Wijzigingen kwijt?</h2>
            <p className="mt-2 text-sm text-ink/70">
              Je hebt aanpassingen gedaan. Weet je zeker dat je wilt sluiten?
            </p>
          </div>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setDiscardOpen(false)}
              className="rounded-xl border border-mist bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-foam"
            >
              Blijven bewerken
            </button>
            <button
              type="button"
              onClick={closeEditor}
              className="rounded-xl bg-deep px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal"
            >
              Sluiten
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        title="Onderhoudtype verwijderen"
        description="Bevestig of je dit type wilt verwijderen"
        isOpen={deleting != null}
        onClose={() => {
          if (deleteMutation.isPending) return
          setDeleting(null)
        }}
        className="max-w-md"
      >
        <div className="space-y-5 px-1 py-2">
          <div>
            <h2 className="font-display text-2xl text-ink">Weet je het zeker?</h2>
            <p className="mt-2 text-sm text-ink/70">
              Weet je zeker dat je{' '}
              <span className="font-semibold text-ink">{deleting?.name}</span>{' '}
              wilt verwijderen?
            </p>
          </div>
          {deleteMutation.error instanceof Error ? (
            <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {deleteMutation.error.message}
            </p>
          ) : null}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setDeleting(null)}
              disabled={deleteMutation.isPending}
              className="rounded-xl border border-mist bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-foam disabled:opacity-60"
            >
              Annuleren
            </button>
            <button
              type="button"
              onClick={() => {
                if (!deleting) return
                deleteMutation.mutate(deleting.id)
              }}
              disabled={deleteMutation.isPending}
              className="rounded-xl bg-destructive px-5 py-2.5 text-sm font-semibold text-white hover:bg-destructive/90 disabled:opacity-60"
            >
              {deleteMutation.isPending ? 'Verwijderen…' : 'Verwijderen'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
