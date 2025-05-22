export enum FormatValueOptions {
  Amount = 'amount',
  Date = 'date',
  Currency = 'currency',
  String = 'string',
}

export interface ColumnProp<T> {
  description: string;
  fieldName: keyof T;
  width?: string;
  formatValue?: FormatValueOptions;
}
