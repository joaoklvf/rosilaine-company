import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { catchError, debounceTime, of, Subject, switchMap, tap } from 'rxjs';
import { CustomDialogComponent } from 'src/app/components/custom-dialog/custom-dialog.component';
import { DataTableFilter } from 'src/app/components/data-table/data-table-interfaces';
import { DataTableColumnProp } from 'src/app/interfaces/data-table';
import { OrderItemByStatus } from 'src/app/interfaces/order-item-by-status';
import { OrderItem } from 'src/app/models/order/order-item/order-item';
import { OrderItemStatus } from 'src/app/models/order/order-item/order-item-status';
import { OrderItemStatusService } from 'src/app/services/order/order-item-status/order-item-status.service';
import { OrderItemService } from 'src/app/services/order/order-item/order-item.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';
import { DataTablePaginationComponent } from "src/app/components/data-table/data-table-pagination/data-table-pagination.component";

@Component({
  selector: 'app-order-item-by-status',
  imports: [MatFormFieldModule, MatSelectModule, FormsModule, DataTablePaginationComponent],
  templateUrl: './order-item-by-status.component.html',
  styleUrl: './order-item-by-status.component.scss'
})
export class OrderItemByStatusComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  readonly columns: DataTableColumnProp<OrderItemByStatus>[] = [
    { description: "Quantidade", fieldName: "amount" },
    { description: "Produto", fieldName: "productDescription" },
    { description: "Status", fieldName: "statusDescription" },
    { description: "Status", fieldName: "statusDescription" },
  ]

  orderItemStatuses: OrderItemStatus[] = [];
  itemsByStatus: OrderItemByStatus[] = [];
  private readonly $searchStatus = new Subject<DataTableFilter | string>();
  selectedStatusId?: string;
  massiveStatusId?: string;
  dataCount = 0;

  constructor(
    private readonly orderItemStatusService: OrderItemStatusService,
    private readonly orderItemService: OrderItemService,
    private readonly snackBarService: SnackBarService
  ) { }

  ngOnInit(): void {
    this.$searchStatus.pipe(
      debounceTime(1000),
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
    if (typeof filter === 'string') {
      this.$searchStatus.next(filter);
      this.selectedStatusId = filter;
      return;
    }

    this.$searchStatus.next({ ...filter, filter: this.selectedStatusId });
  }

  openDialog(): void {
    if (!this.massiveStatusId || !this.selectedStatusId)
      return;

    const status = this.orderItemStatuses.find(x => x.id === this.massiveStatusId)
    if (!status)
      return;

    this.dialog.open(CustomDialogComponent, {
      width: '500px',
      data: {
        title: "Atualizar produtos",
        content: `Deseja atualizar TODOS os produtos para o status\n${status.description.toUpperCase()}?`,
        onConfirmAction: () => this.updateItems(this.selectedStatusId!, status.id!)
      }
    });
  }

  updateItems(oldId: string, newId: string) {
    this.orderItemService.changeManyStatus(oldId, newId)
      .pipe(
        tap(_ => {
          this.snackBarService.success('Alteração realizada com sucesso');
          this.$searchStatus.next(this.selectedStatusId!)
        }),
        catchError(() => of(this.snackBarService.error('Falha ao alterar status')))
      )
      .subscribe();
  }

  changeItemStatus(selectEvent: MatSelectChange<string>, productId: string) {
    const optionSelected = this.orderItemStatuses.find(x => x.id === selectEvent.value);
    if (!optionSelected)
      return;

    this.updateItem(optionSelected.id!, productId);
  }

  updateItem(statusId: string, productId: string) {
    this.orderItemService.changeStatusByProduct(statusId, productId)
      .pipe(
        tap(_ => {
          this.snackBarService.success('Alteração realizada com sucesso');
          this.$searchStatus.next(this.selectedStatusId!)
        }),
        catchError(() => of(this.snackBarService.error('Falha ao alterar status')))
      )
      .subscribe();
  }

  changePageAction(skip: number) {
    this.filterData({ filter: '', offset: skip, take: 15 })
  }

  get pagesCount() {
    return Math.ceil(this.dataCount / 15);
  }
}
