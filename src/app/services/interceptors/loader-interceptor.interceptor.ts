import { HttpHandler, HttpInterceptor } from '@angular/common/http';
import { H, a } from '@angular/common/module.d-BJA_GXII';
import { Injectable } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { LoaderService } from '../base/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(
    private readonly loaderService: LoaderService
  ) { }

  intercept(req: H<any>, next: HttpHandler): Observable<a<any>> {
    this.loaderService.show();

    return next.handle(req).pipe(
      finalize(() => this.loaderService.hide())
    );
  }
}
