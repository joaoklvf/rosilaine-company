import { BaseEntity } from "../base-entity";

export class OrderInstallment extends BaseEntity {
  amount = 0;
  amountPaid: number | null = null;
  debitDate = new Date();
  paymentDate: Date | null = null;
}
