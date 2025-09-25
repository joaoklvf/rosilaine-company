import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { OrderItem } from 'src/app/models/order/order-item/order-item';
import { getBrCurrencyStr } from 'src/app/utils/text-format';
import { BrDatePickerComponent } from "src/app/components/br-date-picker/br-date-picker.component";
import { MatInputModule } from "@angular/material/input";
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { OrderItemStatus } from 'src/app/models/order/order-item/order-item-status';

@Component({
  selector: 'app-order-items-table',
  imports: [MatIconModule, BrDatePickerComponent, MatInputModule, MatSelectModule],
  templateUrl: './order-items-table.html',
  styleUrl: './order-items-table.scss'
})
export class OrderItemsTable {
  readonly removeAction = output<OrderItem>();
  readonly editAction = output<OrderItem>();
  readonly orderItems = input<OrderItem[]>([]);
  readonly statuses = input<OrderItemStatus[]>([]);
  readonly updateItemAction = output<OrderItem>();

  getCurrencyValue = (value: number) =>
    getBrCurrencyStr(value);

  edit(orderItem: OrderItem) {
    this.editAction.emit(orderItem);
  }

  remove(orderItem: OrderItem) {
    this.removeAction.emit(orderItem);
  }

  changeStatus(selectEvent: MatSelectChange<string>, orderItemSelected: OrderItem) {
    const optionSelected = this.statuses().find(x => x.id === selectEvent.value);
    if (!optionSelected)
      return;

    this.updateItemAction.emit({ ...orderItemSelected, itemStatus: optionSelected });
  }

  setDeliveryDate(value: Date, item: OrderItem) {
    this.updateItemAction.emit({ ...item, deliveryDate: value ?? null });
  }

  setDeliveryToday(item: OrderItem) {
    this.updateItemAction.emit({ ...item, deliveryDate: new Date() });
  }
}
