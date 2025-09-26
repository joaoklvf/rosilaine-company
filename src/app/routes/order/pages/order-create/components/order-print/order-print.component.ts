import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas-pro';
import { Order } from 'src/app/models/order/order';
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
    private readonly snackBarService: SnackBarService
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

  captureScreenshot() {
    html2canvas(this.captureElement.nativeElement!).then(canvas => {
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            const item = new ClipboardItem({ 'image/png': blob });
            await navigator.clipboard.write([item]);
            this.snackBarService.success('Imagem copiada para o clipboard!');
          } catch (err) {
            this.snackBarService.error('Erro ao copiar imagem:');
            console.log(err);
          }
        }
      });
    });
  }

  pdfPrint() {
    document.title = `${this.order!.customer.name} - ${getBrDateStr(this.order?.orderDate!)}`;
    window.print();
    document.title = "Rosilaine cosméticos";
  }
}
