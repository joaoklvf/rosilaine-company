import * as moment from "moment";

export const formatDate = (data: Date) =>
  moment(data).format('DD/MM/YYYY');

export const formatDecimal = (data: number) =>
  data.toFixed(2);

export const formatCurrency = (data: number) =>
  data.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

export const formatDefault = (data: any) => data;

export enum FormatOptions {
  Date = 'date',
  Decimal = 'decimal',
  Currency = 'currency',
  Default = 'default'
}

export const formatMap = {
  [FormatOptions.Date]: formatDate,
  [FormatOptions.Decimal]: formatDecimal,
  [FormatOptions.Currency]: formatCurrency,
  [FormatOptions.Default]: formatDefault,
};
