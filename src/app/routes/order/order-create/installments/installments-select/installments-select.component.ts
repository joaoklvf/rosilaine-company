import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect, MatOption, MatFormField, MatLabel, MatSelectChange } from '@angular/material/select';
import { CustomDialogComponent } from 'src/app/components/custom-dialog/custom-dialog.component';
import { Order } from 'src/app/models/order/order';
import { OrderService } from 'src/app/services/order/order.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';

@Component({
  selector: 'app-installments-select',
  imports: [MatSelect, MatOption, MatFormField, MatLabel, ReactiveFormsModule],
  templateUrl: './installments-select.component.html',
  styleUrl: './installments-select.component.scss'
})
export class InstallmentsSelectComponent implements OnInit {
  readonly order = input.required<Order>();
  readonly saveOrderAction = output<Order>();
  readonly dialog = inject(MatDialog);
  myControl = new FormControl(0);

  constructor(private orderService: OrderService, private snackBarService: SnackBarService) { }
  
  ngOnInit(): void {
    this.myControl.setValue(this.order().installments?.length ?? 0);
  }

  public generateInstallmentsAndSaveOrder(amount: number) {
    const orderWithInstallments = { ...this.orderService.generateInstallments(this.order(), amount) };
    this.orderService.update(orderWithInstallments).subscribe(order => {
      this.snackBarService.success(`Parcelas geradas com sucesso!`);
      this.saveOrderAction.emit({ ...order });
      this.myControl.setValue(order.installments!.length);
    });
  }

  changeInstallments(event: MatSelectChange<number>) {
    if (this.order().installments?.length) {
      this.dialog.open(CustomDialogComponent, {
        width: '250px',
        data: {
          title: "Refazer parcelas",
          content: `Deseja refazer as parcelas?`,
          onConfirmAction: () => this.generateInstallmentsAndSaveOrder(event.value),
          onCancelAction: () => this.myControl.setValue(this.order().installments!.length)
        }
      });
      return;
    }

    this.generateInstallmentsAndSaveOrder(event.value);
  }
}
