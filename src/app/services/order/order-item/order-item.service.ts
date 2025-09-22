import { Injectable } from '@angular/core';
import { BaseApiService } from '../../base/base-api.service';
import { HttpClient } from '@angular/common/http';
import { MessageService } from '../../message/message.service';
import { OrderItem } from 'src/app/models/order/order-item/order-item';
import { OrderItemByStatus } from 'src/app/interfaces/order-item-by-status';
import { Observable, tap, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderItemService extends BaseApiService<OrderItem> {
  constructor(http: HttpClient, messageService: MessageService) {
    super(http, messageService, 'order-items');
  }

  /** GET orders from the server */
  getByStatusId(params: any): Observable<[OrderItemByStatus[], number]> {
    return this.http.get<[OrderItemByStatus[], number]>(`${this.apiUrl}/order-item-status`, { params })
      .pipe(
        tap(_ => this.log('fetched data')),
        catchError(this.handleError<[OrderItemByStatus[], number]>('getTs'))
      );
  }

  changeManyStatus(oldStatusId: string, newStatusId: string) {
    return this.http.put<any>(`${this.apiUrl}/many-status-change`, { oldStatusId, newStatusId }).pipe(
      tap(_ => this.log(`updated installments`)),
      catchError(this.handleError<any>('updateT'))
    );
  }

  changeStatusByProduct(newStatusId: string, productId: string) {
    return this.http.put<any>(`${this.apiUrl}/product-status-change`, { newStatusId, productId }).pipe(
      tap(_ => this.log(`updated installments`)),
      catchError(this.handleError<any>('updateT'))
    );
  }
}
