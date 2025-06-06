import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./routes/home/home.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'orders', loadChildren: () => import('./routes/order/orders-page/orders-page.component').then(x => x.OrdersPageComponent) },
  { path: 'orders/create', loadChildren: () => import('./routes/order/order-create/order-create.component').then(x => x.OrderCreateComponent) },
  { path: 'order/:id', loadChildren: () => import('./routes/order/order-create/order-create.component').then(x => x.OrderCreateComponent) },
  { path: 'customers', loadChildren: () => import('./routes/customers/customers-page/customers-page.component').then(x => x.CustomersPageComponent) },
  { path: 'customers/create', loadChildren: () => import('./routes/customers/customer-create/customer-create.component').then(x => x.CustomerCreateComponent) },
  { path: 'customer/:id', loadChildren: () => import('./routes/customers/customer-create/customer-create.component').then(x => x.CustomerCreateComponent) },
  { path: 'products', loadChildren: () => import('./routes/products/products.component').then(x => x.ProductsComponent) },
  { path: 'order-status', loadChildren: () => import('./routes/order-status/order-status.component').then(x => x.OrderStatusComponent) },
  { path: 'order-item-status', loadChildren: () => import('./routes/order-item-status/order-item-status.component').then(x => x.OrderItemStatusComponent) },
  { path: 'customer-tags', loadChildren: () => import('./routes/customer-tags/customer-tags.component').then(x => x.CustomerTagsComponent) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule { }