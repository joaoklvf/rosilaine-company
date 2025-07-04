import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, tap, catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MessageService } from '../message/message.service';
import { InstallmentsBalanceResponse, DashInstallmentsResponse } from 'src/app/interfaces/home-response';

@Injectable({
  providedIn: 'root'
})
export class HomeApiService {
  constructor(public http: HttpClient, public messageService: MessageService) { }
  public apiUrl = `${environment.apiUrl}/home`;// URL to web api

  /** GET orders from the server */
  getNextInstallments(params?: any): Observable<[DashInstallmentsResponse[], number]> {
    return this.http.get<[DashInstallmentsResponse[], number]>(`${this.apiUrl}/installments/next`, { params })
      .pipe(
        tap(_ => this.log('fetched orders')),
        catchError(this.handleError<[DashInstallmentsResponse[], number]>('getTs', [[], 0]))
      );
  }

  /** GET orders from the server */
  getOverdueInstallments(params?: any): Observable<[DashInstallmentsResponse[], number]> {
    return this.http.get<[DashInstallmentsResponse[], number]>(`${this.apiUrl}/installments/overdue`, { params })
      .pipe(
        tap(_ => this.log('fetched orders')),
        catchError(this.handleError<[DashInstallmentsResponse[], number]>('getTs', [[], 0]))
      );
  }

  getInstallmentsBalance(params?: any): Observable<InstallmentsBalanceResponse> {
    return this.http.get<InstallmentsBalanceResponse>(`${this.apiUrl}/installments/balance`, { params })
      .pipe(
        tap(_ => this.log('fetched orders')),
        catchError(this.handleError<InstallmentsBalanceResponse>('getTs'))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  public handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a TService message with the MessageService */
  public log(message: string) {
    this.messageService.add(`TService: ${message}`);
  }
}
