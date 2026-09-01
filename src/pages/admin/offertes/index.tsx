import { useCallback, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { Pencil, Plus, Trash2 } from 'lucide-react'
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
import { listAircos } from '@/lib/api/aircos'
import { listKlanten } from '@/lib/api/klanten'
import {
  createOfferte,
  deleteOfferte,
  listOffertes,
  offerteAircoLabel,
  offerteKlantNaam,
  updateOfferte,
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

  const openEdit = (offerte: Offerte) => {
    createMutation.reset()
    updateMutation.reset()
    deleteMutation.reset()
    setDiscardOpen(false)
    setEditorDirty(false)
    setEditing(offerte)
    setEditorOpen(true)
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

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  })

  const visibleColumnCount = table.getVisibleLeafColumns().length
  const saveError = editing ? updateMutation.error : createMutation.error
  const formError = saveError instanceof Error ? saveError.message : null
  const label = (offerte: Offerte | null) =>
    offerte ? offerteKlantNaam(offerte) : 'deze offerte'

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-col gap-4 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Heading
          title="Offertes beheer"
          description="Aanvragen gekoppeld aan klant en airco. Het jaarvoordeel wordt bewaard zoals berekend bij de aanvraag."
        />
        <Button type="button" onClick={openCreate} className="gap-2">
          <Plus className="size-4" />
          Toevoegen
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
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
          <div className="overflow-hidden rounded-xl border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="bg-muted/40 hover:bg-muted/40"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
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
                        <TableCell key={cell.id}>
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
