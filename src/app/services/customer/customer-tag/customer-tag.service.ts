import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomerTag } from 'src/app/models/customer/customer-tag';
import { BaseApiService } from '../../base/base-api.service';
import { MessageService } from '../../message/message.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerTagService extends BaseApiService<CustomerTag> {
  constructor(http: HttpClient, messageService: MessageService) {
    super(http, messageService, 'customer-tags');
  }
}
