export class OrderInstallment {
  id: number = 0;
  description: string = '';
  amount: number = 0;
  amountPaid: number = 0;
  debitDate: Date = new Date();
  paymentDate: Date = new Date();
}