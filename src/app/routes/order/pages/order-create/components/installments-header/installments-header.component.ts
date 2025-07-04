import { Component, inject, input, model, output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { BrDatePickerComponent } from 'src/app/components/br-date-picker/br-date-picker.component';
import { CustomDialogComponent } from 'src/app/components/custom-dialog/custom-dialog.component';
import { Order } from 'src/app/models/order/order';
import { OrderRequest } from 'src/app/models/order/order-request';
import { OrderService } from 'src/app/services/order/order.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-installments-header',
  imports: [MatSelectModule, ReactiveFormsModule, BrDatePickerComponent, FormsModule, MatSlideToggleModule],
  templateUrl: './installments-header.component.html',
  styleUrl: './installments-header.component.scss'
})
export class InstallmentsHeaderComponent {
  readonly order = input.required<Order>();
  readonly saveOrderAction = output<Order>();
  readonly dialog = inject(MatDialog);
  readonly firstInstallmentDate = model<Date | null>(null);

  isToRound = true;
  installmentsAmountControl = new FormControl(0);

  constructor(private orderService: OrderService, private snackBarService: SnackBarService) { }

  get _firstInstallmentDate() {
    return this.firstInstallmentDate();
  }

  get _order() {
    return this.order();
  }

  ngOnInit(): void {
    this.installmentsAmountControl.setValue(this.order().installments?.length ?? 0);
    this.setDefaultFirstInstallmentDate();
  }

  changeAmountAndRecreateInstallments(installmentsAmount: number) {
    this.dialog.open(CustomDialogComponent, {
      width: '250px',
      data: {
        title: "Alterar quantidade de parcelas",
        content: `Deseja alterar quantidade de parcelas, recriando todas elas?`,
        onConfirmAction: () => this.generateInstallmentsAndSaveOrder({ ... this._order, installmentsAmount }),
        onCancelAction: () => this.installmentsAmountControl.setValue(this.order().installments!.length)
      }
    });
  }

  changeFirstDateAndRecreateInstallments(firstInstallmentDate: Date) {
    const installmentsAmount = this._order.installments?.length;
    this.dialog.open(CustomDialogComponent, {
      width: '250px',
      data: {
        title: "Alterar primeira data de vencimento",
        content: `Deseja alterar a primeira data de vencimento e recriar as parcelas?`,
        onConfirmAction: () => this.generateInstallmentsAndSaveOrder({ ... this._order, firstInstallmentDate, installmentsAmount }),
        onCancelAction: () => this.setDefaultFirstInstallmentDate()
      }
    });
  }

  public generateInstallmentsAndSaveOrder(order: OrderRequest) {
    const orderRequest: OrderRequest = {
      ...order,
      isToRound: this.isToRound
    };

    this.orderService.update(orderRequest).subscribe(order => {
      this.snackBarService.success('Parcelas atualizadas com sucesso!');
      this.saveOrderAction.emit({ ...order });
      this.installmentsAmountControl.setValue(order.installments!.length);
    });
  }

  setDefaultFirstInstallmentDate() {
    const date = this._order.installments?.at(0)?.paymentDate ?? this._order.firstInstallmentDate ?? null;
    if (date)
      this.firstInstallmentDate.set(new Date(date.toString()))
  }
}
