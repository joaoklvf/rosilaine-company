export interface DashInstallmentsResponse {
  installmentId: string;
  installmentDate: string;
  installmentAmount: string;
  customerName: string;
  orderId: string;
}

export interface InstallmentsBalanceResponse {
  amountPaid: number;
  amountTotal: number;
  amountToReceive: number;
  pendingInstallments: number;
}
