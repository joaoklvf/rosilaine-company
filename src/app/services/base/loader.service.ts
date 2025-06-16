import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private loadingRequests = 0;
  private _isLoading = new BehaviorSubject<boolean>(false);

  isLoading$ = this._isLoading.asObservable();

  show() {
    this.loadingRequests++;
    this._isLoading.next(true);
  }

  hide() {
    this.loadingRequests--;
    if (this.loadingRequests <= 0) {
      this.loadingRequests = 0;
      this._isLoading.next(false);
    }
  }
}
