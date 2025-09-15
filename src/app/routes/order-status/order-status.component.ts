import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject, startWith, debounceTime, switchMap, catchError, of, tap } from 'rxjs';
import { CustomDialogComponent } from 'src/app/components/custom-dialog/custom-dialog.component';
import { DataTableFilter } from 'src/app/components/data-table/data-table-interfaces';
import { DataTableComponent } from 'src/app/components/data-table/data-table.component';
import { DataTableColumnProp } from 'src/app/interfaces/data-table';
import { OrderStatus } from 'src/app/models/order/order-status';
import { OrderStatusService } from 'src/app/services/order/order-status/order-status.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';

@Component({
  selector: 'app-order-status',
  imports: [DataTableComponent, FormsModule],
  templateUrl: './order-status.component.html',
  styleUrl: './order-status.component.scss'
})
export class OrderStatusComponent implements OnInit {
  private readonly searchText$ = new Subject<DataTableFilter | string>();
  readonly columns: DataTableColumnProp<OrderStatus>[] = [
    { description: "Status", fieldName: "description", width: '85%' },
  ]
  readonly dialog = inject(MatDialog);
  orderStatus: OrderStatus = new OrderStatus();
  orderStatuses: OrderStatus[] = [];
  dataCount = 0;
  addUpdateButtonText = 'Adicionar';

  @ViewChild("orderStatusDescription") orderStatusDescriptionField: ElementRef = new ElementRef(null);

  constructor(
    private readonly orderStatusService: OrderStatusService,
    private readonly snackBarService: SnackBarService,
  ) { }

  ngOnInit() {
    this.searchText$.pipe(
      startWith(''),
      debounceTime(1000),
      switchMap((filters) => {
        if (typeof filters === 'string')
          return this.orderStatusService.get({ description: filters, offset: 0, take: 15 })

        return this.orderStatusService.get({ description: filters.filter, offset: filters.offset, take: filters.take })
      }),
    ).subscribe(orderStatuses => {
      this.orderStatuses = orderStatuses[0];
      this.dataCount = orderStatuses[1]
    });
  }

  edit(orderStatus: OrderStatus): void {
    this.orderStatus = { ...orderStatus };
    this.addUpdateButtonText = 'Atualizar';
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
    
    this.addUpdateButtonText = 'Adicionar';
  }

  openDialog(itemStatus: OrderStatus): void {
    this.dialog.open(CustomDialogComponent, {
      width: '500px',
      data: {
        title: "Deletar status",
        content: `Deseja deletar o status ${itemStatus.description}?`,
        onConfirmAction: () => this.deleteOrderStatusById(itemStatus.id!)
      }
    });
  }

  deleteOrderStatusById(id: string) {
    this.orderStatusService.safeDelete(id)
      .pipe(
        tap(_ => {
          this.snackBarService.success('Status deletado com sucesso');
          this.searchText$.next('');
        }),
        catchError(() => of(this.snackBarService.error('Falha ao deletar status')))
      )
      .subscribe();
  }

  filterData(customerName: DataTableFilter) {
    this.searchText$.next(customerName);
  }
}
