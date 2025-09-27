import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from 'src/app/models/order/order';
import { PrintService } from 'src/app/services/print/print.service';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';
import { getAmountStr, getBrCurrencyStr, getBrDateStr } from 'src/app/utils/text-format';

@Component({
  selector: 'app-order-print',
  imports: [],
  templateUrl: './order-print.component.html',
  styleUrl: './order-print.component.scss'
})
export class OrderPrintComponent implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly snackBarService: SnackBarService,
    private readonly printService: PrintService,
  ) { }
  @ViewChild('orderPrint') captureElement = new ElementRef(null);

  order?: Order;

  ngOnInit(): void {
    const orderStr = sessionStorage.getItem('order');
    if (!orderStr) {
      this.snackBarService.error('Falha ao carregar pedido');
      this.router.navigate(['..']);
      return;
    }

    this.order = JSON.parse(orderStr);
  }

  getCurrency(value?: number) {
    return getBrCurrencyStr(value ?? 0);
  }

  getAmount(value?: number) {
    return getAmountStr(value ?? 0);
  }

  getDate(value?: Date) {
    return getBrDateStr(value ?? '');
  }

  pdfPrint() {
    this.printService.printDocument(`${this.order!.customer.name} - ${getBrDateStr(this.order?.orderDate!)}`)
  }

  captureScreenshot() {
    this.printService.captureDocumentScreenshot(this.captureElement.nativeElement!)
  }
}
