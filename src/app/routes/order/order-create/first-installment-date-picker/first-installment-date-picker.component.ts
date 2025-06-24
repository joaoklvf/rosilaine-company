import { Component, inject, input, OnInit, output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BrDatePickerComponent } from 'src/app/components/br-date-picker/br-date-picker.component';
import { CustomDialogComponent } from 'src/app/components/custom-dialog/custom-dialog.component';
import { Order } from 'src/app/models/order/order';
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
  firstInstallmentDate: Date | null = null;
  constructor(private orderService: OrderService, private snackBarService: SnackBarService) { }

  get _order() {
    return this.order();
  }

  ngOnInit(): void {
    this.setDefaultFirstInstallmentDate();
  }

  setDefaultFirstInstallmentDate() {
    const date = this._order.installments?.at(0)?.paymentDate ?? this._order.firstInstallmentDate ?? null;
    if (date)
      this.firstInstallmentDate = new Date(date.toString())
  }

  public generateInstallmentsAndSaveOrder(firstInstallmentDate: Date) {
    const order = this.orderService.generateInstallments({ ...this._order, firstInstallmentDate }, this._order.installments!.length);

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
