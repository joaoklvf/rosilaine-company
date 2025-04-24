import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, tap, catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MessageService } from '../message/message.service';

@Injectable({
  providedIn: 'root'
})
export class BaseApiService<T extends { id: number }> {
  constructor(private http: HttpClient, private messageService: MessageService, @Inject('collection') private collection: string) { }
  private apiUrl = `${environment.apiUrl}/${this.collection}`;// URL to web api

  /** GET orders from the server */
  get(): Observable<T[]> {
    return this.http.get<T[]>(this.apiUrl)
      .pipe(
        tap(_ => this.log('fetched orders')),
        catchError(this.handleError<T[]>('getTs', []))
      );
  }

  /** GET data by id. Return `undefined` when id not found */
  getNo404<Data>(id: number): Observable<T> {
    const url = `${this.apiUrl}/?id=${id}`;
    return this.http.get<T[]>(url)
      .pipe(
        map(orders => orders[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
          this.log(`${outcome} data id=${id}`);
        }),
        catchError(this.handleError<T>(`getT id=${id}`))
      );
  }

  /** GET data by id. Will 404 if id not found */
  getById(id: number): Observable<T> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<T>(url).pipe(
      tap(_ => this.log(`fetched data id=${id}`)),
      catchError(this.handleError<T>(`getT id=${id}`))
    );
  }

  /* GET orders whose name contains search term */
  search(term: string): Observable<T[]> {
    if (!term.trim()) {
      // if not search term, return empty data array.
      return of([]);
    }
    return this.http.get<T[]>(`${this.apiUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found orders matching "${term}"`) :
        this.log(`no orders matching "${term}"`)),
      catchError(this.handleError<T[]>('searchTs', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new data to the server */
  add(data: T): Observable<T> {
    return this.http.post<T>(this.apiUrl, data).pipe(
      tap((newT: T) => this.log(`added data w/ id=${newT.id}`)),
      catchError(this.handleError<T>('addT'))
    );
  }

  /** DELETE: delete the data from the server */
  delete(id: number): Observable<T> {
    const url = `${this.apiUrl}/${id}`;

    return this.http.delete<T>(url).pipe(
      tap(_ => this.log(`deleted data id=${id}`)),
      catchError(this.handleError<T>('deleteT'))
    );
  }

  /** PUT: update the data on the server */
  update(data: T): Observable<any> {
    return this.http.put(`${this.apiUrl}/${data.id}`, data).pipe(
      tap(_ => this.log(`updated data id=${data.id}`)),
      catchError(this.handleError<any>('updateT'))
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
