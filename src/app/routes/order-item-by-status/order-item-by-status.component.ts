import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from "@angular/material/tabs";
import { catchError, debounceTime, map, of, Subject, switchMap, tap } from 'rxjs';
import { CustomAutocompleteComponent } from "src/app/components/custom-autocomplete/custom-autocomplete.component";
import { CustomDialogComponent } from 'src/app/components/custom-dialog/custom-dialog.component';
import { DataTableColumnProp } from 'src/app/interfaces/data-table';
import { OrderItemByCustomer, OrderItemByStatus } from 'src/app/interfaces/order-item-by-status';
import { Customer } from 'src/app/models/customer/customer';
import { OrderItemStatus } from 'src/app/models/order/order-item/order-item-status';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { OrderItemStatusService } from 'src/app/services/order/order-item-status/order-item-status.service';
import { OrderItemService } from 'src/app/services/order/order-item/order-item.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';
import { getCustomersNameNickName } from 'src/app/utils/text-format';
import { ItemCustomerTable } from "./components/item-customer-table/item-customer-table";
import { ItemStatusTable } from "./components/item-status-table/item-status-table";
import { DEFAULT_FILTER } from './interfaces';
import { DataTablePaginationComponent } from "src/app/components/data-table/data-table-pagination/data-table-pagination.component";
import { Product } from 'src/app/models/product/product';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-order-item-by-status',
  imports: [MatFormFieldModule, MatSelectModule, FormsModule, ItemStatusTable, MatTabsModule, ItemCustomerTable, CustomAutocompleteComponent, DataTablePaginationComponent],
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
  massiveStatusId?: string;
  dataCount = 0;
  selectedIndex = 0;
  customers: Customer[] = [];
  products: Product[] = [];
  page = 1;

  private readonly filters = { ...DEFAULT_FILTER };
  private readonly $searchStatus = new Subject();

  constructor(
    private readonly orderItemStatusService: OrderItemStatusService,
    private readonly orderItemService: OrderItemService,
    private readonly snackBarService: SnackBarService,
    private readonly customerService: CustomerService,
    private readonly productService: ProductService,
  ) { }

  ngOnInit(): void {
    this.$searchStatus.pipe(
      debounceTime(1000),
      switchMap(() => {
        if (this.selectedIndex === 0)
          return this.orderItemService.getByItemStatus(this.filters)

        return this.orderItemService.getByItemCustomerAndStatus(this.filters)
      }),
    ).subscribe(items => {
      if (this.selectedIndex === 0)
        this.itemsByStatus = items[0] as OrderItemByStatus[];

      else
        this.itemsByCustomer = items[0] as OrderItemByCustomer[];

      this.dataCount = items[1];
    });

    this.orderItemStatusService.get().subscribe(statuses => {
      this.orderItemStatuses = statuses[0]
      const id = this.orderItemStatuses[0].id;
      if (!id)
        return;

      this.selectedStatusId = id;
      this.filters.statusId = id;
      this.filterData();
    });
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

  filterProducts(value: string | Product | null) {
    let description = '';
    let productCode = '';
    if (typeof value === 'string') {
      const strNumber = Number(value);
      if (Number.isNaN(strNumber))
        description = value;
      else
        productCode = value;
    }
    else if (value !== null)
      description = value.description;

    this.productService.get({ description, productCode, offset: 0, take: 10 })
      .pipe(
        map(([value]) => value)
      )
      .subscribe(products => this.products = products);
  }

  resetPage() {
    this.page = 1;
    this.filters.offset = 0;
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

  changePageAction(page: number) {
    this.filters.offset = page - 1;
    this.page = page;
    this.filterData();
  }

  onTabChangeAction(index: number) {
    this.selectedIndex = index;
    this.filters.customerId = '';
    this.resetPage();
    this.filterData();
  }

  setCustomer(customer: Customer | null) {
    this.filters.customerId = customer?.id!;
    this.resetPage();
    this.filterData();
  }

  setProduct(product: Product | null) {
    this.filters.productId = product?.id!;
    this.resetPage();
    this.filterData();
  }

  filterData() {
    this.$searchStatus.next(this.filters);
  }

  onStatusChange(statusId: string) {
    this.filters.statusId = statusId;
    this.resetPage();
    this.filterData();
  }
}
