import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseSubCollectionApiService } from '../../base/base-sub-collection-api.service';
import { MessageService } from '../../message/message.service';

@Injectable({
  providedIn: 'root'
})
export class EndCustomerService extends BaseSubCollectionApiService {
  constructor(http: HttpClient, messageService: MessageService) {
    super(http, messageService, 'customers', 'end-customers')
  }
}
