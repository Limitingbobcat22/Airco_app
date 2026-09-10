import { useCallback, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type VisibilityState,
} from '@tanstack/react-table'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import Heading from '@/components/shared/heading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { MultiSelect } from '@/components/ui/multi-select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuth } from '@/hooks/use-auth'
import { listAircos } from '@/lib/api/aircos'
import { listKlanten } from '@/lib/api/klanten'
import {
  createOfferte,
  deleteOfferte,
  listOffertes,
  offerteAircoLabel,
  offerteKlantNaam,
  updateOfferte,
  updateOfferteRead,
  type CreateOfferteInput,
  type Offerte,
} from '@/lib/api/offertes'
import { useUnsavedChanges } from '@/providers/unsaved-changes'
import OfferteAdminForm from './offerte-admin-form'

const dateTime = new Intl.DateTimeFormat('nl-NL', {
  dateStyle: 'short',
  timeStyle: 'short',
})

const eur = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

const eurExact = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const COLUMN_PREFS_KEY = 'columnPreferences_admin_offertes'

const DEFAULT_VISIBLE_COLUMN_IDS = [
  'read',
  'name',
  'email',
  'airco',
  'netEuroSavedYearly',
  'createdAt',
] as const

const EXTRA_COLUMN_IDS = [
  'coolingKw',
  'areaM2',
  'heightM',
  'heatingSharePct',
  'requiredKw',
  'yearlyGasM3',
  'gasPriceEur',
  'elecPriceEur',
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

export default function AdminOffertesPage() {
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
    queryKey: ['offertes'],
    queryFn: () => {
      if (!token) throw new Error('Je bent niet ingelogd als admin.')
      return listOffertes(token)
    },
    enabled: Boolean(token),
  })

  const { data: klanten = [] } = useQuery({
    queryKey: ['klanten'],
    queryFn: () => {
      if (!token) throw new Error('Je bent niet ingelogd als admin.')
      return listKlanten(token)
    },
    enabled: Boolean(token),
  })

  const { data: aircos = [] } = useQuery({
    queryKey: ['aircos'],
    queryFn: listAircos,
  })

  const [rows, setRows] = useState<Offerte[]>([])
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorDirty, setEditorDirty] = useState(false)
  const [discardOpen, setDiscardOpen] = useState(false)
  const [editing, setEditing] = useState<Offerte | null>(null)
  const [deleting, setDeleting] = useState<Offerte | null>(null)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => loadColumnVisibility([...ALL_TOGGLEABLE_COLUMN_IDS, 'actions']),
  )
  const [columnPrefsReady, setColumnPrefsReady] = useState(false)

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
    mutationFn: (payload: CreateOfferteInput) => {
      if (!token) throw new Error('Je bent niet ingelogd als admin.')
      return createOfferte(token, payload)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['offertes'] })
      closeEditor()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: CreateOfferteInput
    }) => {
      if (!token) throw new Error('Je bent niet ingelogd als admin.')
      return updateOfferte(token, id, payload)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['offertes'] })
      closeEditor()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error('Je bent niet ingelogd als admin.')
      return deleteOfferte(token, id)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['offertes'] })
      closeDelete()
    },
  })

  const markReadMutation = useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error('Je bent niet ingelogd als admin.')
      return updateOfferteRead(token, id, true)
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['offertes'] })
      const previous = queryClient.getQueryData<Offerte[]>(['offertes'])
      const markRead = (rows: Offerte[] | undefined) =>
        rows?.map((row) => (row.id === id ? { ...row, read: true } : row))
      queryClient.setQueryData(['offertes'], markRead(previous))
      setRows((current) => markRead(current) ?? current)
      return { previous }
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['offertes'], context.previous)
        setRows(context.previous)
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['offertes'] })
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
    deleteMutation.reset()
    setDiscardOpen(false)
    setEditorDirty(false)
    setEditing(null)
    setEditorOpen(true)
  }

  const openEdit = (offerte: Offerte) => {
    createMutation.reset()
    updateMutation.reset()
    deleteMutation.reset()
    setDiscardOpen(false)
    setEditorDirty(false)
    setEditing(offerte)
    setEditorOpen(true)
    if (!offerte.read) {
      markReadMutation.mutate(offerte.id)
    }
  }

  const openDelete = (offerte: Offerte) => {
    deleteMutation.reset()
    setDeleting(offerte)
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

  const columns = useMemo<ColumnDef<Offerte>[]>(
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
        id: 'name',
        header: 'Klant',
        accessorFn: (row) => offerteKlantNaam(row),
      },
      {
        id: 'email',
        header: 'E-mail',
        accessorFn: (row) => row.klant?.email ?? '–',
      },
      {
        id: 'airco',
        header: 'Airco',
        accessorFn: (row) => offerteAircoLabel(row),
      },
      {
        id: 'coolingKw',
        header: 'Koel vermogen',
        accessorFn: (row) => row.airco?.coolingKw ?? null,
        cell: ({ getValue }) => {
          const value = getValue<number | null>()
          return value == null ? '–' : `${Number(value).toFixed(1)} kW`
        },
      },
      {
        accessorKey: 'areaM2',
        header: 'Oppervlakte',
        cell: ({ getValue }) => {
          const value = getValue<number | null>()
          return value == null ? '–' : `${Number(value)} m²`
        },
      },
      {
        accessorKey: 'heightM',
        header: 'Hoogte',
        cell: ({ getValue }) => {
          const value = getValue<number | null>()
          return value == null ? '–' : `${Number(value).toFixed(1)} m`
        },
      },
      {
        accessorKey: 'heatingSharePct',
        header: 'Aandeel airco',
        cell: ({ getValue }) => {
          const value = getValue<number | null>()
          return value == null ? '–' : `${Number(value)}%`
        },
      },
      {
        accessorKey: 'requiredKw',
        header: 'Aanbevolen vermogen',
        cell: ({ getValue }) => {
          const value = getValue<number | null>()
          return value == null ? '–' : `${Number(value).toFixed(1)} kW`
        },
      },
      {
        accessorKey: 'yearlyGasM3',
        header: 'Gasverbruik',
        cell: ({ getValue }) => {
          const value = getValue<number | null>()
          return value == null ? '–' : `${Number(value)} m³`
        },
      },
      {
        accessorKey: 'gasPriceEur',
        header: 'Gasprijs',
        cell: ({ getValue }) => {
          const value = getValue<number | null>()
          return value == null ? '–' : `${eurExact.format(value)}/m³`
        },
      },
      {
        accessorKey: 'elecPriceEur',
        header: 'Stroomprijs',
        cell: ({ getValue }) => {
          const value = getValue<number | null>()
          return value == null ? '–' : `${eurExact.format(value)}/kWh`
        },
      },
      {
        accessorKey: 'netEuroSavedYearly',
        header: 'Voordeel / jaar',
        cell: ({ getValue }) => {
          const value = getValue<number | null>()
          return value == null ? '–' : eur.format(value)
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Aangevraagd',
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

  const visibleColumnCount = table.getVisibleLeafColumns().length
  const unreadCount = rows.filter((row) => !row.read).length
  const saveError = editing ? updateMutation.error : createMutation.error
  const formError = saveError instanceof Error ? saveError.message : null
  const label = (offerte: Offerte | null) =>
    offerte ? offerteKlantNaam(offerte) : 'deze offerte'

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-col gap-4 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Heading
          title="Offertes beheer"
          description={
            unreadCount > 0
              ? `${unreadCount} ongelezen aanvraag${unreadCount === 1 ? '' : 'en'}. Aanvragen gekoppeld aan klant en airco.`
              : 'Aanvragen gekoppeld aan klant en airco. Het jaarvoordeel wordt bewaard zoals berekend bij de aanvraag.'
          }
        />
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:min-w-[36rem] sm:max-w-4xl sm:justify-end">
          <span className="shrink-0 text-sm font-medium">Kolommen:</span>
          <MultiSelect
            value={visibleColumns}
            options={columnOptions}
            onValueChange={handleColumnVisibilityChange}
            onClear={resetColumnVisibility}
            placeholder="Selecteer kolommen"
            variant="inverted"
            className="min-w-[20rem] flex-1 sm:min-w-[32rem]"
          />
          <Button type="button" onClick={openCreate} className="shrink-0 gap-2">
            <Plus className="size-4" />
            Toevoegen
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden p-4 sm:p-6">
        {isLoading ? (
          <div className="text-muted-foreground rounded-xl border p-8 text-center text-sm">
            Offertes laden…
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
            <p className="text-sm text-destructive">
              {error instanceof Error
                ? error.message
                : 'Kon offertes niet ophalen.'}
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
                    <TableRow
                      key={row.id}
                      className={
                        row.original.read
                          ? undefined
                          : 'bg-teal/5 font-medium'
                      }
                    >
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
                      Nog geen offertes.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Modal
        title={editing ? 'Offerte bewerken' : 'Offerte toevoegen'}
        description="Koppel klant en airco; jaarvoordeel is de berekende waarde"
        isOpen={editorOpen}
        onClose={requestCloseEditor}
        className="max-h-[90vh] overflow-y-auto md:max-w-[720px] p-4 sm:p-6"
      >
        <OfferteAdminForm
          key={editing?.id ?? 'create'}
          initial={editing}
          klanten={klanten}
          aircos={aircos}
          submitting={
            editing ? updateMutation.isPending : createMutation.isPending
          }
          error={formError}
          onSubmit={(payload) => {
            if (editing) {
              updateMutation.mutate({ id: editing.id, payload })
              return
            }
            createMutation.mutate(payload)
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
        title="Offerte verwijderen"
        description="Bevestig of je deze offerte wilt verwijderen"
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
              Weet je zeker dat je de offerte van{' '}
              <span className="font-semibold text-ink">{label(deleting)}</span>{' '}
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
    </div>
  )
}
