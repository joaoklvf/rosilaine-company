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
  readonly installmentsAmount = model(1);
  readonly isToRound = model(false);

  constructor(private readonly orderService: OrderService, private readonly snackBarService: SnackBarService) { }

  ngOnInit(): void {
    this.setDefaultFirstInstallmentDate();
    this.setDefaultInstallmentsAmount();
    this.setDefaultIsToRound();
  }

  changeAmountAndRecreateInstallments(installmentsAmount: number) {
    this.dialog.open(CustomDialogComponent, {
      width: '300px',
      data: {
        title: "Alterar quantidade de parcelas",
        content: `Deseja alterar quantidade de parcelas, recriando todas elas?`,
        onConfirmAction: () => this.generateInstallmentsAndSaveOrder({ ... this.order()!, installmentsAmount }),
        onCancelAction: () => this.setDefaultInstallmentsAmount()
      }
    });
  }

  changeFirstDateAndRecreateInstallments(firstInstallmentDate: Date) {
    this.dialog.open(CustomDialogComponent, {
      width: '300px',
      data: {
        title: "Alterar primeira data de vencimento",
        content: `Deseja alterar a primeira data de vencimento e recriar as parcelas?`,
        onConfirmAction: () => this.generateInstallmentsAndSaveOrder({ ... this.order()!, firstInstallmentDate, installmentsAmount: this.installmentsAmount() }),
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
        onConfirmAction: () => this.generateInstallmentsAndSaveOrder({ ... this.order()!, installmentsAmount: this.installmentsAmount() }),
        onCancelAction: () => { this.setDefaultIsToRound() }
      }
    });
  }

  public generateInstallmentsAndSaveOrder(order: OrderRequest) {
    const orderRequest: OrderRequest = {
      ...order,
      isToRound: order.isRounded
    };
    console.log('orderRequest', orderRequest);

    this.orderService.recreateInstallments(orderRequest).subscribe(updatedInstallments => {
      this.snackBarService.success('Parcelas atualizadas com sucesso!');
      this.saveAction.emit({ ...order, installments: updatedInstallments });
    });
  }

  setDefaultFirstInstallmentDate() {
    const date = this.order()?.installments?.at(0)?.paymentDate ?? this.order()?.firstInstallmentDate ?? null;
    if (date)
      this.firstInstallmentDate.set(new Date(date.toString()))
  }

  setDefaultInstallmentsAmount() {
    const amount = this.order()?.installments?.length ?? 1;
    this.installmentsAmount.set(amount);
  }

  setDefaultIsToRound() {
    this.isToRound.set(this.order()?.isRounded!);
  }
}
