import { Component, OnInit } from '@angular/core';
import { DataTableComponent } from "../../components/data-table/data-table.component";
import { OrderItemStatus } from 'src/app/models/order/order-item/order-item-status';
import { OrderItemStatusService } from 'src/app/services/order/order-item-status/order-item-status.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { OrderItemByStatus } from 'src/app/interfaces/order-item-by-status';
import { OrderItemService } from 'src/app/services/order/order-item/order-item.service';
import { DataTableColumnProp } from 'src/app/interfaces/data-table';
import { Subject, startWith, debounceTime, switchMap } from 'rxjs';
import { DataTableFilter } from 'src/app/components/data-table/data-table-interfaces';

@Component({
  selector: 'app-order-item-by-status',
  imports: [DataTableComponent, MatFormFieldModule, MatSelectModule, FormsModule],
  templateUrl: './order-item-by-status.component.html',
  styleUrl: './order-item-by-status.component.scss'
})
export class OrderItemByStatusComponent implements OnInit {
  readonly columns: DataTableColumnProp<OrderItemByStatus>[] = [
    { description: "Quantidade", fieldName: "amount" },
    { description: "Produto", fieldName: "productDescription" },
    { description: "Status", fieldName: "statusDescription" },
  ]
  orderItemStatuses: OrderItemStatus[] = [];
  itemsByStatus: OrderItemByStatus[] = [];
  private $searchStatus = new Subject<DataTableFilter | string>();
  selectedStatusId?: string;
  dataCount = 0;

  constructor(private orderItemStatusService: OrderItemStatusService, private orderItemService: OrderItemService) { }

  ngOnInit(): void {
    this.$searchStatus.pipe(
      debounceTime(300),
      switchMap((filters) => {
        if (typeof filters === 'string')
          return this.orderItemService.getByStatusId({ statusId: filters, offset: 0, take: 15 })

        return this.orderItemService.getByStatusId({ statusId: filters.filter, offset: filters.offset, take: filters.take })
      }),
    ).subscribe(items => {
      this.itemsByStatus = items[0];
      this.dataCount = items[1]
    });

    this.orderItemStatusService.get().subscribe(statuses => {
      this.orderItemStatuses = statuses[0]
      const id = this.orderItemStatuses[0].id;
      if (id)
        this.filterData(id)
    });
  }

  filterData(filter: DataTableFilter | string) {
    this.$searchStatus.next(filter);
    this.selectedStatusId = typeof filter === 'string' ?
      filter : filter.filter;
  }
}
