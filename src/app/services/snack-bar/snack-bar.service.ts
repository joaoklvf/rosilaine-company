import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private _snackBar: MatSnackBar) {
  }

  error(message: string) {
    return this._snackBar.open(message, 'x', { panelClass: ['snackbar-error'], verticalPosition: 'top', horizontalPosition: 'right' });
  }

  success(message: string) {
    return this._snackBar.open(message, 'x', { panelClass: ['snackbar-success'], verticalPosition: 'top', horizontalPosition: 'right' });
  }

  info(message: string) {
    return this._snackBar.open(message, 'x', { panelClass: ['snackbar-info'], verticalPosition: 'top', horizontalPosition: 'right' });
  }
}
