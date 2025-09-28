import { Component, input, output } from '@angular/core';
import { OrderItemByStatus } from 'src/app/interfaces/order-item-by-status';
import { MatInputModule } from "@angular/material/input";
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { OrderItemStatus } from 'src/app/models/order/order-item/order-item-status';
import { DataTablePaginationComponent } from "src/app/components/data-table/data-table-pagination/data-table-pagination.component";

@Component({
  selector: 'app-item-status-table',
  imports: [MatInputModule, MatSelectModule, DataTablePaginationComponent],
  templateUrl: './item-status-table.html',
  styleUrl: './item-status-table.scss'
})
export class ItemStatusTable {
  readonly data = input<OrderItemByStatus[]>();
  readonly orderItemStatuses = input<OrderItemStatus[]>();
  readonly changeItemStatusAction = output<{ itemId: string, statusId: string }>();
  readonly dataCount = input(0);
  readonly changePageAction = output<number>();

  changeItemStatus(selectEvent: MatSelectChange<string>, productId: string) {
    const optionSelected = this.orderItemStatuses()?.find(x => x.id === selectEvent.value);
    if (!optionSelected)
      return;

    this.changeItemStatusAction.emit({ itemId: productId, statusId: optionSelected.id! });
  }

  onChangePage(offset: number) {
    this.changePageAction.emit(offset);
  }
}
