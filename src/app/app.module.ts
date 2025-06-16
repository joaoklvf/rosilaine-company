import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MessagesComponent } from './messages/messages.component';

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BaseApiInterceptor } from './services/base/interceptors/base-api.interceptor';
import { LoaderComponent } from "./components/loader/loader.component";

@NgModule({
    declarations: [
        AppComponent,
        MessagesComponent
    ],
    bootstrap: [
        AppComponent
    ],
    imports: [
    BrowserModule,
    AppRoutingModule,
    NavbarComponent,
    LoaderComponent
],
    providers: [
        provideEnvironmentNgxMask(),
        provideHttpClient(withInterceptorsFromDi()),
        { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 3000 } },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: BaseApiInterceptor,
            multi: true
        }
    ]
})

export class AppModule { }