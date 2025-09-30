import { Injectable } from '@angular/core';
import { BaseApiService } from '../../base/base-api.service';
import { HttpClient } from '@angular/common/http';
import { MessageService } from '../../message/message.service';
import { OrderItem } from 'src/app/models/order/order-item/order-item';
import { OrderItemByStatus, OrderItemByCustomer } from 'src/app/interfaces/order-item-by-status';
import { Observable, tap, catchError } from 'rxjs';
import { getHttpParams } from 'src/app/utils/http-util';

@Injectable({
  providedIn: 'root'
})
export class OrderItemService extends BaseApiService<OrderItem> {
  constructor(http: HttpClient, messageService: MessageService) {
    super(http, messageService, 'order-items');
  }

  /** GET orders from the server */
  getByItemStatus(params: any): Observable<[OrderItemByStatus[], number]> {
    return this.http.get<[OrderItemByStatus[], number]>(`${this.apiUrl}/items-by-status`, { params: getHttpParams(params) })
      .pipe(
        tap(_ => this.log('fetched data')),
        catchError(this.handleError<[OrderItemByStatus[], number]>('getTs'))
      );
  }

  getByItemCustomerAndStatus(params: any): Observable<[OrderItemByCustomer[], number]> {
    return this.http.get<[OrderItemByCustomer[], number]>(`${this.apiUrl}/items-by-customer`, { params: getHttpParams(params) })
      .pipe(
        tap(_ => this.log('fetched data')),
        catchError(this.handleError<[OrderItemByCustomer[], number]>('getTs'))
      );
  }

  changeManyStatus(oldStatusId: string, newStatusId: string) {
    return this.http.put<any>(`${this.apiUrl}/many-status-change`, { oldStatusId, newStatusId }).pipe(
      tap(_ => this.log(`updated installments`)),
      catchError(this.handleError<any>('updateT'))
    );
  }

  changeStatusByProduct(newStatusId: string, productId: string, customerId?: string) {
    return this.http.put<any>(`${this.apiUrl}/product-status-change`, { newStatusId, productId, customerId }).pipe(
      tap(_ => this.log(`updated installments`)),
      catchError(this.handleError<any>('updateT'))
    );
  }
}
