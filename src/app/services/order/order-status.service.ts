import { Injectable } from '@angular/core';
import { BaseApiService } from '../base/base-api.service';
import { OrderStatus } from 'src/app/models/order/order-status';
import { HttpClient } from '@angular/common/http';
import { MessageService } from '../message/message.service';

@Injectable({
  providedIn: 'root'
})
export class OrderStatusService extends BaseApiService<OrderStatus> {
  constructor(http: HttpClient, messageService: MessageService) {
    super(http, messageService, 'order-status');
  }
}
