import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  { path: '', loadComponent: () => import('./routes/home/home.component').then(x => x.HomeComponent) },
  { path: 'orders', loadComponent: () => import('./routes/order/pages/orders-page/orders-page.component').then(x => x.OrdersPageComponent) },
  { path: 'orders/create', loadComponent: () => import('./routes/order/pages/order-create/order-create.component').then(x => x.OrderCreateComponent) },
  { path: 'order/:id', loadComponent: () => import('./routes/order/pages/order-create/order-create.component').then(x => x.OrderCreateComponent) },
  { path: 'customers', loadComponent: () => import('./routes/customers/pages/customers-page/customers-page.component').then(x => x.CustomersPageComponent) },
  { path: 'customers/create', loadComponent: () => import('./routes/customers/pages/customer-create/customer-create.component').then(x => x.CustomerCreateComponent) },
  { path: 'customer/:id', loadComponent: () => import('./routes/customers/pages/customer-create/customer-create.component').then(x => x.CustomerCreateComponent) },
  { path: 'products', loadComponent: () => import('./routes/products/pages/products-page/products-page.component').then(x => x.ProductsPageComponent) },
  { path: 'products/create', loadComponent: () => import('./routes/products/pages/product-create/product-create.component').then(x => x.ProductCreateComponent) },
  { path: 'product/:id', loadComponent: () => import('./routes/products/pages/product-create/product-create.component').then(x => x.ProductCreateComponent) },
  { path: 'order-status', loadComponent: () => import('./routes/order-status/order-status.component').then(x => x.OrderStatusComponent) },
  { path: 'order-item-status', loadComponent: () => import('./routes/order-item-status/order-item-status.component').then(x => x.OrderItemStatusComponent) },
  { path: 'customer-tags', loadComponent: () => import('./routes/customer-tags/customer-tags.component').then(x => x.CustomerTagsComponent) },
  { path: 'product-category', loadComponent: () => import('./routes/product-category/product-category.component').then(x => x.ProductCategoryComponent) },
  { path: 'order-item-by-status', loadComponent: () => import('./routes/order-item-by-status/order-item-by-status.component').then(x => x.OrderItemByStatusComponent) },
  { path: 'order-print', loadComponent: () => import('./routes/order/pages/order-create/components/order-print/order-print.component').then(x => x.OrderPrintComponent) },
  { path: 'stock', loadComponent: () => import('./routes/stocks-page/stocks-page.component').then(x => x.StocksPageComponent) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule { }