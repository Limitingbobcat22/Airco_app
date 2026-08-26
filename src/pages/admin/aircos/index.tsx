import { useMemo, useState } from 'react'
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
import { AIRCOS, type Airco } from '@/pages/airco/data/aircos'
import AircoAdminForm, {
  type AircoFormValues,
} from './components/airco-admin-form'

const eur = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

function createEmptyAirco(values: AircoFormValues): Airco {
  const id = `${values.brand}-${values.series}-${Date.now()}`
    .toLowerCase()
    .replace(/\s+/g, '-')

  return {
    id,
    brand: values.brand,
    series: values.series,
    model: values.model,
    tag: values.tag,
    description: values.description || 'Nog geen beschrijving.',
    features: [],
    coolingKwMin: values.coolingKwMin,
    coolingKwMax: values.coolingKwMax,
    heatingKw: values.heatingKw,
    seer: 8,
    scop: 4.5,
    energyClassCooling: 'A++',
    energyClassHeating: 'A++',
    noiseSilentDba: 20,
    minTempC: -15,
    refrigerant: 'R32',
    roomM2: values.roomM2,
    heatingCoverage: 0.55,
    priceEur: values.priceEur,
    accent: '#005A9C',
  }
}

function toFormValues(airco: Airco): AircoFormValues {
  return {
    brand: airco.brand,
    series: airco.series,
    model: airco.model,
    tag: airco.tag,
    description: airco.description,
    coolingKwMin: airco.coolingKwMin,
    coolingKwMax: airco.coolingKwMax,
    heatingKw: airco.heatingKw,
    roomM2: airco.roomM2,
    priceEur: airco.priceEur,
  }
}

export default function AdminAircosPage() {
  const [rows, setRows] = useState<Airco[]>(() =>
    AIRCOS.map((item) => ({ ...item })),
  )
  const [editorOpen, setEditorOpen] = useState(false)
  const [editing, setEditing] = useState<Airco | null>(null)

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
        id: 'coolingRange',
        header: 'Koelen (kW)',
        cell: ({ row }) =>
          `${row.original.coolingKwMin.toFixed(1)} – ${row.original.coolingKwMax.toFixed(1)}`,
      },
      {
        accessorKey: 'heatingKw',
        header: 'Verwarmen (kW)',
        cell: ({ getValue }) => Number(getValue<number>()).toFixed(1),
      },
      {
        accessorKey: 'priceEur',
        header: 'Prijs',
        cell: ({ getValue }) => eur.format(getValue<number>()),
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

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  })

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-start justify-between gap-4 border-b px-4 py-4 sm:px-6">
        <Heading
          title="Aircos beheer"
          description="Beheer airco-modellen (lokaal, nog zonder API)."
        />
        <Button type="button" onClick={openCreate} className="shrink-0 gap-2">
          <Plus className="size-4" />
          Toevoegen
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-muted/40 hover:bg-muted/40">
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
                    colSpan={columns.length}
                    className="text-muted-foreground h-24 text-center"
                  >
                    Geen aircos gevonden.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
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
                  coolingKwMin: 2.7,
                  coolingKwMax: 6.2,
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
