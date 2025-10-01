import { Customer } from "../models/customer/customer";

export const getBrCurrencyStr = (value: number | string) =>
  Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const getBrDateStr = (value: Date | string) =>
  new Date(value).toLocaleDateString('pt-BR');

export const getBrDateTimeStr = (value: Date | string) =>
  new Date(value).toLocaleString('pt-BR');

export const getAmountStr = (value: number | string) =>
  Number(value).toString().padStart(2, "0");

export const getDateFromStr = (value: string | Date) => {
  const dataNascimentoSplitted = String(value).split('/').map(x => Number(x));
  return new Date(dataNascimentoSplitted[2], dataNascimentoSplitted[1] - 1, dataNascimentoSplitted[0])
}

export const getCustomersNamecustomer_nick_name = (customers: Customer[]) =>
  customers.map(customer => getCustomerNamecustomer_nick_name(customer));

export const getCustomerNamecustomer_nick_name = (customer: Customer) =>
  ({ ...customer, name: `${customer.name} ${customer.customer_nick_name ?? ''}`.trim() });
