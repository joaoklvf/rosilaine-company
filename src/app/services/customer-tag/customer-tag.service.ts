import { Injectable } from '@angular/core';
import { BaseApiService } from '../base/base-api.service';
import { HttpClient } from '@angular/common/http';
import { MessageService } from '../message/message.service';
import { CustomerTag } from 'src/app/models/customer/customer-tag';

@Injectable({
  providedIn: 'root'
})
export class CustomerTagService extends BaseApiService<CustomerTag> {
  constructor(http: HttpClient, messageService: MessageService) {
    super(http, messageService, 'customer-tags');
  }
}
