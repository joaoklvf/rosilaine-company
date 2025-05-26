import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CustomDialogComponent } from 'src/app/components/custom-dialog/custom-dialog.component';
import { DataTableComponent } from 'src/app/components/data-table/data-table.component';
import { DataTableColumnProp } from 'src/app/interfaces/data-table';
import { OrderStatus } from 'src/app/models/order/order-status';
import { OrderStatusService } from 'src/app/services/order/order-status/order-status.service';

@Component({
  selector: 'app-order-status',
  imports: [DataTableComponent, FormsModule],
  templateUrl: './order-status.component.html',
  styleUrl: './order-status.component.scss'
})
export class OrderStatusComponent {
  readonly columns: DataTableColumnProp<OrderStatus>[] = [
    { description: "Status", fieldName: "description", width: '85%' },
  ]
  readonly dialog = inject(MatDialog);
  orderStatus: OrderStatus = new OrderStatus();
  orderStatuses: OrderStatus[] = [];
  @ViewChild("orderStatusDescription") orderStatusDescriptionField: ElementRef = new ElementRef(null);

  constructor(private orderStatusService: OrderStatusService) { }
  ngOnInit(): void {
    this.orderStatusService.get()
      .subscribe(statuses => this.orderStatuses = [...statuses]);
  }

  edit(orderStatus: OrderStatus): void {
    this.orderStatus = { ...orderStatus };
  }

  add() {
    const orderStatus: OrderStatus = {
      ...this.orderStatus,
      description: this.orderStatus.description.trim(),
    };

    if (!orderStatus.description)
      return;

    if (orderStatus.id) {
      this.orderStatusService.update(orderStatus)
        .subscribe(orderStatus => {
          const customerIndex = this.orderStatuses.findIndex(c => c.id === orderStatus.id);
          this.orderStatuses[customerIndex] = orderStatus;
          this.orderStatus = new OrderStatus();
        });
    } else {
      this.orderStatusService.add(orderStatus)
        .subscribe(orderStatus => {
          this.orderStatuses.push(orderStatus);
          this.orderStatus = new OrderStatus();
        });

      this.orderStatusDescriptionField.nativeElement.focus();
    }
  }

  deleteOrderStatus(orderStatus: OrderStatus) {
    this.orderStatusService.update({ ...orderStatus, isDeleted: true })
      .subscribe(orderStatusUpdated => {
        if (!orderStatusUpdated)
          return;

        const orderStatuses = this.orderStatuses.filter(x => x.id !== orderStatus.id);
        this.orderStatuses = [...orderStatuses];
      });
  }

  openDialog(orderStatus: OrderStatus): void {
    this.dialog.open(CustomDialogComponent, {
      width: '500px',
      data: {
        title: "Deletar produto",
        content: `Deseja deletar o produto ${orderStatus.description}?`,
        onConfirmAction: () => this.deleteOrderStatus(orderStatus)
      }
    });
  }
}
