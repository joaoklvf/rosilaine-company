import { Order } from "./order";

export interface OrderRequest extends Order {
  installmentsAmount: number;
  isToRound: boolean;
}
