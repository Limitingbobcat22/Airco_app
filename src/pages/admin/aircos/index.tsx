import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
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
import { listAircos } from '@/lib/api/aircos'
import type { Airco } from '@/pages/airco/data/aircos'
import AircoAdminForm, {
  type AircoFormValues,
} from './components/airco-admin-form'

const COLUMN_PREFS_KEY = 'columnPreferences_admin_aircos'

const DEFAULT_VISIBLE_COLUMN_IDS = [
  'brand',
  'series',
  'model',
  'coolingKw',
  'heatingKw',
  'priceEur',
] as const

const EXTRA_COLUMN_IDS = [
  'tag',
  'slug',
  'unitType',
  'productFunction',
  'roomM2',
  'seer',
  'scop',
  'energyClassCooling',
  'energyClassHeating',
  'noiseSilentDba',
  'refrigerant',
] as const

const ALL_TOGGLEABLE_COLUMN_IDS = [
  ...DEFAULT_VISIBLE_COLUMN_IDS,
  ...EXTRA_COLUMN_IDS,
] as const

const eur = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

function slugify(brand: string, series: string) {
  return `${brand}-${series}-${Date.now()}`
    .toLowerCase()
    .replace(/\s+/g, '-')
}

function createEmptyAirco(values: AircoFormValues): Airco {
  const slug = slugify(values.brand, values.series)

  return {
    id: crypto.randomUUID(),
    slug,
    brand: values.brand,
    series: values.series,
    model: values.model,
    unitType: `${values.model} (split)`,
    tag: values.tag,
    description: values.description || 'Nog geen beschrijving.',
    productFunction: 'Koelen en verwarmen',
    trustPoints: [
      'Inclusief standaard montage',
      'F-gassen-gecertificeerde monteur',
    ],
    coolingKw: values.coolingKw,
    heatingKw: values.heatingKw,
    seer: 8,
    scop: 4.5,
    energyClassCooling: 'A++',
    energyClassHeating: 'A++',
    noiseSilentDba: 20,
    refrigerant: 'R32',
    roomM2: values.roomM2,
    heatingCoverage: 0.55,
    priceEur: values.priceEur,
    accent: '#005A9C',
    images: [],
  }
}

function toFormValues(airco: Airco): AircoFormValues {
  return {
    brand: airco.brand,
    series: airco.series,
    model: airco.model,
    tag: airco.tag,
    description: airco.description,
    coolingKw: airco.coolingKw,
    heatingKw: airco.heatingKw,
    roomM2: airco.roomM2,
    priceEur: airco.priceEur,
  }
}

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
  const [editing, setEditing] = useState<Airco | null>(null)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () =>
      loadColumnVisibility([...ALL_TOGGLEABLE_COLUMN_IDS, 'actions']),
  )
  const [columnPrefsReady, setColumnPrefsReady] = useState(false)

  useEffect(() => {
    if (remoteRows) setRows(remoteRows)
  }, [remoteRows])

  useEffect(() => {
    setColumnPrefsReady(true)
  }, [])

  const openCreate = () => {
    setEditing(null)
    setEditorOpen(true)
  }

  const openEdit = (airco: Airco) => {
    setEditing(airco)
    setEditorOpen(true)
  }

  const closeEditor = () => {
    setEditorOpen(false)
    setEditing(null)
  }

  const handleSave = (values: AircoFormValues) => {
    if (editing) {
      setRows((prev) =>
        prev.map((row) =>
          row.id === editing.id
            ? {
                ...row,
                ...values,
                unitType: `${values.model} (split)`,
              }
            : row,
        ),
      )
    } else {
      setRows((prev) => [...prev, createEmptyAirco(values)])
    }
    closeEditor()
  }

  const handleDelete = (airco: Airco) => {
    const confirmed = window.confirm(
      `Weet je zeker dat je “${airco.brand} ${airco.series}” wilt verwijderen?`,
    )
    if (!confirmed) return
    setRows((prev) => prev.filter((row) => row.id !== airco.id))
  }

  const columns = useMemo<ColumnDef<Airco>[]>(
    () => [
      {
        accessorKey: 'brand',
        header: 'Merk',
      },
      {
        accessorKey: 'series',
        header: 'Serie',
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
        accessorKey: 'slug',
        header: 'Slug',
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
        accessorKey: 'noiseSilentDba',
        header: 'Geluidsniveau',
        cell: ({ getValue }) => `${getValue<number>()} dB(A)`,
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
              onClick={() => handleDelete(row.original)}
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
          description="Airco-modellen uit de API. Standaard 6 kolommen; voeg er meer toe via Kolommen."
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
        description="Vul de basisgegevens van de airco in."
        isOpen={editorOpen}
        onClose={closeEditor}
        className="max-h-[90vh] overflow-y-auto sm:max-w-lg"
      >
        <AircoAdminForm
          key={editing?.id ?? 'create'}
          initialValues={
            editing
              ? toFormValues(editing)
              : {
                  brand: '',
                  series: '',
                  model: '',
                  tag: '',
                  description: '',
                  coolingKw: 6.2,
                  heatingKw: 4,
                  roomM2: 'tot 40 m²',
                  priceEur: 2000,
                }
          }
          submitLabel={editing ? 'Opslaan' : 'Toevoegen'}
          onSubmit={handleSave}
          onCancel={closeEditor}
        />
      </Modal>
    </div>
  )
}
