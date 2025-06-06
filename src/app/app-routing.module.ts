import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CustomerCreateComponent } from "./routes/customers/customer-create/customer-create.component";
import { OrderCreateComponent } from "./routes/order/order-create/order-create.component";
import { ProductsComponent } from "./routes/products/products.component";
import { CustomersPageComponent } from "./routes/customers/customers-page/customers-page.component";
import { OrdersPageComponent } from "./routes/order/orders-page/orders-page.component";
import { OrderStatusComponent } from "./routes/order-status/order-status.component";
import { OrderItemStatusComponent } from "./routes/order-item-status/order-item-status.component";
import { CustomerTagsComponent } from "./routes/customer-tags/customer-tags.component";

const routes: Routes = [
  { path: '', redirectTo: '/customer-tags', pathMatch: 'full' },
  { path: 'orders', component: OrdersPageComponent },
  { path: 'orders/create', component: OrderCreateComponent },
  { path: 'order/:id', component: OrderCreateComponent },
  { path: 'customers', component: CustomersPageComponent },
  { path: 'customers/create', component: CustomerCreateComponent },
  { path: 'customer/:id', component: CustomerCreateComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'order-status', component: OrderStatusComponent },
  { path: 'order-item-status', component: OrderItemStatusComponent },
  { path: 'customer-tags', component: CustomerTagsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }