import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Stock } from 'src/app/models/stock/stock';
import { BaseApiService } from '../base/base-api.service';
import { MessageService } from '../message/message.service';

@Injectable({
  providedIn: 'root'
})
export class StockService extends BaseApiService<Stock> {
  constructor(http: HttpClient, messageService: MessageService) {
    super(http, messageService, 'stocks');
  }
}
