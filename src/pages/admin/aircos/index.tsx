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
import { createAirco, deleteAirco, deleteAircoImage, listAircos, updateAirco, uploadAircoImage } from '@/lib/api/aircos'
import type { Airco } from '@/pages/airco/data/aircos'
import type { PendingAircoImage } from '@/pages/airco/data/airco-photos'
import { useUnsavedChanges } from '@/providers/unsaved-changes'
import AircoAdminCreate from './admin-airco-forms/airco-admin-create'
import AircoAdminEdit from './admin-airco-forms/airco-admin-edit'
import {
  EMPTY_AIRCO_FORM,
  aircoToFormValues,
  toCreatePayload,
  toUpdatePayload,
  type AircoFormValues,
} from './admin-airco-forms/airco-form-values'

const COLUMN_PREFS_KEY = 'columnPreferences_admin_aircos'

const DEFAULT_VISIBLE_COLUMN_IDS = [
  'brand',
  'model',
  'coolingKw',
  'heatingKw',
  'priceEur',
] as const

const EXTRA_COLUMN_IDS = [
  'tag',
  'unitType',
  'productFunction',
  'roomM2',
  'seer',
  'scop',
  'energyClassCooling',
  'energyClassHeating',
  'noiseDbaInside',
  'noiseDbaOutside',
  'netSizeInside',
  'netSizeOutside',
  'refrigerant',
] as const

const ALL_TOGGLEABLE_COLUMN_IDS = [
  ...DEFAULT_VISIBLE_COLUMN_IDS,
  ...EXTRA_COLUMN_IDS,
] as const

const eur = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 2,
})

function buildDefaultVisibility(
  columnIds: string[],
): VisibilityState {
  const visibility: VisibilityState = {}
  for (const id of columnIds) {
    if (id === 'actions') {
      visibility[id] = true
      continue
    }
    visibility[id] =
      (DEFAULT_VISIBLE_COLUMN_IDS as readonly string[]).includes(id)
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

export default function AdminAircosPage() {
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
    queryKey: ['aircos'],
    queryFn: listAircos,
  })

  const [rows, setRows] = useState<Airco[]>([])
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorDirty, setEditorDirty] = useState(false)
  const [discardOpen, setDiscardOpen] = useState(false)
  const [editing, setEditing] = useState<Airco | null>(null)
  const [deleting, setDeleting] = useState<Airco | null>(null)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () =>
      loadColumnVisibility([...ALL_TOGGLEABLE_COLUMN_IDS, 'actions']),
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
    mutationFn: async ({
      values,
      images,
    }: {
      values: AircoFormValues
      images: PendingAircoImage[]
    }) => {
      if (!token) {
        throw new Error('Je bent niet ingelogd als admin.')
      }
      const created = await createAirco(token, toCreatePayload(values))
      try {
        for (const image of images) {
          await uploadAircoImage(token, created.id, image.file, {
            sortOrder: image.sortOrder,
            label: image.label,
          })
        }
      } catch (error) {
        void queryClient.invalidateQueries({ queryKey: ['aircos'] })
        const reason =
          error instanceof Error ? error.message : 'Foto uploaden mislukt'
        throw new Error(
          `Airco is aangemaakt, maar niet alle foto’s zijn geüpload (${reason}). Sluit dit venster en bewerk het model; opnieuw toevoegen maakt een tweede airco.`,
        )
      }
      return created
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['aircos'] })
      closeEditor()
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      values,
      images,
      removedIds,
    }: {
      id: string
      values: AircoFormValues
      images: PendingAircoImage[]
      removedIds: string[]
    }) => {
      if (!token) {
        throw new Error('Je bent niet ingelogd als admin.')
      }
      const updated = await updateAirco(token, id, toUpdatePayload(values))
      try {
        for (const image of images) {
          await uploadAircoImage(token, id, image.file, {
            sortOrder: image.sortOrder,
            label: image.label,
          })
        }
        for (const imageId of removedIds) {
          await deleteAircoImage(token, id, imageId)
        }
      } catch (error) {
        void queryClient.invalidateQueries({ queryKey: ['aircos'] })
        const reason =
          error instanceof Error ? error.message : 'Foto bijwerken mislukt'
        throw new Error(
          `Gegevens zijn opgeslagen, maar niet alle foto’s zijn bijgewerkt (${reason}).`,
        )
      }
      return updated
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['aircos'] })
      closeEditor()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      if (!token) {
        throw new Error('Je bent niet ingelogd als admin.')
      }
      return deleteAirco(token, id)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['aircos'] })
      closeDelete()
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

  const openEdit = (airco: Airco) => {
    createMutation.reset()
    updateMutation.reset()
    deleteMutation.reset()
    setDiscardOpen(false)
    setEditorDirty(false)
    setEditing(airco)
    setEditorOpen(true)
  }

  const openDelete = (airco: Airco) => {
    deleteMutation.reset()
    setDeleting(airco)
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

  const columns = useMemo<ColumnDef<Airco>[]>(
    () => [
      {
        accessorKey: 'brand',
        header: 'Merk',
      },
      {
        accessorKey: 'model',
        header: 'Model',
      },
      {
        accessorKey: 'coolingKw',
        header: 'Koel vermogen (kW)',
        cell: ({ getValue }) => Number(getValue<number>()).toFixed(1),
      },
      {
        accessorKey: 'heatingKw',
        header: 'Verwarm vermogen (kW)',
        cell: ({ getValue }) => Number(getValue<number>()).toFixed(1),
      },
      {
        accessorKey: 'priceEur',
        header: 'Prijs',
        cell: ({ getValue }) => eur.format(getValue<number>()),
      },
      {
        accessorKey: 'tag',
        header: 'Tag',
      },
      {
        accessorKey: 'unitType',
        header: 'Type',
      },
      {
        accessorKey: 'productFunction',
        header: 'Functie',
      },
      {
        accessorKey: 'roomM2',
        header: 'Ruimte',
      },
      {
        accessorKey: 'seer',
        header: 'SEER',
        cell: ({ getValue }) => Number(getValue<number>()).toFixed(2),
      },
      {
        accessorKey: 'scop',
        header: 'SCOP',
        cell: ({ getValue }) => Number(getValue<number>()).toFixed(2),
      },
      {
        accessorKey: 'energyClassCooling',
        header: 'Label koelen',
      },
      {
        accessorKey: 'energyClassHeating',
        header: 'Label verwarmen',
      },
      {
        accessorKey: 'noiseDbaInside',
        header: 'Geluid binnen',
        cell: ({ getValue }) => `${getValue<number>()} dB(A)`,
      },
      {
        accessorKey: 'noiseDbaOutside',
        header: 'Geluid buiten',
        cell: ({ getValue }) => `${getValue<number>()} dB(A)`,
      },
      {
        accessorKey: 'netSizeInside',
        header: 'Afmeting binnen',
      },
      {
        accessorKey: 'netSizeOutside',
        header: 'Afmeting buiten',
      },
      {
        accessorKey: 'refrigerant',
        header: 'Koudemiddel',
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
          if ('accessorKey' in column && typeof column.accessorKey === 'string') {
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
        const header =
          typeof column?.header === 'string' ? column.header : id
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

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-col gap-4 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Heading
          title="Aircos beheer"
          description="Airco-modellen uit de API. Standaard 5 kolommen; voeg er meer toe via Kolommen."
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

      <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
        {isLoading ? (
          <div className="text-muted-foreground rounded-xl border p-8 text-center text-sm">
            Aircos laden…
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
            <p className="text-sm text-destructive">
              {error instanceof Error
                ? error.message
                : 'Kon aircos niet ophalen.'}
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
                      Geen aircos gevonden.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Modal
        title={editing ? 'Airco bewerken' : 'Airco toevoegen'}
        description="Vul de gegevens van de airco in."
        isOpen={editorOpen}
        onClose={requestCloseEditor}
        className="max-h-[90vh] overflow-y-auto !max-w-[min(96rem,95vw)] p-4 sm:p-6"
      >
        {editing ? (
          <AircoAdminEdit
            key={editing.id}
            aircoId={editing.id}
            initialValues={aircoToFormValues(editing)}
            initialImages={editing.images ?? []}
            submitting={updateMutation.isPending}
            error={
              updateMutation.error instanceof Error
                ? updateMutation.error.message
                : null
            }
            onSubmit={(values, images, removedIds) =>
              updateMutation.mutate({
                id: editing.id,
                values,
                images,
                removedIds,
              })
            }
            onAircoUpdated={setEditing}
            onDirtyChange={handleEditorDirtyChange}
            onCancel={requestCloseEditor}
          />
        ) : (
          <AircoAdminCreate
            key="create"
            initialValues={EMPTY_AIRCO_FORM}
            submitting={createMutation.isPending}
            error={
              createMutation.error instanceof Error
                ? createMutation.error.message
                : null
            }
            onSubmit={(values, images) =>
              createMutation.mutate({ values, images })
            }
            onDirtyChange={handleEditorDirtyChange}
            onCancel={requestCloseEditor}
          />
        )}
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
        title="Airco verwijderen"
        description="Bevestig of je deze airco wilt verwijderen"
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
                {deleting
                  ? `${deleting.brand} ${deleting.model}`
                  : 'deze airco'}
              </span>{' '}
              wilt verwijderen? Alle foto’s van dit model verdwijnen
              mee.
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
