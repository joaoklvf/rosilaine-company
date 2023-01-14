import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { CustomersComponent } from './components/customers/customers.component';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeroDetailComponent } from './components/hero-detail/hero-detail.component';
import { HeroesComponent } from './components/heroes/heroes.component';
import { OrderComponent } from './components/order/order.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'orders', component: OrderComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'detail/:id', component: HeroDetailComponent },
  { path: 'heroes', component: HeroesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    NgxMaskDirective, NgxMaskPipe
  ],
  exports: [RouterModule],
  providers: [provideNgxMask()]
})
export class AppRoutingModule { }