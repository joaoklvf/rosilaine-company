import { FormatValueOptions } from "../interfaces/data-table";
import { getAmountStr, getBrCurrencyStr, getBrDateStr } from "./text-format";

const TableFormatMap = {
  [FormatValueOptions.Amount]: (value: string) => getAmountStr(value),
  [FormatValueOptions.Currency]: (value: string) => getBrCurrencyStr(value),
  [FormatValueOptions.Date]: (value: string) => getBrDateStr(value),
  [FormatValueOptions.String]: (value: string) => value,
}

export const getCellFormattedValue = (value: string | number, formatLabel: FormatValueOptions = FormatValueOptions.String) =>
  TableFormatMap[formatLabel](value.toString());
