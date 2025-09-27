import { getAmountStr } from "./text-format";

export function getNextMonthDate(date: Date) {
  const currentMonth = date.getMonth();
  if (currentMonth === 11) {
    date.setMonth(0)
    date.setFullYear(date.getFullYear() + 1);
  }
  else {
    date.setMonth(currentMonth + +1)
  }
  return new Date(date);
}

export function getBrazilianStrDate(value: Date | string) {
  const date = new Date(value);
  return date.toLocaleDateString('pt-BR')
}

export const CURRENT_MONTH = getAmountStr((new Date().getMonth() + 1));
export const mapMonthName: { [x: string]: string } = {
  "01": "Janeiro",
  "02": "Fevereiro",
  "03": "Março",
  "04": "Abril",
  "05": "Maio",
  "06": "Junho",
  "07": "Julho",
  "08": "Agosto",
  "09": "Setembro",
  "10": "Outubro",
  "11": "Novembro",
  "12": "Dezembro",
};
