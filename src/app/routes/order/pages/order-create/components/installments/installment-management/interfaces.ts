import { OrderInstallment } from "src/app/models/order/order-installment";
import { IInstallmentHeader } from "../../installments-header/interfaces";

interface IInstallmentsManagement {
  installments: OrderInstallment[];
  firstInstallmentDate: Date | null;
  installmentsAmount: number;
  isRounded: boolean;
  orderId: string;
}

export interface ModalProps extends IInstallmentsManagement {
  saveHeaderAction: (props: IInstallmentHeader) => void;
  saveInstallments: (installments: OrderInstallment[]) => void;
}
