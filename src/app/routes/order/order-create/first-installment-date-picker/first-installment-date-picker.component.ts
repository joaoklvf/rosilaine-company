import { Component, inject, input, model, OnInit, output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BrDatePickerComponent } from 'src/app/components/br-date-picker/br-date-picker.component';
import { CustomDialogComponent } from 'src/app/components/custom-dialog/custom-dialog.component';
import { Order } from 'src/app/models/order/order';
import { OrderRequest } from 'src/app/models/order/order-request';
import { OrderService } from 'src/app/services/order/order.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';

@Component({
  selector: 'app-first-installment-date-picker',
  imports: [BrDatePickerComponent],
  templateUrl: './first-installment-date-picker.component.html',
  styleUrl: './first-installment-date-picker.component.scss'
})

export class FirstInstallmentDatePickerComponent implements OnInit {
  readonly order = input.required<Order>();
  readonly saveOrderAction = output<Order>();
  readonly dialog = inject(MatDialog);
  readonly firstInstallmentDate = model<Date | null>(null);
  readonly isToRound = input(true);

  constructor(private orderService: OrderService, private snackBarService: SnackBarService) { }

  get _firstInstallmentDate() {
    return this.firstInstallmentDate();
  }

  get _order() {
    return this.order();
  }

  ngOnInit(): void {
    this.setDefaultFirstInstallmentDate();
  }

  setDefaultFirstInstallmentDate() {
    const date = this._order.installments?.at(0)?.paymentDate ?? this._order.firstInstallmentDate ?? null;
    if (date)
      this.firstInstallmentDate.set(new Date(date.toString()))
  }

  public generateInstallmentsAndSaveOrder(firstInstallmentDate: Date) {
    const order: OrderRequest = {
      ...this._order,
      firstInstallmentDate,
      installmentsAmount: this._order.installments!.length,
      isToRound: this.isToRound()
    };

    this.orderService.update(order).subscribe(order => {
      this.snackBarService.success('Parcelas atualizadas com sucesso!');
      this.saveOrderAction.emit({ ...order });
    });
  }

  changeInstallments(value: Date) {
    if (!this._order.installments?.length) {
      this.generateInstallmentsAndSaveOrder(value);
      return;
    }

    this.dialog.open(CustomDialogComponent, {
      width: '250px',
      data: {
        title: "Refazer parcelas",
        content: `Deseja refazer as parcelas?`,
        onConfirmAction: () => this.generateInstallmentsAndSaveOrder(value),
        onCancelAction: () => this.setDefaultFirstInstallmentDate()
      }
    });
  }
}
