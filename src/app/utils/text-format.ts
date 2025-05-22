export const getBrCurrencyStr = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const getBrDateStr = (value: Date) =>
  value.toLocaleDateString('pt-BR');

export const getAmountStr = (value: number) =>
  String(value).padStart(2, "0");
