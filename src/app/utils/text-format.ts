export const getBrCurrencyStr = (value: number | string) =>
  Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const getBrDateStr = (value: Date | string) =>
  new Date(value).toLocaleDateString('pt-BR');

export const getAmountStr = (value: number) =>
  String(value).padStart(2, "0");
