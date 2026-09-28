import { flexRender, type Cell, type Row, type Table as ReactTable } from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

type AdminResponsiveTableProps<TData> = {
  table: ReactTable<TData>
  emptyMessage: string
  /** Kolommen die samen de kaarttitel vormen. Ontbreekt er een, dan valt de titel terug op de eerste zichtbare kolom. */
  titleColumnIds?: string[]
  getRowClassName?: (row: Row<TData>) => string | undefined
}

function columnHeaderLabel(column: { id: string; columnDef: { header?: unknown } }) {
  return typeof column.columnDef.header === 'string'
    ? column.columnDef.header
    : column.id
}

function partitionRowCells<TData>(
  row: Row<TData>,
  titleColumnIds?: string[],
) {
  const cells = row.getVisibleCells()
  const actionCells = cells.filter((cell) => cell.column.id === 'actions')
  const statusCell = cells.find((cell) => cell.column.id === 'read')
  const dataCells = cells.filter(
    (cell) => cell.column.id !== 'actions' && cell.column.id !== 'read',
  )

  const preferredTitle = (titleColumnIds ?? [])
    .map((id) => dataCells.find((cell) => cell.column.id === id))
    .filter((cell): cell is Cell<TData, unknown> => Boolean(cell))

  const titleCells = preferredTitle.length > 0 ? preferredTitle : dataCells.slice(0, 1)
  const titleIds = new Set(titleCells.map((cell) => cell.column.id))
  const detailCells = dataCells.filter((cell) => !titleIds.has(cell.column.id))

  return { actionCells, statusCell, titleCells, detailCells }
}

export function AdminResponsiveTable<TData>({
  table,
  emptyMessage,
  titleColumnIds,
  getRowClassName,
}: AdminResponsiveTableProps<TData>) {
  const rows = table.getRowModel().rows
  const visibleColumnCount = table.getVisibleLeafColumns().length

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto xl:hidden">
        {rows.length ? (
          rows.map((row) => {
            const { actionCells, statusCell, titleCells, detailCells } =
              partitionRowCells(row, titleColumnIds)

            return (
              <article
                key={row.id}
                className={cn(
                  'rounded-xl border bg-white p-4 shadow-sm',
                  getRowClassName?.(row),
                )}
              >
                {titleCells.length || statusCell ? (
                  <div className="flex items-start justify-between gap-3">
                    {titleCells.length ? (
                      <h3 className="min-w-0 text-base font-semibold leading-snug break-words text-ink">
                        {titleCells.map((cell, index) => (
                          <span key={cell.id}>
                            {index > 0 ? ' ' : null}
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </span>
                        ))}
                      </h3>
                    ) : (
                      <span />
                    )}
                    {statusCell ? (
                      <div className="shrink-0">
                        {flexRender(
                          statusCell.column.columnDef.cell,
                          statusCell.getContext(),
                        )}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {detailCells.length ? (
                  <dl
                    className={cn(
                      'divide-y divide-border',
                      titleCells.length || statusCell ? 'mt-3' : undefined,
                    )}
                  >
                    {detailCells.map((cell) => (
                      <div
                        key={cell.id}
                        className="flex items-start justify-between gap-4 py-2.5 text-sm"
                      >
                        <dt className="shrink-0 text-muted-foreground">
                          {columnHeaderLabel(cell.column)}
                        </dt>
                        <dd className="min-w-0 flex-1 text-right font-medium break-words text-ink">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}

                {actionCells.length ? (
                  <div className="mt-1 flex items-center justify-end border-t border-border pt-2">
                    {actionCells.map((cell) => (
                      <div key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </div>
                    ))}
                  </div>
                ) : null}
              </article>
            )
          })
        ) : (
          <div className="text-muted-foreground rounded-xl border bg-white p-8 text-center text-sm">
            {emptyMessage}
          </div>
        )}
      </div>

      <div className="admin-table-scroll hidden min-h-0 flex-1 rounded-xl border xl:block">
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
            {rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id} className={getRowClassName?.(row)}>
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
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
