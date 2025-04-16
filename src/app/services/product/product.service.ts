import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseApiService } from "../base/base-api.service";
import { MessageService } from "../message/message.service";
import { Product } from "src/app/models/product/product";

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseApiService<Product> {
  constructor(http: HttpClient, messageService: MessageService) {
    super(http, messageService, 'products');
  }
}