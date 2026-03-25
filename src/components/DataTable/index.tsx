import type { ReactNode } from "react";

import type { DataTableColumn, DataTableProps } from "./types";

const defaultHeaderClassName =
  "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";

const defaultCellClassName = "whitespace-nowrap px-6 py-4";

const TableCell = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) => {
  return <td className={className}>{children}</td>;
};

const TableHeaderCell = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) => {
  return <th className={className}>{children}</th>;
};

export function DataTable<Row>({
  title,
  data,
  columns,
  getRowKey,
}: DataTableProps<Row>) {
  return (
    <div className="rounded-lg bg-white shadow-sm border border-gray-100">
      {title != null ? (
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
      ) : null}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column: DataTableColumn<Row>) => (
                <TableHeaderCell
                  key={column.id}
                  className={column.headerClassName ?? defaultHeaderClassName}
                >
                  {column.header}
                </TableHeaderCell>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row) => (
              <tr key={getRowKey(row)} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    className={column.cellClassName ?? defaultCellClassName}
                  >
                    {column.cell(row)}
                  </TableCell>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
