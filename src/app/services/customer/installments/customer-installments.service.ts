import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseSubCollectionApiService } from '../../base/base-sub-collection-api.service';
import { MessageService } from '../../message/message.service';
import { Observable } from 'rxjs/internal/Observable';
import { tap, catchError } from 'rxjs';
import { DashInstallmentsResponse, InstallmentsBalanceResponse } from 'src/app/interfaces/home-response';

@Injectable({
  providedIn: 'root'
})
export class CustomerInstallmentsService extends BaseSubCollectionApiService {
  constructor(http: HttpClient, messageService: MessageService) {
    super(http, messageService, 'customers', 'installments')
  }

  private getRouteRequest(customerId: string, destination: string) {
    const url = this.getUrlRequest(customerId);
    const route = `${url}/${destination}`;
    return route;
  }

  /** GET orders from the server */
  getNextInstallments(customerId: string, parameters?: any): Observable<[DashInstallmentsResponse[], number]> {
    const route = this.getRouteRequest(customerId, 'next');
    const params = { ...parameters, customerId };
    return this.http.get<[DashInstallmentsResponse[], number]>(route, { params })
      .pipe(
        tap(_ => this.log('fetched orders')),
        catchError(this.handleError<[DashInstallmentsResponse[], number]>('getTs', [[], 0]))
      );
  }

  /** GET orders from the server */
  getOverdueInstallments(customerId: string, parameters?: any): Observable<[DashInstallmentsResponse[], number]> {
    const route = this.getRouteRequest(customerId, 'overdue');
    const params = { ...parameters, customerId };
    return this.http.get<[DashInstallmentsResponse[], number]>(route, { params })
      .pipe(
        tap(_ => this.log('fetched orders')),
        catchError(this.handleError<[DashInstallmentsResponse[], number]>('getTs', [[], 0]))
      );
  }

  getInstallmentsBalance(customerId: string, parameters?: any): Observable<InstallmentsBalanceResponse> {
    const route = this.getRouteRequest(customerId, 'balance');
    const params = { ...parameters, customerId };
    return this.http.get<InstallmentsBalanceResponse>(route, { params })
      .pipe(
        tap(_ => this.log('fetched orders')),
        catchError(this.handleError<InstallmentsBalanceResponse>('getTs'))
      );
  }
}
