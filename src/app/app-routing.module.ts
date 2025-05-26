import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CustomerCreateComponent } from "./routes/customers/customer-create/customer-create.component";
import { OrderCreateComponent } from "./routes/order/order-create/order-create.component";
import { ProductsComponent } from "./routes/products/products.component";
import { CustomersPageComponent } from "./routes/customers/customers-page/customers-page.component";
import { OrdersPageComponent } from "./routes/order/orders-page/orders-page.component";
import { OrderStatusPageComponent } from "./routes/order-status/order-status-page/order-status-page.component";

const routes: Routes = [
  { path: '', redirectTo: '/orders', pathMatch: 'full' },
  { path: 'orders', component: OrdersPageComponent },
  { path: 'orders/create', component: OrderCreateComponent },
  { path: 'order/:id', component: OrderCreateComponent },
  { path: 'customers', component: CustomersPageComponent },
  { path: 'customers/create', component: CustomerCreateComponent },
  { path: 'customer/:id', component: CustomerCreateComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'order-status', component: OrderStatusPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }