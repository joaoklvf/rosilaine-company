import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersComponent } from './routes/customers/customers.component';

import { OrderComponent } from './routes/order/order.component';
import { ProductsComponent } from './routes/products/products.component';
import { OrderCreateComponent } from './routes/order-create/order-create.component';
import { CustomerCreateComponent } from './routes/customer-create/customer-create.component';

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