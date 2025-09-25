import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./routes/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'orders',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./routes/order/pages/orders-page/orders-page.component').then(
            m => m.OrdersPageComponent
          ),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./routes/order/pages/order-create/order-create.component').then(
            m => m.OrderCreateComponent
          ),
      },
      {
        path: 'print',
        loadComponent: () =>
          import(
            './routes/order/pages/order-create/components/order-print/order-print.component'
          ).then(m => m.OrderPrintComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./routes/order/pages/order-create/order-create.component').then(
            m => m.OrderCreateComponent
          ),
      },
    ],
  },
  {
    path: 'customers',
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './routes/customers/pages/customers-page/customers-page.component'
          ).then(m => m.CustomersPageComponent),
      },
      {
        path: 'create',
        loadComponent: () =>
          import(
            './routes/customers/pages/customer-create/customer-create.component'
          ).then(m => m.CustomerCreateComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import(
            './routes/customers/pages/customer-create/customer-create.component'
          ).then(m => m.CustomerCreateComponent),
      },
    ],
  },
  {
    path: 'products',
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './routes/products/pages/products-page/products-page.component'
          ).then(m => m.ProductsPageComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import(
            './routes/products/pages/product-create/product-create.component'
          ).then(m => m.ProductCreateComponent),
      },
    ],
  },
  {
    path: 'order-status',
    loadComponent: () =>
      import('./routes/order-status/order-status.component').then(
        m => m.OrderStatusComponent
      ),
  },
  {
    path: 'order-item-status',
    loadComponent: () =>
      import('./routes/order-item-status/order-item-status.component').then(
        m => m.OrderItemStatusComponent
      ),
  },
  {
    path: 'customer-tags',
    loadComponent: () =>
      import('./routes/customer-tags/customer-tags.component').then(
        m => m.CustomerTagsComponent
      ),
  },
  {
    path: 'product-category',
    loadComponent: () =>
      import('./routes/product-category/product-category.component').then(
        m => m.ProductCategoryComponent
      ),
  },
  {
    path: 'order-item-by-status',
    loadComponent: () =>
      import(
        './routes/order-item-by-status/order-item-by-status.component'
      ).then(m => m.OrderItemByStatusComponent),
  },
  {
    path: 'stock',
    loadComponent: () =>
      import('./routes/stocks-page/stocks-page.component').then(
        m => m.StocksPageComponent
      ),
  },
  // rota curinga
  { path: '**', redirectTo: '' },
];
