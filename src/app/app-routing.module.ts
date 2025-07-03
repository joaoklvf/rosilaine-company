import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./routes/home/home.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'orders', loadComponent: () => import('./routes/order/pages/orders-page/orders-page.component').then(x => x.OrdersPageComponent) },
  { path: 'orders/create', loadComponent: () => import('./routes/order/pages/order-create/order-create.component').then(x => x.OrderCreateComponent) },
  { path: 'order/:id', loadComponent: () => import('./routes/order/pages/order-create/order-create.component').then(x => x.OrderCreateComponent) },
  { path: 'customers', loadComponent: () => import('./routes/customers/pages/customers-page/customers-page.component').then(x => x.CustomersPageComponent) },
  { path: 'customers/create', loadComponent: () => import('./routes/customers/pages/customer-create/customer-create.component').then(x => x.CustomerCreateComponent) },
  { path: 'customer/:id', loadComponent: () => import('./routes/customers/pages/customer-create/customer-create.component').then(x => x.CustomerCreateComponent) },
  { path: 'products', loadComponent: () => import('./routes/products/products.component').then(x => x.ProductsComponent) },
  { path: 'order-status', loadComponent: () => import('./routes/order-status/order-status.component').then(x => x.OrderStatusComponent) },
  { path: 'order-item-status', loadComponent: () => import('./routes/order-item-status/order-item-status.component').then(x => x.OrderItemStatusComponent) },
  { path: 'customer-tags', loadComponent: () => import('./routes/customer-tags/customer-tags.component').then(x => x.CustomerTagsComponent) },
  { path: 'product-category', loadComponent: () => import('./routes/product-category/product-category.component').then(x => x.ProductCategoryComponent) },
  { path: 'order-item-by-status', loadComponent: () => import('./routes/order-item-by-status/order-item-by-status.component').then(x => x.OrderItemByStatusComponent) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule { }