import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { startWith, debounceTime, distinctUntilChanged, switchMap, Subject } from 'rxjs';
import { CustomDialogComponent } from 'src/app/components/custom-dialog/custom-dialog.component';
import { DataTableComponent } from 'src/app/components/data-table/data-table.component';
import { DataTableColumnProp } from 'src/app/interfaces/data-table';
import { CustomerTag } from 'src/app/models/customer/customer-tag';
import { CustomerTagService } from 'src/app/services/customer/customer-tag/customer-tag.service';

@Component({
  selector: 'app-customer-tags',
  imports: [DataTableComponent, FormsModule],
  templateUrl: './customer-tags.component.html',
  styleUrl: './customer-tags.component.scss'
})
export class CustomerTagsComponent {
  readonly columns: DataTableColumnProp<CustomerTag>[] = [
    { description: "Tag", fieldName: "description", width: '85%' },
  ]
  readonly dialog = inject(MatDialog);
  customerTag: CustomerTag = new CustomerTag();
  customerTags: CustomerTag[] = [];
  private searchText$ = new Subject<string>();

  @ViewChild("customerTagDescription") customerTagDescriptionField: ElementRef = new ElementRef(null);

  constructor(private customerTagService: CustomerTagService) { }
  ngOnInit(): void {
    this.searchText$.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((tagName) => {
        return this.customerTagService.get({ description: tagName }, /* this.withRefresh */)
      }),
    ).subscribe(customerTags => this.customerTags = customerTags);
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

  deleteCustomerTag(customerTag: CustomerTag) {
    this.customerTagService.update({ ...customerTag, isDeleted: true })
      .subscribe(customerTagUpdated => {
        if (!customerTagUpdated)
          return;

        const customerTags = this.customerTags.filter(x => x.id !== customerTag.id);
        this.customerTags = [...customerTags];
      });
  }

  openDialog(customerTag: CustomerTag): void {
    this.dialog.open(CustomDialogComponent, {
      width: '500px',
      data: {
        title: "Deletar tag",
        content: `Deseja deletar a tag ${customerTag.description}?`,
        onConfirmAction: () => this.deleteCustomerTag(customerTag)
      }
    });
  }

  filterData(customerName: string) {
    this.searchText$.next(customerName);
  }
}
