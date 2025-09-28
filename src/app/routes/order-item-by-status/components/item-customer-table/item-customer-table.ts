import { Component, input, output } from '@angular/core';
import { MatInputModule } from "@angular/material/input";
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { OrderItemByCustomer } from 'src/app/interfaces/order-item-by-status';
import { OrderItemStatus } from 'src/app/models/order/order-item/order-item-status';
import { DataTablePaginationComponent } from "src/app/components/data-table/data-table-pagination/data-table-pagination.component";

@Component({
  selector: 'app-item-customer-table',
  imports: [MatInputModule, MatSelectModule, DataTablePaginationComponent],
  templateUrl: './item-customer-table.html',
  styleUrl: './item-customer-table.scss'
})
export class ItemCustomerTable {
  readonly data = input<OrderItemByCustomer[]>();
  readonly orderItemStatuses = input<OrderItemStatus[]>();
  readonly changeItemStatusAction = output<{ itemId: string, statusId: string, customerId?: string }>();
  readonly dataCount = input(0);
  readonly changePageAction = output<number>();
  currentOffset = 0;

  changeItemStatus(selectEvent: MatSelectChange<string>, productId: string, customerId?: string) {
    const optionSelected = this.orderItemStatuses()?.find(x => x.id === selectEvent.value);
    if (!optionSelected)
      return;

    this.changeItemStatusAction.emit({ itemId: productId, statusId: optionSelected.id!, customerId });
  }

  onChangePage(offset: number) {
    this.changePageAction.emit(offset);
  }
}
