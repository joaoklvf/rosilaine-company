import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject, startWith, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { CustomDialogComponent } from 'src/app/components/custom-dialog/custom-dialog.component';
import { DataTableFilter } from 'src/app/components/data-table/data-table-interfaces';
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
  private searchText$ = new Subject<DataTableFilter>();
  readonly columns: DataTableColumnProp<OrderItemStatus>[] = [
    { description: "Status", fieldName: "description", width: '85%' },
  ]
  readonly dialog = inject(MatDialog);
  orderItemStatus: OrderItemStatus = new OrderItemStatus();
  orderItemStatuses: OrderItemStatus[] = [];
  dataCount = 0;

  @ViewChild("orderItemStatusDescription") orderItemStatusDescriptionField: ElementRef = new ElementRef(null);

  constructor(private orderItemStatusService: OrderItemStatusService) { }

  ngOnInit() {
    this.searchText$.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((filters) => {
        if (typeof filters === 'string')
          return this.orderItemStatusService.get({ description: filters })

        return this.orderItemStatusService.get({ description: filters.filter, skip: filters.skip, take: filters.take })
      }),
    ).subscribe(orderItems => {
      this.orderItemStatuses = orderItems[0];
      this.dataCount = orderItems[1]
    });
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

  filterData(customerName: DataTableFilter) {
    this.searchText$.next(customerName);
  }
}
