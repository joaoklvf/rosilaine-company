import { Injectable } from '@angular/core';
import { BaseApiService } from '../../base/base-api.service';
import { HttpClient } from '@angular/common/http';
import { MessageService } from '../../message/message.service';
import { OrderItemStatus } from 'src/app/models/order/order-item/order-item-status';

@Injectable({
  providedIn: 'root'
})
export class OrderItemStatusService extends BaseApiService<OrderItemStatus> {
  constructor(http: HttpClient, messageService: MessageService) {
    super(http, messageService, 'order-item-status');
  }
}
