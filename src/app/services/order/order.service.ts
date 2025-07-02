import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Order } from "src/app/models/order/order";
import { BaseApiService } from "../base/base-api.service";
import { MessageService } from "../message/message.service";

@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseApiService<Order> {
  constructor(http: HttpClient, messageService: MessageService) {
    super(http, messageService, 'orders');
  }
}