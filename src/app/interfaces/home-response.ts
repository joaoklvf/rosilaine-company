export interface NextInstallmentsResponse {
  installmentId: string;
  installmentDate: string;
  installmentAmount: string;
  customerName: string;
}

export interface InstallmentsBalanceResponse {
  amountPaid: number;
  amountTotal: number;
  amountToReceive: number;
  pendingInstallments: number;
}
