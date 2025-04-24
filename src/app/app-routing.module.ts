import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersComponent } from './components/customers/customers.component';

import { OrderComponent } from './components/order/order.component';
import { ProductsComponent } from './components/products/products.component';
import { OrderCreateComponent } from './components/order-create/order-create.component';
import { CustomerCreateComponent } from './components/customer-create/customer-create.component';

const routes: Routes = [
  { path: '', redirectTo: '/orders', pathMatch: 'full' },
  { path: 'orders', component: OrderComponent },
  { path: 'orders/create', component: OrderCreateComponent },
  { path: 'order/:id', component: OrderCreateComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'customers/create', component: CustomerCreateComponent },
  { path: 'customer/:id', component: CustomerCreateComponent },
  { path: 'products', component: ProductsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }