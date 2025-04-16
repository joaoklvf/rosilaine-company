import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseApiService } from "../base/base-api.service";
import { MessageService } from "../message/message.service";
import { ProductCategory } from "src/app/models/product/product-category";

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService extends BaseApiService<ProductCategory> {
  constructor(http: HttpClient, messageService: MessageService) {
    super(http, messageService, 'product-category');
  }
}