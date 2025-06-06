import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InstallmentsSelectComponent } from "../installments-select/installments-select.component";
import { Order } from 'src/app/models/order/order';
import { getBrCurrencyStr, getBrDateStr } from 'src/app/utils/text-format';
import { InputMaskComponent } from 'src/app/components/input-mask/input-mask.component';
import { OrderInstallment } from 'src/app/models/order/order-installment';
import { FormsModule } from '@angular/forms';
import { BrDatePickerComponent } from 'src/app/components/br-date-picker/br-date-picker.component';
import { OrderInstallmentService } from 'src/app/services/order/order-installment/order-installment.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';
import { tap, catchError, of } from 'rxjs';

interface ModalProps {
  order: Order;
  saveOrder: (order: Order) => void,
}

@Component({
  selector: 'app-installment-management',
  imports: [MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, InstallmentsSelectComponent, InputMaskComponent, FormsModule, BrDatePickerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './installment-management.component.html',
  styleUrl: './installment-management.component.scss'
})
export class InstallmentManagementComponent implements OnInit {
  data: ModalProps = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<InstallmentManagementComponent>);
  installments!: OrderInstallment[];

  constructor(private orderInstallmentService: OrderInstallmentService, private snackBarService: SnackBarService) { }

  ngOnInit(): void {
    this.data.order.firstInstallmentDate = this.data.order.firstInstallmentDate ?? this.data.order.installments![0].debitDate;
    this.installments = this.data.order.installments!.map(x => ({ ...x }));
  }

  getBrDate = (value: Date | null) =>
    value && getBrDateStr(value);

  getCurrencyValue = (value: number | null) =>
    value && getBrCurrencyStr(value);

  setInstallmentAmountPaid(value: number, installment: OrderInstallment) {
    installment.amountPaid = value;
  }

  setInstallmentPaymentDate(value: Date, installment: OrderInstallment) {
    installment.paymentDate = value;
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
          this.data.saveOrder({ ...this.data.order, installments })
          this.snackBarService.success('Parcelas atualizadas com sucesso');
          this.dialogRef.close();
        }),
        catchError(() => of(this.snackBarService.error('Falha ao atualizar parcelas')))
      )
      .subscribe();
  }
}
