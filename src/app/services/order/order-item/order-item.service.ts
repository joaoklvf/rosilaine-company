import { Injectable } from '@angular/core';
import { BaseApiService } from '../../base/base-api.service';
import { HttpClient } from '@angular/common/http';
import { MessageService } from '../../message/message.service';
import { OrderItem } from 'src/app/models/order/order-item/order-item';

@Injectable({
  providedIn: 'root'
})
export class OrderItemService extends BaseApiService<OrderItem> {
  constructor(http: HttpClient, messageService: MessageService) {
    super(http, messageService, 'order-items');
  }
}
