import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeroDetailComponent } from './components/hero-detail/hero-detail.component';
import { HeroesComponent } from './components/heroes/heroes.component';
import { MessagesComponent } from './messages/messages.component';

import { AppRoutingModule } from './app-routing.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { HeroSearchComponent } from './components/hero-search/hero-search.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NavbarComponent } from './components/navbar/navbar.component';
import { OrderComponent } from './components/order/order.component';
import { InputMaskComponent } from './components/input-mask/input-mask.component';
import { MatIconModule } from '@angular/material/icon';
import { CustomersComponent } from './components/customers/customers.component';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrDatePickerComponent } from './components/br-date-picker/br-date-picker.component';
import { NgxMaskDirective, NgxMaskPipe, provideEnvironmentNgxMask } from 'ngx-mask';
import { CustomAutocompleteComponent } from './components/custom-autocomplete/custom-autocomplete.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductsComponent } from './components/products/products.component';

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        HeroesComponent,
        HeroDetailComponent,
        MessagesComponent,
        HeroSearchComponent,
        NavbarComponent,
        OrderComponent,
        InputMaskComponent,
        CustomersComponent,
        BrDatePickerComponent,
        CustomAutocompleteComponent,
        ProductsComponent
    ],
    bootstrap: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        MatSlideToggleModule,
        MatIconModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatNativeDateModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        NgxMaskDirective,
        NgxMaskPipe,
        MatSelectModule
    ],
    providers: [
        provideEnvironmentNgxMask(),
        provideHttpClient(withInterceptorsFromDi())
    ]
})

export class AppModule { }