import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of, tap } from "rxjs";
import { EndCustomer } from "src/app/models/customer/end-customer";
import { environment } from "src/environments/environment";
import { MessageService } from "../message/message.service";
import { DeleteResult } from "./delete-result";

@Injectable({
  providedIn: 'root'
})
export class BaseSubCollectionApiService {
  constructor(public http: HttpClient, public messageService: MessageService, @Inject('collection') public collection: string, @Inject('subCollection') public subCollection: string) { }
  private readonly API_URL = `${environment.apiUrl}`;// URL to web api

  public getUrlRequest(collectionId: string) {
    return `${this.API_URL}/${this.collection}/${collectionId}/${this.subCollection}`;
  }

  /** GET orders from the server */
  get(collectionId: string, param?: any): Observable<[EndCustomer[], number]> {
    const params = { ...param, collectionId };
    const finalUrl = this.getUrlRequest(collectionId);
    return this.http.get<[EndCustomer[], number]>(finalUrl, { params })
      .pipe(
        tap(_ => this.log('fetched orders')),
        catchError(this.handleError<[EndCustomer[], number]>('getTs', [[], 0]))
      );
  }

  /** GET data by id. Return `undefined` when id not found */
  getNo404<Data>(id: string): Observable<EndCustomer> {
    const url = `${this.API_URL}/?id=${id}`;
    return this.http.get<EndCustomer[]>(url)
      .pipe(
        map(orders => orders[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
          this.log(`${outcome} data id=${id}`);
        }),
        catchError(this.handleError<EndCustomer>(`getT id=${id}`))
      );
  }

  /** GET data by id. Will 404 if id not found */
  getById(id: string): Observable<EndCustomer> {
    const url = `${this.API_URL}/${id}`;
    return this.http.get<EndCustomer>(url).pipe(
      tap(_ => this.log(`fetched data id=${id}`)),
      catchError(this.handleError<EndCustomer>(`getT id=${id}`))
    );
  }

  /* GET orders whose name contains search term */
  search(term: string): Observable<EndCustomer[]> {
    if (!term.trim()) {
      // if not search term, return empty data array.
      return of([]);
    }
    return this.http.get<EndCustomer[]>(`${this.API_URL}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found orders matching "${term}"`) :
        this.log(`no orders matching "${term}"`)),
      catchError(this.handleError<EndCustomer[]>('searchTs', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new data to the server */
  add(data: EndCustomer): Observable<EndCustomer> {
    return this.http.post<EndCustomer>(this.API_URL, data).pipe(
      tap((newT) => this.log(`added data w/ id=${newT.id}`)),
      catchError(this.handleError<EndCustomer>('addT'))
    );
  }

  /** DELETE: delete the data from the server */
  delete(id: string): Observable<DeleteResult> {
    const url = `${this.API_URL}/${id}`;

    return this.http.delete<DeleteResult>(url).pipe(
      tap(_ => this.log(`deleted data id=${id}`)),
      catchError(this.handleError<DeleteResult>('deleteT'))
    );
  }

  safeDelete(id: string): Observable<DeleteResult> {
    const url = `${this.API_URL}/safe-delete/${id}`;

    return this.http.delete<DeleteResult>(url).pipe(
      tap(_ => this.log(`deleted data id=${id}`)),
      catchError(this.handleError<DeleteResult>('deleteT'))
    );
  }

  /** PUT: update the data on the server */
  update(data: EndCustomer): Observable<EndCustomer> {
    return this.http.put<EndCustomer>(`${this.API_URL}/${data.id}`, data).pipe(
      tap(_ => this.log(`updated data id=${data.id}`)),
      catchError(this.handleError<EndCustomer>('updateT'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  public handleError<EndCustomer>(operation = 'operation', result?: EndCustomer) {
    return (error: any): Observable<EndCustomer> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as EndCustomer);
    };
  }

  /** Log a TService message with the MessageService */
  public log(message: string) {
    this.messageService.add(`TService: ${message}`);
  }

}
