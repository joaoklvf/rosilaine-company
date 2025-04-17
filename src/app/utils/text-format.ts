import * as moment from "moment";

export const getDateStrBr = (date: Date) =>
  moment(date).format('DD/MM/YYYY');

export const getCurrencyStrBr = (value: number | string) =>
  Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });