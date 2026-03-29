import type { ReactNode } from "react";

import type { DataTableColumn, DataTableProps } from "./types";

import { uiColors } from "../../styles/ui-colors";

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
  onRowClick,
}: DataTableProps<Row>) {
  return (
    <div
      className={`rounded-lg ${uiColors.surface} shadow-sm border ${uiColors.borderSubtle}`}
    >
      {title != null ? (
        <div className={`border-b ${uiColors.borderSubtle} px-6 py-4`}>
          <h2 className={`text-lg font-semibold ${uiColors.textPrimary}`}>{title}</h2>
        </div>
      ) : null}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={uiColors.surfaceMuted}>
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
          <tbody className={`divide-y ${uiColors.borderSubtle}`}>
            {data.map((row) => (
              <tr
                key={getRowKey(row)}
                className={
                  onRowClick
                    ? `${uiColors.hoverSurfaceMuted} cursor-pointer`
                    : uiColors.hoverSurfaceMuted
                }
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
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
