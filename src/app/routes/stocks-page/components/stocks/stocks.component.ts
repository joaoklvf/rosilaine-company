import { Component, ElementRef, inject, input, output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CustomDialogComponent } from 'src/app/components/custom-dialog/custom-dialog.component';
import { DataTableFilter } from 'src/app/components/data-table/data-table-interfaces';
import { DataTableComponent } from 'src/app/components/data-table/data-table.component';
import { DataTableColumnProp } from 'src/app/interfaces/data-table';
import { Stock } from 'src/app/models/stock/stock';

@Component({
  selector: 'app-stocks',
  imports: [DataTableComponent, FormsModule],
  templateUrl: './stocks.component.html',
})
export class StocksComponent {
  readonly stocks = input<Stock[]>([]);
  readonly addUpdateAction = output<Stock>();
  readonly deleteAction = output<string>();
  readonly filterAction = output<DataTableFilter>();
  readonly dataCount = input(0);
  readonly columns: DataTableColumnProp<Stock>[] = [
    { description: "Estoque", fieldName: "description", width: '85%' },
  ]
  readonly dialog = inject(MatDialog);
  stock: Stock = new Stock();

  @ViewChild("stockDescription") stockDescriptionField: ElementRef = new ElementRef(null);

  edit(stock: Stock): void {
    this.stock = { ...stock };
  }

  add() {
    const stock: Stock = {
      ...this.stock,
      description: this.stock.description.trim(),
    };

    if (!stock.description)
      return;

    this.addUpdateAction.emit(stock);
    this.stock = new Stock();
    this.stockDescriptionField.nativeElement.focus();
  }

  openDialog(stock: Stock): void {
    this.dialog.open(CustomDialogComponent, {
      width: '500px',
      data: {
        title: "Deletar estoque",
        content: `Deseja deletar o estoque ${stock.description}?`,
        onConfirmAction: () => this.deleteAction.emit(stock.id!)
      }
    });
  }

  filterData(event: DataTableFilter) {
    this.filterAction.emit(event);
  }
}
