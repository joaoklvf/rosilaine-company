import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemStatusTable } from './item-customer-table';

describe('ItemStatusTable', () => {
  let component: ItemStatusTable;
  let fixture: ComponentFixture<ItemStatusTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemStatusTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemStatusTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
