import type { ReactNode } from "react";

type ColumnId = string;

type DataTableColumn<Row> = {
  id: ColumnId;
  header: ReactNode;
  headerClassName?: string;
  cell: (row: Row) => ReactNode;
  cellClassName?: string;
};

type DataTableProps<Row> = {
  title?: ReactNode;
  data: readonly Row[];
  columns: readonly DataTableColumn<Row>[];
  getRowKey: (row: Row) => string | number;
  onRowClick?: (row: Row) => void;
};

export type { DataTableColumn, DataTableProps };
