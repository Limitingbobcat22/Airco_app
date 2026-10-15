import { useCallback, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type VisibilityState,
} from '@tanstack/react-table'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { AdminResponsiveTable } from '@/components/shared/admin-responsive-table'
import Heading from '@/components/shared/heading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { MultiSelect } from '@/components/ui/multi-select'
import { useAuth } from '@/hooks/use-auth'
import {
  createOnderhoudOfferteAdmin,
  deleteOnderhoudOfferte,
  getOnderhoudOfferte,
  listOnderhoudOffertes,
  updateOnderhoudOfferte,
  updateOnderhoudOfferteRead,
  type OnderhoudOfferteOverview,
} from '@/lib/api/onderhoud-offertes'
import { listKlanten, type Klant } from '@/lib/api/klanten'
import { listOnderhoudTypes } from '@/lib/api/onderhoud-types'
import { useUnsavedChanges } from '@/providers/unsaved-changes'
import OnderhoudOfferteForm, {
  type OnderhoudOfferteFormValues,
} from './offerte-form'

const dateTime = new Intl.DateTimeFormat('nl-NL', {
  dateStyle: 'short',
  timeStyle: 'short',
})

const COLUMN_PREFS_KEY = 'columnPreferences_admin_onderhoud_offertes_v2'

const DEFAULT_VISIBLE_COLUMN_IDS = [
  'read',
  'name',
  'city',
  'taskNote',
  'typeNames',
  'imageCount',
  'createdAt',
] as const

const EXTRA_COLUMN_IDS = [
  'email',
  'note',
  'phone',
  'street',
  'houseNumber',
  'postalCode',
  'consentContact',
  'consentTerms',
  'updatedAt',
] as const

const ALL_TOGGLEABLE_COLUMN_IDS = [
  ...DEFAULT_VISIBLE_COLUMN_IDS,
  ...EXTRA_COLUMN_IDS,
] as const

function buildDefaultVisibility(columnIds: string[]): VisibilityState {
  const visibility: VisibilityState = {}
  for (const id of columnIds) {
    if (id === 'actions') {
      visibility[id] = true
      continue
    }
    visibility[id] = (DEFAULT_VISIBLE_COLUMN_IDS as readonly string[]).includes(
      id,
    )
  }
  return visibility
}

function loadColumnVisibility(columnIds: string[]): VisibilityState {
  const defaults = buildDefaultVisibility(columnIds)
  try {
    localStorage.removeItem('columnPreferences_admin_onderhoud_offertes')
    const raw = localStorage.getItem(COLUMN_PREFS_KEY)
    if (!raw) return defaults
    const saved = JSON.parse(raw) as VisibilityState
    const merged: VisibilityState = { ...defaults }
    for (const id of columnIds) {
      if (id === 'actions') {
        merged[id] = true
        continue
      }
      if (id in saved) merged[id] = Boolean(saved[id])
    }
    return merged
  } catch {
    return defaults
  }
}

function formatDateTime(value: string | null | undefined) {
  const date = value ? new Date(value) : null
  return date && !Number.isNaN(date.getTime()) ? dateTime.format(date) : '–'
}

function textOrDash(value: string | null | undefined) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : '–'
}

function klantOf(klanten: Klant[], klantId: string | null) {
  if (!klantId) return undefined
  return klanten.find((klant) => klant.id === klantId)
}

function yesNo(value: boolean | null | undefined) {
  if (value == null) return '–'
  return value ? 'Ja' : 'Nee'
}

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
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<OnderhoudOfferteOverview | null>(null)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => loadColumnVisibility([...ALL_TOGGLEABLE_COLUMN_IDS, 'actions']),
  )
  const [columnPrefsReady, setColumnPrefsReady] = useState(false)
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
    setSelectedRowId(null)
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
        taskNote: values.taskNote,
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
        taskNote: values.taskNote,
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

  const markReadMutation = useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error('Je bent niet ingelogd als admin.')
      return updateOnderhoudOfferteRead(token, id, true)
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['onderhoud-offertes'] })
      const previous = queryClient.getQueryData<OnderhoudOfferteOverview[]>([
        'onderhoud-offertes',
      ])
      const markRead = (current: OnderhoudOfferteOverview[] | undefined) =>
        current?.map((row) => (row.id === id ? { ...row, read: true } : row))
      queryClient.setQueryData(['onderhoud-offertes'], markRead(previous))
      setRows((current) => markRead(current) ?? current)
      return { previous }
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['onderhoud-offertes'], context.previous)
        setRows(context.previous)
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['onderhoud-offertes'] })
    },
  })

  useEffect(() => {
    if (remoteRows) setRows(remoteRows)
  }, [remoteRows])

  useEffect(() => {
    setColumnPrefsReady(true)
  }, [])

  const openCreate = () => {
    createMutation.reset()
    updateMutation.reset()
    setDiscardOpen(false)
    setEditorDirty(false)
    setSelectedRowId(null)
    setEditingId(null)
    setEditorOpen(true)
  }

  const openEdit = useCallback(
    (item: OnderhoudOfferteOverview) => {
      createMutation.reset()
      updateMutation.reset()
      setDiscardOpen(false)
      setEditorDirty(false)
      setSelectedRowId(item.id)
      setEditingId(item.id)
      setEditorOpen(true)
      if (!item.read) {
        markReadMutation.mutate(item.id)
      }
    },
    [createMutation, markReadMutation, updateMutation],
  )

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
        accessorKey: 'read',
        header: 'Status',
        cell: ({ getValue }) => {
          const read = getValue<boolean>()
          return read ? (
            <Badge variant="secondary">Gelezen</Badge>
          ) : (
            <Badge>Nieuw</Badge>
          )
        },
      },
      {
        accessorKey: 'name',
        header: 'Naam',
        cell: ({ getValue }) => getValue<string | null>() || '–',
      },
      {
        accessorKey: 'email',
        header: 'E-mail',
        cell: ({ getValue }) => textOrDash(getValue<string | null>()),
      },
      {
        accessorKey: 'phone',
        header: 'Telefoon',
        cell: ({ getValue }) => textOrDash(getValue<string | null>()),
      },
      {
        id: 'street',
        header: 'Straat',
        accessorFn: (row) => klantOf(klanten, row.klantId)?.street,
        cell: ({ getValue }) => textOrDash(getValue<string | null>()),
      },
      {
        id: 'houseNumber',
        header: 'Huisnummer',
        accessorFn: (row) => klantOf(klanten, row.klantId)?.houseNumber,
        cell: ({ getValue }) => textOrDash(getValue<string | null>()),
      },
      {
        accessorKey: 'city',
        header: 'Woonplaats',
        cell: ({ getValue }) => textOrDash(getValue<string | null>()),
      },
      {
        id: 'postalCode',
        header: 'Postcode',
        accessorFn: (row) => klantOf(klanten, row.klantId)?.postalCode,
        cell: ({ getValue }) => textOrDash(getValue<string | null>()),
      },
      {
        id: 'note',
        header: 'Opmerking',
        cell: ({ row }) => {
          const value = klantOf(klanten, row.original.klantId)?.note?.trim()
          if (!value) return '–'
          return (
            <span className="line-clamp-2 max-w-xs whitespace-pre-wrap" title={value}>
              {value}
            </span>
          )
        },
      },
      {
        id: 'consentContact',
        header: 'Contact',
        accessorFn: (row) => klantOf(klanten, row.klantId)?.consentContact ?? null,
        cell: ({ getValue }) => yesNo(getValue<boolean | null>()),
      },
      {
        id: 'consentTerms',
        header: 'Voorwaarden',
        accessorFn: (row) => klantOf(klanten, row.klantId)?.consentTerms ?? null,
        cell: ({ getValue }) => yesNo(getValue<boolean | null>()),
      },
      {
        accessorKey: 'taskNote',
        header: 'Toelichting',
        cell: ({ getValue }) => {
          const value = getValue<string | null>()?.trim()
          if (!value) return '–'
          return (
            <span className="line-clamp-2 max-w-xs whitespace-pre-wrap" title={value}>
              {value}
            </span>
          )
        },
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
        cell: ({ getValue }) => formatDateTime(getValue<string>()),
      },
      {
        accessorKey: 'updatedAt',
        header: 'Gewijzigd',
        cell: ({ getValue }) => formatDateTime(getValue<string>()),
      },
      {
        id: 'actions',
        header: 'Acties',
        enableHiding: false,
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
    [deleteMutation, klanten, openEdit],
  )

  const selectableColumnIds = useMemo(
    () =>
      columns
        .map((column) => {
          if (column.id === 'actions') return null
          if (column.id) return column.id
          if (
            'accessorKey' in column &&
            typeof column.accessorKey === 'string'
          ) {
            return column.accessorKey
          }
          return null
        })
        .filter((id): id is string => Boolean(id)),
    [columns],
  )

  const columnOptions = useMemo(
    () =>
      selectableColumnIds.map((id) => {
        const column = columns.find((item) => {
          if (item.id === id) return true
          return (
            'accessorKey' in item &&
            typeof item.accessorKey === 'string' &&
            item.accessorKey === id
          )
        })
        const header = typeof column?.header === 'string' ? column.header : id
        return { value: id, label: header }
      }),
    [columns, selectableColumnIds],
  )

  useEffect(() => {
    if (!columnPrefsReady) return
    localStorage.setItem(COLUMN_PREFS_KEY, JSON.stringify(columnVisibility))
  }, [columnVisibility, columnPrefsReady])

  const resetColumnVisibility = () => {
    localStorage.removeItem(COLUMN_PREFS_KEY)
    setColumnVisibility(
      buildDefaultVisibility([...selectableColumnIds, 'actions']),
    )
  }

  const handleColumnVisibilityChange = (selectedColumns: string[]) => {
    const next: VisibilityState = { actions: true }
    for (const id of selectableColumnIds) {
      next[id] = selectedColumns.includes(id)
    }
    setColumnVisibility(next)
  }

  const visibleColumns = Object.keys(columnVisibility).filter(
    (key) => columnVisibility[key] && key !== 'actions',
  )

  const table = useReactTable({
    data: rows,
    columns,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  })

  const unreadCount = rows.filter((row) => !row.read).length
  const saveError = editing ? updateMutation.error : createMutation.error
  const formError = saveError instanceof Error ? saveError.message : null
  const fullName = deleting?.name?.trim() || 'deze offerte'

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-col gap-4 border-b px-4 py-4 xl:px-6">
        <Heading
          title="Onderhoud-offerte"
          description={
            unreadCount > 0
              ? `${unreadCount} ongelezen aanvraag${unreadCount === 1 ? '' : 'en'}. Aanvragen gekoppeld aan een klant, met onderhoudtypes en foto's.`
              : "Aanvragen gekoppeld aan een klant, met onderhoudtypes en foto's."
          }
        />
        <div className="flex w-full flex-col items-stretch gap-3 xl:flex-row xl:items-center">
          <span className="shrink-0 text-sm font-medium">Kolommen:</span>
          <MultiSelect
            value={visibleColumns}
            options={columnOptions}
            onValueChange={handleColumnVisibilityChange}
            onClear={resetColumnVisibility}
            placeholder="Selecteer kolommen"
            variant="inverted"
            className="w-full xl:min-w-0 xl:flex-1"
          />
          <Button
            type="button"
            onClick={openCreate}
            className="w-full gap-2 bg-sky-400 text-white shadow hover:bg-sky-500 xl:w-auto"
          >
            <Plus className="size-4" />
            Toevoegen
          </Button>
        </div>
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
            selectedRowId={selectedRowId}
            onRowClick={(row) => openEdit(row.original)}
            getRowClassName={(row) =>
              row.original.read ? undefined : 'bg-teal/5 font-medium'
            }
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
