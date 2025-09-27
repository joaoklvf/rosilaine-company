import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { catchError, debounceTime, map, of, Subject, switchMap, tap } from 'rxjs';
import { CustomDialogComponent } from 'src/app/components/custom-dialog/custom-dialog.component';
import { DataTableFilter } from 'src/app/components/data-table/data-table-interfaces';
import { DataTablePaginationComponent } from "src/app/components/data-table/data-table-pagination/data-table-pagination.component";
import { DataTableColumnProp } from 'src/app/interfaces/data-table';
import { OrderItemByStatus, OrderItemByCustomer } from 'src/app/interfaces/order-item-by-status';
import { OrderItemStatus } from 'src/app/models/order/order-item/order-item-status';
import { OrderItemStatusService } from 'src/app/services/order/order-item-status/order-item-status.service';
import { OrderItemService } from 'src/app/services/order/order-item/order-item.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';
import { ItemStatusTable } from "./components/item-status-table/item-status-table";
import { ItemCustomerTable } from "./components/item-customer-table/item-customer-table";
import { MatTabsModule } from "@angular/material/tabs";
import { CustomAutocompleteComponent } from "src/app/components/custom-autocomplete/custom-autocomplete.component";
import { Customer } from 'src/app/models/customer/customer';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { getCustomersNameNickName } from 'src/app/utils/text-format';

@Component({
  selector: 'app-order-item-by-status',
  imports: [MatFormFieldModule, MatSelectModule, FormsModule, DataTablePaginationComponent, ItemStatusTable, MatTabsModule, ItemCustomerTable, CustomAutocompleteComponent],
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
  itemsByCustomer: OrderItemByCustomer[] = [];
  selectedStatusId?: string;
  selectedCustomerId?: string;
  massiveStatusId?: string;
  dataCount = 0;
  selectedIndex = 0;
  customers: Customer[] = [];
  private readonly $searchStatus =
    new Subject<DataTableFilter | string>();

  constructor(
    private readonly orderItemStatusService: OrderItemStatusService,
    private readonly orderItemService: OrderItemService,
    private readonly snackBarService: SnackBarService,
    private readonly customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.$searchStatus.pipe(
      debounceTime(1000),
      switchMap((filters) => {
        if (this.selectedIndex === 0) {
          if (typeof filters === 'string')
            return this.orderItemService.getByItemStatus({ statusId: filters, offset: 0, take: 15 })

          return this.orderItemService.getByItemStatus({ statusId: filters.filter, offset: filters.offset, take: filters.take })
        }

        if (typeof filters === 'string')
          return this.orderItemService.getByItemCustomerAndStatus({ statusId: this.selectedStatusId, customerId: this.selectedCustomerId, offset: 0, take: 15 })

        return this.orderItemService.getByItemCustomerAndStatus({ statusId: filters.filter, offset: filters.offset, take: filters.take })
      }),
    ).subscribe(items => {
      if (this.selectedIndex === 0) {
        this.itemsByStatus = items[0] as OrderItemByStatus[];
        this.dataCount = items[1];
        return;
      }

      this.itemsByCustomer = items[0] as OrderItemByCustomer[];
      this.dataCount = items[1];
    });

    this.orderItemStatusService.get().subscribe(statuses => {
      this.orderItemStatuses = statuses[0]
      const id = this.orderItemStatuses[0].id;
      if (id)
        this.filterDataByStatusId(id)
    });
  }

  filterDataByStatusId(filter: DataTableFilter | string) {
    if (typeof filter === 'string') {
      this.selectedStatusId = filter;
      this.$searchStatus.next(filter);
      return;
    }

    this.$searchStatus.next({ ...filter, filter: this.selectedStatusId });
  }

  filterDataByCustomerId(filter: DataTableFilter | string) {
    if (typeof filter === 'string') {
      this.$searchStatus.next(filter);
      this.selectedCustomerId = filter;
      return;
    }

    this.$searchStatus.next({ ...filter, filter: this.selectedCustomerId });
  }

  filterCustomers(value: string | Customer | null) {
    let name = '';
    if (typeof value === 'string')
      name = value;
    else if (value !== null)
      name = value.name;

    this.customerService.get({ name, offset: 0, take: 10 })
      .pipe(
        map(([value]) => value)
      )
      .subscribe(customers => this.customers = getCustomersNameNickName(customers));
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

  changeItemStatus({ statusId, itemId, customerId }: { itemId: string, statusId: string, customerId?: string }) {
    this.updateItem(statusId, itemId, customerId);
  }

  updateItem(statusId: string, productId: string, customerId?: string) {
    this.orderItemService.changeStatusByProduct(statusId, productId, customerId)
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
    this.filterDataByStatusId({ filter: '', offset: skip, take: 15 })
  }

  onTabChangeAction(index: number) {
    this.selectedIndex = index;
    this.filterDataByStatusId({ filter: '', offset: 0, take: 15 });
  }

  setCustomer(customer: Customer | null) {
    this.filterDataByCustomerId(customer?.id ?? '');
  }
}
