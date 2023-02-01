import { FormatOptions } from "src/app/interfaces/format";

export interface ColumnProps<T> {
  key: keyof T;
  label: string;
  formatOption?: FormatOptions;
  alignment?: 'left' | 'right' | 'center';
}

export interface ListagemProps<T> {
  data: T[];
  columnsProps: ColumnProps<T>[];
}
