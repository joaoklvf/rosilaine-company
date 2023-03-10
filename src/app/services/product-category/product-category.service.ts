import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, map, of } from 'rxjs';
import { ProductCategory } from 'src/app/models/product/product-category';
import { MessageService } from '../message/message.service';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {
  constructor(private http: HttpClient, private messageService: MessageService) { }
  private productsUrl = `http://localhost:3001/api/product-categories`;// URL to web api

  /** GET products from the server */
  getProductCategories(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(this.productsUrl)
      .pipe(
        tap(_ => this.log('fetched products')),
        catchError(this.handleError<ProductCategory[]>('getProductCategories', []))
      );
  }

  /** GET customer by id. Return `undefined` when id not found */
  getProductCategoryNo404<Data>(id: number): Observable<ProductCategory> {
    const url = `${this.productsUrl}/?id=${id}`;
    return this.http.get<ProductCategory[]>(url)
      .pipe(
        map(products => products[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
          this.log(`${outcome} customer id=${id}`);
        }),
        catchError(this.handleError<ProductCategory>(`getProductCategory id=${id}`))
      );
  }

  /** GET customer by id. Will 404 if id not found */
  getProductCategory(id: number): Observable<ProductCategory> {
    const url = `${this.productsUrl}/${id}`;
    return this.http.get<ProductCategory>(url).pipe(
      tap(_ => this.log(`fetched customer id=${id}`)),
      catchError(this.handleError<ProductCategory>(`getProductCategory id=${id}`))
    );
  }

  /* GET products whose name contains search term */
  searchProductCategories(term: string): Observable<ProductCategory[]> {
    if (!term.trim()) {
      // if not search term, return empty customer array.
      return of([]);
    }
    return this.http.get<ProductCategory[]>(`${this.productsUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found products matching "${term}"`) :
        this.log(`no products matching "${term}"`)),
      catchError(this.handleError<ProductCategory[]>('searchProductCategories', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new customer to the server */
  addProductCategory(customer: ProductCategory): Observable<ProductCategory> {
    console.log(customer, 'customer');
    return this.http.post<ProductCategory>(this.productsUrl, customer).pipe(
      tap((newProductCategory: ProductCategory) => this.log(`added customer w/ id=${newProductCategory.id}`)),
      catchError(this.handleError<ProductCategory>('addProductCategory'))
    );
  }

  /** DELETE: delete the customer from the server */
  deleteProductCategory(id: number): Observable<ProductCategory> {
    const url = `${this.productsUrl}/${id}`;

    return this.http.delete<ProductCategory>(url).pipe(
      tap(_ => this.log(`deleted customer id=${id}`)),
      catchError(this.handleError<ProductCategory>('deleteProductCategory'))
    );
  }

  /** PUT: update the customer on the server */
  updateProductCategory(customer: ProductCategory): Observable<any> {
    return this.http.put(`${this.productsUrl}/${customer.id}`, customer).pipe(
      tap(_ => this.log(`updated customer id=${customer.id}`)),
      catchError(this.handleError<any>('updateProductCategory'))
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

  /** Log a ProductCategoryService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ProductCategoryService: ${message}`);
  }
}
