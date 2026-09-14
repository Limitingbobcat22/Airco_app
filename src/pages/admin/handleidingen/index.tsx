import { useCallback, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import Heading from '@/components/shared/heading'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuth } from '@/hooks/use-auth'
import {
  createHandleiding,
  deleteHandleiding,
  handleidingFileUrl,
  listHandleidingen,
  updateHandleiding,
  type Handleiding,
} from '@/lib/api/handleidingen'
import { useUnsavedChanges } from '@/providers/unsaved-changes'
import HandleidingForm, {
  type HandleidingFormValues,
} from './handleiding-form'

const dateTime = new Intl.DateTimeFormat('nl-NL', {
  dateStyle: 'short',
  timeStyle: 'short',
})

export default function AdminHandleidingenPage() {
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
    queryKey: ['handleidingen'],
    queryFn: listHandleidingen,
  })

  const [rows, setRows] = useState<Handleiding[]>([])
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorDirty, setEditorDirty] = useState(false)
  const [discardOpen, setDiscardOpen] = useState(false)
  const [editing, setEditing] = useState<Handleiding | null>(null)
  const [deleting, setDeleting] = useState<Handleiding | null>(null)
  const [preview, setPreview] = useState<Handleiding | null>(null)

  const closeEditor = () => {
    setDiscardOpen(false)
    setEditorDirty(false)
    setEditorOpen(false)
    setEditing(null)
  }

  const handleEditorDirtyChange = useCallback((dirty: boolean) => {
    setEditorDirty(dirty)
  }, [])

  const closeDelete = () => {
    setDeleting(null)
  }

  const createMutation = useMutation({
    mutationFn: (values: HandleidingFormValues) => {
      if (!token) throw new Error('Je bent niet ingelogd als admin.')
      if (!values.file) throw new Error('Kies een PDF-bestand.')
      return createHandleiding(token, {
        title: values.title.trim(),
        description: values.description.trim() || undefined,
        file: values.file,
      })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['handleidingen'] })
      closeEditor()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string
      values: HandleidingFormValues
    }) => {
      if (!token) throw new Error('Je bent niet ingelogd als admin.')
      return updateHandleiding(token, id, {
        title: values.title.trim(),
        description: values.description.trim() || undefined,
        file: values.file ?? undefined,
      })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['handleidingen'] })
      closeEditor()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error('Je bent niet ingelogd als admin.')
      return deleteHandleiding(token, id)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['handleidingen'] })
      closeDelete()
    },
  })

  useEffect(() => {
    if (remoteRows) setRows(remoteRows)
  }, [remoteRows])

  const openCreate = () => {
    createMutation.reset()
    updateMutation.reset()
    deleteMutation.reset()
    setDiscardOpen(false)
    setEditorDirty(false)
    setEditing(null)
    setEditorOpen(true)
  }

  const openEdit = (handleiding: Handleiding) => {
    createMutation.reset()
    updateMutation.reset()
    deleteMutation.reset()
    setDiscardOpen(false)
    setEditorDirty(false)
    setEditing(handleiding)
    setEditorOpen(true)
  }

  const openDelete = (handleiding: Handleiding) => {
    deleteMutation.reset()
    setDeleting(handleiding)
  }

  const requestCloseEditor = () => {
    if (createMutation.isPending || updateMutation.isPending) return
    if (discardOpen) return
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

  const columns = useMemo<ColumnDef<Handleiding>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Titel',
      },
      {
        accessorKey: 'description',
        header: 'Beschrijving',
        cell: ({ getValue }) => {
          const value = getValue<string | null>()
          return value?.trim() ? value : '–'
        },
      },
      {
        accessorKey: 'originalFilename',
        header: 'Bestand',
      },
      {
        accessorKey: 'createdAt',
        header: 'Geüpload',
        cell: ({ getValue }) => {
          const value = getValue<string>()
          const date = value ? new Date(value) : null
          return date && !Number.isNaN(date.getTime())
            ? dateTime.format(date)
            : '–'
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
              onClick={() => setPreview(row.original)}
              aria-label="Bekijken"
            >
              <Eye className="size-4" />
            </Button>
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
              onClick={() => openDelete(row.original)}
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

  const visibleColumnCount = table.getVisibleLeafColumns().length
  const saveError = editing ? updateMutation.error : createMutation.error
  const formError = saveError instanceof Error ? saveError.message : null

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-col gap-4 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Heading
          title="Handleidingen beheer"
          description="Upload, bewerk en verwijder PDF-handleidingen die klanten kunnen bekijken."
        />
        <Button type="button" onClick={openCreate} className="gap-2">
          <Plus className="size-4" />
          Toevoegen
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden p-4 sm:p-6">
        {isLoading ? (
          <div className="text-muted-foreground rounded-xl border p-8 text-center text-sm">
            Handleidingen laden…
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
            <p className="text-sm text-destructive">
              {error instanceof Error
                ? error.message
                : 'Kon handleidingen niet ophalen.'}
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
          <div className="admin-table-scroll h-[75%] rounded-xl border">
            <Table className="w-max min-w-full">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="bg-muted/40 hover:bg-muted/40"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="whitespace-nowrap">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="whitespace-nowrap">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={visibleColumnCount || 1}
                      className="text-muted-foreground h-24 text-center"
                    >
                      Nog geen handleidingen.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Modal
        title={editing ? 'Handleiding bewerken' : 'Handleiding toevoegen'}
        description="PDF-handleiding beheren"
        isOpen={editorOpen}
        onClose={requestCloseEditor}
        className="max-h-[90vh] overflow-y-auto md:max-w-[560px] p-4 sm:p-6"
      >
        <HandleidingForm
          key={editing?.id ?? 'create'}
          initial={editing}
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
              Niet-opgeslagen wijzigingen gaan verloren.
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
        title="Handleiding verwijderen"
        description="Bevestig of je deze handleiding wilt verwijderen"
        isOpen={deleting != null}
        onClose={() => {
          if (deleteMutation.isPending) return
          closeDelete()
        }}
        className="max-w-md"
      >
        <div className="space-y-5 px-1 py-2">
          <div>
            <h2 className="font-display text-2xl text-ink">
              Weet je het zeker?
            </h2>
            <p className="mt-2 text-sm text-ink/70">
              Weet je zeker dat je{' '}
              <span className="font-semibold text-ink">
                {deleting?.title ?? 'deze handleiding'}
              </span>{' '}
              wilt verwijderen? Dit kan niet ongedaan worden gemaakt.
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
              onClick={closeDelete}
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

      <Modal
        title={preview?.title ?? 'Handleiding'}
        description="PDF-voorbeeld"
        isOpen={preview != null}
        onClose={() => setPreview(null)}
        className="w-[min(96vw,56rem)] max-w-[56rem] overflow-hidden p-3 sm:p-4"
      >
        <div className="space-y-3">
          <div>
            <h2 className="font-display text-2xl text-ink">
              {preview?.title ?? 'Handleiding'}
            </h2>
            {preview?.description ? (
              <p className="mt-1 text-sm text-ink/70">{preview.description}</p>
            ) : null}
          </div>
          {preview ? (
            <iframe
              title={preview.title}
              src={handleidingFileUrl(preview)}
              className="h-[70dvh] w-full rounded-xl border border-mist bg-white"
            />
          ) : null}
        </div>
      </Modal>
    </div>
  )
}
