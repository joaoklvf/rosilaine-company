export enum FormatValueOptions {
  Amount = 'amount',
  Date = 'date',
  Currency = 'currency',
  String = 'string',
}

export type KeyOf<T> = {
  [K in keyof T & (string | number)]:
  Exclude<T[K], null | undefined> extends object ?
  `${K}` | `${K}.${KeyOf<Exclude<T[K], null | undefined>>}` :
  `${K}`;
}[keyof T & (string | number)];


export interface DataTableColumnProp<T> {
  description: string;
  fieldName: KeyOf<T>;
  width?: string;
  formatValue?: FormatValueOptions;
}

export function getValue<T>(value: T, path: KeyOf<T>) {
  const pathSplitted = path.split('.');
  if (pathSplitted.length > 1)
    return getValue(value[pathSplitted[0] as keyof T] as T, path.replace(`${pathSplitted[0]}.`, '') as KeyOf<T>)

  return value ? value[path as keyof T] : '';
}
