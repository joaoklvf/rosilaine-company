import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

const DEFAULT_CONFIG: MatSnackBarConfig = { verticalPosition: 'top', horizontalPosition: 'right', duration: 3000 };

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private _snackBar: MatSnackBar) {
  }

  error(message: string) {
    return this._snackBar.open(message, 'x', { panelClass: ['snackbar-error'], ...DEFAULT_CONFIG });
  }

  success(message: string) {
    return this._snackBar.open(message, 'x', { panelClass: ['snackbar-success'], ...DEFAULT_CONFIG });
  }

  info(message: string) {
    return this._snackBar.open(message, 'x', { panelClass: ['snackbar-info'], ...DEFAULT_CONFIG });
  }
}
