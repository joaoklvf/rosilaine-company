import { Order } from "src/app/models/order/order";
import { OrderInstallment } from "src/app/models/order/order-installment";

export interface ModalProps {
  order: Order;
  saveInstallmentsAction: (installments: OrderInstallment[]) => void;
  saveOrderAction: (updatedOrder: Order) => void;
}

export interface ManagementInstallments extends OrderInstallment {
  originalAmount: number;
}
