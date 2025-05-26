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

  private getNextMonthDate(date: Date) {
    const currentMonth = date.getMonth();
    if (currentMonth === 11) {
      date.setMonth(0)
      date.setFullYear(date.getFullYear() + 1);
    }
    else {
      date.setMonth(currentMonth + +1)
    }
    return new Date(date);
  }

  public generateInstallments(order: Order, installmentsAmount: number) {
    const installmentPrice = Math.round((order.total / installmentsAmount) * 100) / 100;
    const installments: OrderInstallment[] = [];
    const now = new Date();

    let currentDebitDate = order.firstInstallmentDate ?
      new Date(order.firstInstallmentDate) : this.getNextMonthDate(now);

    order.firstInstallmentDate = new Date(currentDebitDate);

    for (let index = 0; index < installmentsAmount; index++) {
      const price = index === installmentsAmount - 1 ?
        order.total - installments.reduce((prev, acc) => prev + acc.amount, 0) : installmentPrice;

      installments.push({
        amount: price,
        amountPaid: null,
        createdDate: now,
        updatedDate: now,
        debitDate: new Date(currentDebitDate),
        paymentDate: null
      });

      currentDebitDate = this.getNextMonthDate(currentDebitDate);
    }

    order.installments = [...installments];
    return order;
  }
}