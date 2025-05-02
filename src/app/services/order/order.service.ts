import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseApiService } from "../base/base-api.service";
import { MessageService } from "../message/message.service";
import { Order } from "src/app/models/order/order";
import { OrderInstallment } from "src/app/models/order/order-installment";

@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseApiService<Order> {
  constructor(http: HttpClient, messageService: MessageService) {
    super(http, messageService, 'orders');
  }

  public generateInstallments(order: Order, amount: number) {
    const installmentPrice = Math.round((order.total / amount) * 100) / 100;
    const installments: OrderInstallment[] = [];

    for (let index = 0; index < amount; index++) {
      const now = new Date();
      const debitDate = order.firstInstallmentDate || now;
      debitDate?.setMonth(debitDate.getMonth() + index);
      const price = index === amount - 1 ?
        order.total - installments.reduce((prev, acc) => prev + acc.amount, 0) : installmentPrice;

      installments.push({
        amount: price,
        amountPaid: null,
        createdDate: now,
        updatedDate: now,
        debitDate,
        paymentDate: null
      });

      order.installments = [...installments];
    }

    return order;
  }
}