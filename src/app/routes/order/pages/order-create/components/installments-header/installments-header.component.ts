import { Component, inject, input, model, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrDatePickerComponent } from 'src/app/components/br-date-picker/br-date-picker.component';
import { CustomDialogComponent } from 'src/app/components/custom-dialog/custom-dialog.component';
import { Order } from 'src/app/models/order/order';
import { OrderRequest } from 'src/app/models/order/order-request';
import { OrderService } from 'src/app/services/order/order.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';

@Component({
  selector: 'app-installments-header',
  imports: [MatSelectModule, ReactiveFormsModule, BrDatePickerComponent, FormsModule, MatSlideToggleModule],
  templateUrl: './installments-header.component.html',
  styleUrl: './installments-header.component.scss'
})
export class InstallmentsHeaderComponent {
  readonly order = input<Order>();
  readonly saveAction = output<Order>();
  readonly dialog = inject(MatDialog);
  readonly firstInstallmentDate = model<Date | null>(null);

  constructor(private orderService: OrderService, private snackBarService: SnackBarService) { }

  get _firstInstallmentDate() {
    return this.firstInstallmentDate();
  }

  get _order() {
    return this.order();
  }

  get installmentsAmount() {
    return this._order?.installments?.length ?? 0;
  }

  ngOnInit(): void {
    this.setDefaultFirstInstallmentDate();
  }

  changeAmountAndRecreateInstallments(installmentsAmount: number) {
    this.dialog.open(CustomDialogComponent, {
      width: '300px',
      data: {
        title: "Alterar quantidade de parcelas",
        content: `Deseja alterar quantidade de parcelas, recriando todas elas?`,
        onConfirmAction: () => this.generateInstallmentsAndSaveOrder({ ... this._order!, installmentsAmount }),
        onCancelAction: () => { }
      }
    });
  }

  changeFirstDateAndRecreateInstallments(firstInstallmentDate: Date) {
    this.dialog.open(CustomDialogComponent, {
      width: '300px',
      data: {
        title: "Alterar primeira data de vencimento",
        content: `Deseja alterar a primeira data de vencimento e recriar as parcelas?`,
        onConfirmAction: () => this.generateInstallmentsAndSaveOrder({ ... this._order!, firstInstallmentDate, installmentsAmount: this.installmentsAmount }),
        onCancelAction: () => this.setDefaultFirstInstallmentDate()
      }
    });
  }

  changeIfIsToRound() {
    this.dialog.open(CustomDialogComponent, {
      width: '300px',
      data: {
        title: "Alterar arredondamento",
        content: `Deseja alterar a arredondamento e recriar as parcelas?`,
        onConfirmAction: () => this.generateInstallmentsAndSaveOrder({ ... this._order!, installmentsAmount: this.installmentsAmount }),
        onCancelAction: () => { }
      }
    });
  }

  public generateInstallmentsAndSaveOrder(order: OrderRequest) {
    const orderRequest: OrderRequest = {
      ...order,
      isToRound: order.isRounded
    };

    this.orderService.update(orderRequest).subscribe(order => {
      this.snackBarService.success('Parcelas atualizadas com sucesso!');
      this.saveAction.emit({ ...order });
    });
  }

  setDefaultFirstInstallmentDate() {
    const date = this._order?.installments?.at(0)?.paymentDate ?? this._order?.firstInstallmentDate ?? null;
    if (date)
      this.firstInstallmentDate.set(new Date(date.toString()))
  }
}
