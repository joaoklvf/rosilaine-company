import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ProductCategory } from "src/app/models/product/product-category";
import { MessageService } from "../../message/message.service";
import { BaseApiService } from "../../base/base-api.service";

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService extends BaseApiService<ProductCategory> {
  constructor(http: HttpClient, messageService: MessageService) {
    super(http, messageService, 'product-categories');
  }
}