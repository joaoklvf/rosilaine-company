import { OrderInstallment } from "src/app/models/order/order-installment";
import { OrderItem } from "src/app/models/order/order-item/order-item";

export type ItemResponse = { installments: OrderInstallment[]; total: number; orderItem?: OrderItem; }
