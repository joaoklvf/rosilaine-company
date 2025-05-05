import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InstallmentsSelectComponent } from "../installments-select/installments-select.component";
import { Order } from 'src/app/models/order/order';
import { getCurrencyStrBr, getDateStrBr } from 'src/app/utils/text-format';

interface ModalProps {
  order: Order;
  saveOrder: (order: Order) => void
}

@Component({
  selector: 'app-installment-management',
  imports: [MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, NgFor, InstallmentsSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './installment-management.component.html',
  styleUrl: './installment-management.component.scss'
})
export class InstallmentManagementComponent {
  data: ModalProps = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<InstallmentManagementComponent>);

  getBrDate = (value: Date | null) =>
    value && getDateStrBr(value);

  getCurrencyValue = (value: number | null) =>
    value && getCurrencyStrBr(value);
}
