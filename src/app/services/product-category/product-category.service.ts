import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, map, of } from 'rxjs';
import { MessageService } from '../message/message.service';
import { ProductCategory } from 'src/app/models/product/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  private productsUrl = `http://localhost:3001/api/product-categories`;// URL to web api

  /** GET product-categories from the server */
  getProductCategories(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(this.productsUrl)
      .pipe(
        tap(_ => this.log('fetched product-categories')),
        catchError(this.handleError<ProductCategory[]>('getProducts', []))
      );
  }

  /** GET customer by id. Return `undefined` when id not found */
  getProductCategoryNo404<Data>(id: number): Observable<ProductCategory> {
    const url = `${this.productsUrl}/?id=${id}`;
    return this.http.get<ProductCategory[]>(url)
      .pipe(
        map(categories => categories[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
          this.log(`${outcome} customer id=${id}`);
        }),
        catchError(this.handleError<ProductCategory>(`getProduct id=${id}`))
      );
  }

  /** GET customer by id. Will 404 if id not found */
  getProductCategory(id: number): Observable<ProductCategory> {
    const url = `${this.productsUrl}/${id}`;
    return this.http.get<ProductCategory>(url).pipe(
      tap(_ => this.log(`fetched customer id=${id}`)),
      catchError(this.handleError<ProductCategory>(`getProduct id=${id}`))
    );
  }

  /* GET product-categories whose name contains search term */
  searchProductCategories(term: string): Observable<ProductCategory[]> {
    if (!term.trim()) {
      // if not search term, return empty customer array.
      return of([]);
    }
    return this.http.get<ProductCategory[]>(`${this.productsUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found product-categories matching "${term}"`) :
        this.log(`no product-categories matching "${term}"`)),
      catchError(this.handleError<ProductCategory[]>('searchProducts', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new customer to the server */
  addProductCategory(customer: ProductCategory): Observable<ProductCategory> {
    console.log(customer, 'customer');
    return this.http.post<ProductCategory>(this.productsUrl, customer).pipe(
      tap((newProduct: ProductCategory) => this.log(`added customer w/ id=${newProduct.id}`)),
      catchError(this.handleError<ProductCategory>('addProduct'))
    );
  }

  /** DELETE: delete the customer from the server */
  deleteProductCategory(id: number): Observable<ProductCategory> {
    const url = `${this.productsUrl}/${id}`;

    return this.http.delete<ProductCategory>(url).pipe(
      tap(_ => this.log(`deleted customer id=${id}`)),
      catchError(this.handleError<ProductCategory>('deleteProduct'))
    );
  }

  /** PUT: update the customer on the server */
  updateProductCategory(customer: ProductCategory): Observable<any> {
    return this.http.put(`${this.productsUrl}/${customer.id}`, customer).pipe(
      tap(_ => this.log(`updated customer id=${customer.id}`)),
      catchError(this.handleError<any>('updateProduct'))
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
