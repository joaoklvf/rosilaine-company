import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MessagesComponent } from './messages/messages.component';

import { AppRoutingModule } from './app-routing.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NavbarComponent } from './components/navbar/navbar.component';
import { OrderComponent } from './components/order/order.component';
import { InputMaskComponent } from './components/input-mask/input-mask.component';
import { MatIconModule } from '@angular/material/icon';
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
import { OrderCreateComponent } from './components/order-create/order-create.component';
import { CustomerCreateComponent } from './components/customer-create/customer-create.component';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { CustomChipsAutocompleteComponent } from "./components/custom-chips-autocomplete/custom-chips-autocomplete.component";
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
    declarations: [
        AppComponent,
        MessagesComponent,
        NavbarComponent,
        OrderComponent,
        InputMaskComponent,
        CustomerCreateComponent,
        BrDatePickerComponent,
        CustomAutocompleteComponent,
        ProductsComponent,
        OrderCreateComponent,
        CustomChipsAutocompleteComponent
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
        MatSelectModule,
        MatChipsModule
    ],
    providers: [
        provideEnvironmentNgxMask(),
        provideHttpClient(withInterceptorsFromDi()),
        { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 3000 } }
    ]
})

export class AppModule { }