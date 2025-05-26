import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CustomDialogComponent } from 'src/app/components/custom-dialog/custom-dialog.component';
import { DataTableComponent } from 'src/app/components/data-table/data-table.component';
import { DataTableColumnProp } from 'src/app/interfaces/data-table';
import { OrderItemStatus } from 'src/app/models/order/order-item/order-item-status';
import { OrderItemStatusService } from 'src/app/services/order/order-item-status/order-item-status.service';

@Component({
  selector: 'app-order-item-status',
  imports: [DataTableComponent, FormsModule],
  templateUrl: './order-item-status.component.html',
  styleUrl: './order-item-status.component.scss'
})
export class OrderItemStatusComponent {
readonly columns: DataTableColumnProp<OrderItemStatus>[] = [
    { description: "Status", fieldName: "description", width: '85%' },
  ]
  readonly dialog = inject(MatDialog);
  orderItemStatus: OrderItemStatus = new OrderItemStatus();
  orderItemStatuses: OrderItemStatus[] = [];
  @ViewChild("orderItemStatusDescription") orderItemStatusDescriptionField: ElementRef = new ElementRef(null);

  constructor(private orderItemStatusService: OrderItemStatusService) { }
  ngOnInit(): void {
    this.orderItemStatusService.get()
      .subscribe(statuses => this.orderItemStatuses = [...statuses]);
  }

  edit(orderItemStatus: OrderItemStatus): void {
    this.orderItemStatus = { ...orderItemStatus };
  }

  add() {
    const orderItemStatus: OrderItemStatus = {
      ...this.orderItemStatus,
      description: this.orderItemStatus.description.trim(),
    };

    if (!orderItemStatus.description)
      return;

    if (orderItemStatus.id) {
      this.orderItemStatusService.update(orderItemStatus)
        .subscribe(orderItemStatus => {
          const customerIndex = this.orderItemStatuses.findIndex(c => c.id === orderItemStatus.id);
          this.orderItemStatuses[customerIndex] = orderItemStatus;
          this.orderItemStatus = new OrderItemStatus();
        });
    } else {
      this.orderItemStatusService.add(orderItemStatus)
        .subscribe(orderItemStatus => {
          this.orderItemStatuses.push(orderItemStatus);
          this.orderItemStatus = new OrderItemStatus();
        });

      this.orderItemStatusDescriptionField.nativeElement.focus();
    }
  }

  deleteOrderItemStatus(orderItemStatus: OrderItemStatus) {
    this.orderItemStatusService.update({ ...orderItemStatus, isDeleted: true })
      .subscribe(orderItemStatusUpdated => {
        if (!orderItemStatusUpdated)
          return;

        const orderItemStatuses = this.orderItemStatuses.filter(x => x.id !== orderItemStatus.id);
        this.orderItemStatuses = [...orderItemStatuses];
      });
  }

  openDialog(orderItemStatus: OrderItemStatus): void {
    this.dialog.open(CustomDialogComponent, {
      width: '500px',
      data: {
        title: "Deletar status",
        content: `Deseja deletar o status ${orderItemStatus.description}?`,
        onConfirmAction: () => this.deleteOrderItemStatus(orderItemStatus)
      }
    });
  }
}
