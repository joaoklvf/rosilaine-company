import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoaderComponent } from "./components/loader/loader.component";
import { LoaderInterceptor } from './services/interceptors/loader-interceptor.interceptor';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

@NgModule({
    declarations: [
        AppComponent,
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
        provideHttpClient(withInterceptorsFromDi()),
        { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 3000 } },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoaderInterceptor,
            multi: true
        },
        provideCharts(withDefaultRegisterables())
    ]
})

export class AppModule { }