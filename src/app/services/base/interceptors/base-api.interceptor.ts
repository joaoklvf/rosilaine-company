import { HttpHandler, HttpInterceptor } from '@angular/common/http';
import { a, H } from '@angular/common/module.d-BJA_GXII';
import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { LoaderService } from '../loader.service';

@Injectable()
export class BaseApiInterceptor implements HttpInterceptor {

  constructor(private loaderService: LoaderService) { }

  intercept(req: H<any>, next: HttpHandler): Observable<a<any>> {
    this.loaderService.show();
    
    return next.handle(req).pipe(
      finalize(() => this.loaderService.hide())
    );
  }
}
