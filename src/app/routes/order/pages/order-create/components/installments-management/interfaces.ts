import { OrderInstallment } from "src/app/models/order/order-installment";
import { IInstallmentHeader } from "../installments-header/interfaces";
import { Order } from "src/app/models/order/order";

interface IInstallmentsManagement {
  installments: OrderInstallment[];
  firstInstallmentDate: Date | null;
  installmentsAmount: number;
  isRounded: boolean;
  orderId: string;
  order: Order;
}

export interface ModalProps extends IInstallmentsManagement {
  saveHeaderAction: (props: IInstallmentHeader) => void;
  saveInstallments: (installments: OrderInstallment[]) => void;
  saveOrder: (updatedOrder: Order) => void;
}

export interface ManagementInstallments extends OrderInstallment{
  originalAmount: number;
}
