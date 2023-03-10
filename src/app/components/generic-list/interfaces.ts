import { FormatOptions } from "src/app/interfaces/format";
import { Product } from 'src/app/models/product/product';

export type KeyOf<T> = {
  [K in keyof T & (string | number)]: T[K] extends object ? `${K}` | `${K}.${KeyOf<T[K]>}`: `${K}`;
}[keyof T & (string | number)];


type Teste<T> = { [Key in keyof T]: T[Key] }
export interface ColumnProps<T> {
  key: KeyOf<T>;
  label: string;
  formatOption?: FormatOptions;
  alignment?: 'left' | 'right' | 'center';
}

export interface ListagemProps<T extends object> {
  data: T[];
  columnsProps: ColumnProps<T>[];
}
