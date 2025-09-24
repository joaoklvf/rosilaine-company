import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { catchError, of, tap } from 'rxjs';
import { BrDatePickerComponent } from 'src/app/components/br-date-picker/br-date-picker.component';
import { InputMaskComponent } from 'src/app/components/input-mask/input-mask.component';
import { OrderInstallment } from 'src/app/models/order/order-installment';
import { OrderService } from 'src/app/services/order/order.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';
import { getBrCurrencyStr, getBrDateStr } from 'src/app/utils/text-format';
import { InstallmentsHeaderComponent } from "../installments-header/installments-header.component";
import { IInstallmentHeader } from '../installments-header/interfaces';
import { ManagementInstallments, ModalProps } from './interfaces';

@Component({
  selector: 'app-installments-management',
  imports: [MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, InputMaskComponent, FormsModule, BrDatePickerComponent, InstallmentsHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './installments-management.component.html',
  styleUrl: './installments-management.component.scss'
})
export class InstallmentManagementComponent implements OnInit {
  data: ModalProps = inject(MAT_DIALOG_DATA);
  installments: ManagementInstallments[] = [];

  readonly dialogRef = inject(MatDialogRef<InstallmentManagementComponent>);

  constructor(
    private readonly orderService: OrderService,
    private readonly snackBarService: SnackBarService
  ) { }

  ngOnInit(): void {
    if (this.data.installments)
      this.installments = this.data.installments?.map(x => ({ ...x, originalAmount: x.amount }));
  }

  getBrDate = (value: Date | null) =>
    value && getBrDateStr(value);

  getCurrencyValue = (value: number | null) =>
    value && getBrCurrencyStr(value);

  installmentPayment(value: number, installment: OrderInstallment) {
    installment.amountPaid = value;
    this.updateNextInstallmentPayment(installment, value);
  }

  updateNextInstallmentPayment(prevInstallment: OrderInstallment, valuePaid: number) {
    if (valuePaid === 0)
      return;

    const installments = [...this.installments];
    const currentInstallmentIndex = installments.findIndex(x => x.id === prevInstallment.id);
    const nextInstallmentIndex = currentInstallmentIndex + 1;
    const nextInstallment = installments[nextInstallmentIndex];
    if (!nextInstallment)
      return;

    const paidDifference = valuePaid - prevInstallment.amount;
    if (!paidDifference)
      return;

    const newAmount = nextInstallment.originalAmount - paidDifference;
    if (newAmount < 0)
      return;

    installments[nextInstallmentIndex].amount = newAmount;
    this.installments = [...installments];
  }

  setInstallmentsAmount(value: number, installment: OrderInstallment) {
    installment.amount = value;
  }

  setInstallmentPaymentDate(value: Date, installment: OrderInstallment) {
    installment.paymentDate = value;
  }

  setInstallmentDebitDate(value: Date, installment: OrderInstallment) {
    installment.debitDate = value;
  }

  setFirstInstallmentDate(value: Date) {
    this.data.firstInstallmentDate = value;
  }

  setInstallmentPaidAmount(installment: OrderInstallment) {
    installment.amountPaid = installment.amount;
  }

  setInstallmentPaidDate(installment: OrderInstallment) {
    installment.paymentDate = installment.debitDate;
  }

  saveHeader(headerData: IInstallmentHeader) {
    this.data.saveHeaderAction(headerData);
    this.dialogRef.close();
  }

  saveInstallments() {
    const installmentsRequest = this.installments.map(({ originalAmount, ...rest }) => ({ ...rest }));
    this.orderService.updateInstallments(installmentsRequest, this.data.orderId)
      .pipe(
        tap(_ => {
          this.data.saveInstallments(installmentsRequest);
          this.snackBarService.success('Parcelas atualizadas com sucesso');
          this.dialogRef.close();
        }),
        catchError(() => of(this.snackBarService.error('Falha ao atualizar parcelas')))
      )
      .subscribe();
  }
}
