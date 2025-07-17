import { HomeDashOptions } from "src/app/routes/home/interfaces/home";
import { DataTableFilter } from "../../data-table/data-table-interfaces";

export interface GetInstallmentsDataProps {
  option: HomeDashOptions;
  filter?: DataTableFilter;
}