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
  createOnderhoudOfferteAdmin,
  deleteOnderhoudOfferte,
  getOnderhoudOfferte,
  listOnderhoudOffertes,
  updateOnderhoudOfferte,
  type OnderhoudOfferteOverview,
} from '@/lib/api/onderhoud-offertes'
import { listKlanten } from '@/lib/api/klanten'
import { listOnderhoudTypes } from '@/lib/api/onderhoud-types'
import { useUnsavedChanges } from '@/providers/unsaved-changes'
import OnderhoudOfferteForm, {
  type OnderhoudOfferteFormValues,
} from './offerte-form'

const dateTime = new Intl.DateTimeFormat('nl-NL', {
  dateStyle: 'short',
  timeStyle: 'short',
})

export default function AdminOnderhoudOffertesPage() {
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
    queryKey: ['onderhoud-offertes'],
    queryFn: () => {
      if (!token) throw new Error('Je bent niet ingelogd als admin.')
      return listOnderhoudOffertes(token)
    },
    enabled: Boolean(token),
  })
  const { data: types = [] } = useQuery({
    queryKey: ['onderhoud-types'],
    queryFn: listOnderhoudTypes,
  })
  const { data: klanten = [] } = useQuery({
    queryKey: ['klanten'],
    queryFn: () => {
      if (!token) throw new Error('Je bent niet ingelogd als admin.')
      return listKlanten(token)
    },
    enabled: Boolean(token),
  })

  const [rows, setRows] = useState<OnderhoudOfferteOverview[]>([])
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorDirty, setEditorDirty] = useState(false)
  const [discardOpen, setDiscardOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<OnderhoudOfferteOverview | null>(null)
  const {
    data: editing,
    isFetching: detailLoading,
    isError: detailError,
    error: detailLoadError,
  } = useQuery({
    queryKey: ['onderhoud-offerte', editingId],
    queryFn: () => {
      if (!token || !editingId) throw new Error('Je bent niet ingelogd als admin.')
      return getOnderhoudOfferte(token, editingId)
    },
    enabled: Boolean(token && editingId),
  })

  const closeEditor = () => {
    setDiscardOpen(false)
    setEditorDirty(false)
    setEditorOpen(false)
    setEditingId(null)
  }

  const handleEditorDirtyChange = useCallback((dirty: boolean) => {
    setEditorDirty(dirty)
  }, [])

  const createMutation = useMutation({
    mutationFn: (values: OnderhoudOfferteFormValues) => {
      if (!token) throw new Error('Je bent niet ingelogd als admin.')
      return createOnderhoudOfferteAdmin(token, {
        klantId: values.klantId,
        typeIds: values.typeIds,
        images: values.newPhotos,
      })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['onderhoud-offertes'] })
      closeEditor()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string
      values: OnderhoudOfferteFormValues
    }) => {
      if (!token) throw new Error('Je bent niet ingelogd als admin.')
      return updateOnderhoudOfferte(token, id, {
        klantId: values.klantId,
        typeIds: values.typeIds,
        keepImageIds: values.keepPhotoIds,
        images: values.newPhotos,
      })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['onderhoud-offertes'] })
      closeEditor()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error('Je bent niet ingelogd als admin.')
      return deleteOnderhoudOfferte(token, id)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['onderhoud-offertes'] })
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
    setEditingId(null)
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

  const columns = useMemo<ColumnDef<OnderhoudOfferteOverview>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Naam',
        cell: ({ getValue }) => getValue<string | null>() || '–',
      },
      {
        accessorKey: 'email',
        header: 'E-mail',
        cell: ({ getValue }) => getValue<string | null>() || '–',
      },
      {
        accessorKey: 'city',
        header: 'Woonplaats',
        cell: ({ getValue }) => getValue<string | null>() || '–',
      },
      {
        accessorKey: 'typeNames',
        header: 'Types',
        cell: ({ getValue }) => getValue<string | null>() || '–',
      },
      {
        accessorKey: 'imageCount',
        header: "Foto's",
      },
      {
        accessorKey: 'createdAt',
        header: 'Aangemaakt',
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
              onClick={() => {
                createMutation.reset()
                updateMutation.reset()
                setDiscardOpen(false)
                setEditorDirty(false)
                setEditingId(row.original.id)
                setEditorOpen(true)
              }}
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
    [createMutation, deleteMutation, updateMutation],
  )

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  })

  const saveError = editing ? updateMutation.error : createMutation.error
  const formError = saveError instanceof Error ? saveError.message : null
  const fullName = deleting?.name?.trim() || 'deze offerte'

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-col gap-4 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Heading
          title="Onderhoud-offerte"
          description="Aanvragen gekoppeld aan een klant, met onderhoudtypes en foto's."
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
            Onderhoudoffertes laden…
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
            <p className="text-sm text-destructive">
              {error instanceof Error
                ? error.message
                : 'Kon onderhoudoffertes niet ophalen.'}
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
            emptyMessage="Nog geen onderhoudoffertes."
            titleColumnIds={['name']}
          />
        )}
      </div>

      <Modal
        title={
          editingId ? 'Onderhoudofferte bewerken' : 'Onderhoudofferte toevoegen'
        }
        description="Klant, types en foto's"
        isOpen={editorOpen}
        onClose={requestCloseEditor}
        className="max-h-[90vh] overflow-y-auto p-4 sm:max-w-3xl sm:p-6"
      >
        {token && editingId && detailLoading && !editing ? (
          <p className="py-8 text-center text-sm text-ink/70">Offerte laden…</p>
        ) : token && editingId && (detailError || !editing) ? (
          <p className="py-8 text-center text-sm text-destructive">
            {detailLoadError instanceof Error
              ? detailLoadError.message
              : 'Offerte laden mislukt.'}
          </p>
        ) : token ? (
          <OnderhoudOfferteForm
            key={editing?.id ?? 'create'}
            token={token}
            initial={editing ?? null}
            klanten={klanten}
            types={types}
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
        ) : null}
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
        title="Onderhoudofferte verwijderen"
        description="Bevestig of je deze offerte wilt verwijderen"
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
              Weet je zeker dat je de aanvraag van{' '}
              <span className="font-semibold text-ink">{fullName}</span> wilt
              verwijderen? De foto&apos;s verdwijnen mee.
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
