import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderInstallment } from 'src/app/models/order/order-installment';
import { BaseApiService } from '../../base/base-api.service';
import { MessageService } from '../../message/message.service';

@Injectable({
  providedIn: 'root'
})
export class OrderInstallmentService extends BaseApiService<OrderInstallment> {
  constructor(http: HttpClient, messageService: MessageService) {
    super(http, messageService, 'order-installments');
  }
}
