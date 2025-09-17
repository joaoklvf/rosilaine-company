import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { startWith, debounceTime, switchMap, Subject, catchError, of, tap } from 'rxjs';
import { CustomDialogComponent } from 'src/app/components/custom-dialog/custom-dialog.component';
import { DataTableFilter } from 'src/app/components/data-table/data-table-interfaces';
import { DataTableComponent } from 'src/app/components/data-table/data-table.component';
import { DataTableColumnProp } from 'src/app/interfaces/data-table';
import { CustomerTag } from 'src/app/models/customer/customer-tag';
import { CustomerTagService } from 'src/app/services/customer/customer-tag/customer-tag.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';

@Component({
  selector: 'app-customer-tags',
  imports: [DataTableComponent, FormsModule],
  templateUrl: './customer-tags.component.html',
})
export class CustomerTagsComponent {
  readonly columns: DataTableColumnProp<CustomerTag>[] = [
    { description: "Tag", fieldName: "description", width: '85%' },
  ]
  readonly dialog = inject(MatDialog);
  customerTag: CustomerTag = new CustomerTag();
  customerTags: CustomerTag[] = [];
  dataCount = 0;
  @ViewChild("customerTagDescription") customerTagDescriptionField: ElementRef = new ElementRef(null);
  private searchText$ = new Subject<DataTableFilter | string>();

  constructor(private customerTagService: CustomerTagService, private snackBarService: SnackBarService) { }
  ngOnInit(): void {
    this.searchText$.pipe(
      startWith(''),
      debounceTime(1000),
      switchMap((filters) => {
        if (typeof filters === 'string')
          return this.customerTagService.get({ description: filters, offset: 0, take: 15 })

        return this.customerTagService.get({ description: filters.filter, offset: filters.offset, take: filters.take })
      }),
    ).subscribe(customerTags => {
      this.customerTags = customerTags[0]
      this.dataCount = customerTags[1]
    });
  }

  edit(customerTag: CustomerTag): void {
    this.customerTag = { ...customerTag };
  }

  add() {
    const customerTag: CustomerTag = {
      ...this.customerTag,
      description: this.customerTag.description.trim(),
    };

    if (!customerTag.description)
      return;

    if (customerTag.id) {
      this.customerTagService.update(customerTag)
        .subscribe(customerTag => {
          const customerIndex = this.customerTags.findIndex(c => c.id === customerTag.id);
          this.customerTags[customerIndex] = customerTag;
          this.customerTag = new CustomerTag();
        });
    } else {
      this.customerTagService.add(customerTag)
        .subscribe(customerTag => {
          this.customerTags.push(customerTag);
          this.customerTag = new CustomerTag();
        });

      this.customerTagDescriptionField.nativeElement.focus();
    }
  }

  openDialog(customerTag: CustomerTag): void {
    this.dialog.open(CustomDialogComponent, {
      width: '500px',
      data: {
        title: "Deletar tag",
        content: `Deseja deletar a tag ${customerTag.description}?`,
        onConfirmAction: () => this.deleteCustomerTagById(customerTag.id!)
      }
    });
  }

  deleteCustomerTagById(id: string) {
    this.customerTagService.safeDelete(id)
      .pipe(
        tap(_ => {
          this.snackBarService.success('Tag deletada com sucesso');
          this.searchText$.next('');
        }),
        catchError(() => of(this.snackBarService.error('Falha ao deletar tag')))
      )
      .subscribe();
  }

  filterData(filters: DataTableFilter) {
    this.searchText$.next(filters);
  }
}
