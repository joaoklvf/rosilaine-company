import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomDialogComponentProps } from '../../custom-dialog/custom-dialog.component';
import { MatFormField, MatLabel, MatOption, MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-installment-management',
  imports: [MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatSelect, MatOption, MatFormField, MatLabel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './installment-management.component.html',
  styleUrl: './installment-management.component.scss'
})
export class InstallmentManagementComponent {
  data: CustomDialogComponentProps = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<InstallmentManagementComponent>);

}
