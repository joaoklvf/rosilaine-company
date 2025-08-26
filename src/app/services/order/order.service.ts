import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Order } from "src/app/models/order/order";
import { BaseApiService } from "../base/base-api.service";
import { MessageService } from "../message/message.service";
import { OrderInstallment } from "src/app/models/order/order-installment";
import { Observable, tap, catchError } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseApiService<Order> {
  constructor(http: HttpClient, messageService: MessageService) {
    super(http, messageService, 'orders');
  }

  recreateInstallments(data: Order): Observable<OrderInstallment[]> {
    return this.http.post<OrderInstallment[]>(`${this.apiUrl}/${data.id}/recreate-installments`, data).pipe(
      tap(_ => this.log(`updated data id=${data.id}`)),
      catchError(this.handleError<OrderInstallment[]>('updateT'))
    );
  }

  updateInstallments(orderInstallments: OrderInstallment[], orderId: string) {
    return this.http.put<OrderInstallment[]>(`${this.apiUrl}/${orderId}/update-installments`, orderInstallments).pipe(
      tap(_ => this.log(`updated installments`)),
      catchError(this.handleError<OrderInstallment[]>('updateT'))
    );
  }
}
