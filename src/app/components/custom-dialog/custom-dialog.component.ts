import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

export interface CustomDialogComponentProps {
  title: string
  content: string | Node
  onConfirmAction: () => void;
  onCancelAction?: () => void;
  cancelButtonTitle?: string;
  confirmButtonTitle?: string;
}

@Component({
  selector: 'app-custom-dialog',
  imports: [MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './custom-dialog.component.html',
  styleUrl: './custom-dialog.component.scss'
})
export class CustomDialogComponent {
  data: CustomDialogComponentProps = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<CustomDialogComponent>);
  readonly cancelButtonTitle = this.data.cancelButtonTitle ?? "Cancelar";
  readonly confirmButtonTitle = this.data.confirmButtonTitle ?? "Confirmar";

  onCancelButtonClick() {
    this.data.onCancelAction && this.data.onCancelAction();
  }
}
