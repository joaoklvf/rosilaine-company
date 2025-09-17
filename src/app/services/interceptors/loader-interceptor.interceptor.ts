import { HttpHandler, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { LoaderService } from '../base/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private readonly loaderService: LoaderService) { }

  intercept(req: any, next: HttpHandler): Observable<any> {
    this.loaderService.show();

    return next.handle(req).pipe(
      finalize(() => this.loaderService.hide())
    );
  }
}
