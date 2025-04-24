import { BaseEntity } from "../base-entity";

export class OrderInstallment extends BaseEntity {
  amount = 0;
  amountPaid = 0;
  debitDate = new Date();
  paymentDate = new Date();
}
