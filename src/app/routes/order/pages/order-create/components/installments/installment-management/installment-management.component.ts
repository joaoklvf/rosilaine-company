import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { catchError, of, tap } from 'rxjs';
import { BrDatePickerComponent } from 'src/app/components/br-date-picker/br-date-picker.component';
import { InputMaskComponent } from 'src/app/components/input-mask/input-mask.component';
import { Order } from 'src/app/models/order/order';
import { OrderInstallment } from 'src/app/models/order/order-installment';
import { OrderInstallmentService } from 'src/app/services/order/order-installment/order-installment.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';
import { getBrCurrencyStr, getBrDateStr } from 'src/app/utils/text-format';
import { InstallmentsHeaderComponent } from "../../installments-header/installments-header.component";

interface ModalProps {
  order: Order;
  saveOrder: (order: Order) => void,
}

@Component({
  selector: 'app-installment-management',
  imports: [MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, InputMaskComponent, FormsModule, BrDatePickerComponent, InstallmentsHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './installment-management.component.html',
  styleUrl: './installment-management.component.scss'
})
export class InstallmentManagementComponent implements OnInit {
  data: ModalProps = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<InstallmentManagementComponent>);
  installments: OrderInstallment[] = [];

  constructor(private orderInstallmentService: OrderInstallmentService, private snackBarService: SnackBarService) { }

  ngOnInit(): void {
    if (this.data.order.installments)
      this.installments = this.data.order.installments?.map(x => ({ ...x }));
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

    const newAmount = nextInstallment.amount - paidDifference;
    if (newAmount < 0)
      return;

    installments[nextInstallmentIndex].amount = newAmount;
    this.installments = [...installments];
  }

  setInstallmentAmount(value: number, installment: OrderInstallment) {
    installment.amount = value;
  }

  setInstallmentPaymentDate(value: Date, installment: OrderInstallment) {
    installment.paymentDate = value;
  }

  setInstallmentDebitDate(value: Date, installment: OrderInstallment) {
    installment.debitDate = value;
  }

  setFirstInstallmentDate(value: Date) {
    this.data.order.firstInstallmentDate = value;
  }

  setInstallmentPaidAmount(installment: OrderInstallment) {
    installment.amountPaid = installment.amount;
  }

  setInstallmentPaidDate(installment: OrderInstallment) {
    installment.paymentDate = installment.debitDate;
  }

  saveInstallments() {
    this.orderInstallmentService.updateMany(this.installments)
      .pipe(
        tap(_ => {
          const installments = this.installments.map(x => ({ ...x }));
          this.data.saveOrder({ ...this.data.order, installments, firstInstallmentDate: installments[0].debitDate })
          this.snackBarService.success('Parcelas atualizadas com sucesso');
          this.dialogRef.close();
        }),
        catchError(() => of(this.snackBarService.error('Falha ao atualizar parcelas')))
      )
      .subscribe();
  }

  saveOrder(order: Order) {
    if (!order.installments)
      return;

    this.data.saveOrder(order);
    this.installments = [...order.installments];
  }

  changeInstallments(order: Order) {
    if (!order.installments)
      return;

    this.installments = order.installments.map(x => ({ ...x }));
    this.data.saveOrder(order);
  }
}
