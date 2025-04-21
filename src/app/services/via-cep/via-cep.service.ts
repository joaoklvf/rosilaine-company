import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { ViaCepResponse } from 'src/app/models/via-cep/via-cep-response';
import { MessageService } from '../message/message.service';

@Injectable({
  providedIn: 'root'
})
export class ViaCepService {
  constructor(private http: HttpClient, private messageService: MessageService) { }
  private apiUrl = `https://viacep.com.br/ws/ZIP_CODE/json/`;// URL to web api

  /** GET orders from the server */
  get(zipCode: string): Observable<ViaCepResponse> {
    const requestUrl = this.apiUrl.replace('ZIP_CODE', zipCode);

    return this.http.get<ViaCepResponse>(requestUrl)
      .pipe(
        tap(_ => this.log('fetched orders')),
        catchError(this.handleError<ViaCepResponse>('get address'))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
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
  private log(message: string) {
    this.messageService.add(`TService: ${message}`);
  }
}
