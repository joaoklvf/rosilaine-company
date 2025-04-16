import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseApiService } from "../base/base-api.service";
import { MessageService } from "../message/message.service";
import { Customer } from "src/app/models/customer/customer";

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseApiService<Customer> {
  constructor(http: HttpClient, messageService: MessageService) {
    super(http, messageService, 'customers');
  }
}