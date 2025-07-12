import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(private router: Router, private snackBarService: SnackBarService) { }
  order?: Order;

  ngOnInit(): void {
    const orderStr = sessionStorage.getItem('order');
    if (!orderStr) {
      this.snackBarService.error('Falha ao carregar pedido');
      this.router.navigate(['..']);
      return;
    }

    this.order = JSON.parse(orderStr);

    setTimeout(() => {
      window.print()
    }, 500)
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
}
