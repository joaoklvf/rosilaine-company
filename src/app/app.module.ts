import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { LoaderComponent } from "./components/loader/loader.component";
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoaderInterceptor } from './services/interceptors/loader-interceptor.interceptor';

@NgModule({
    declarations: [
    ],
    bootstrap: [
    ],
    imports: [
        AppComponent,
        BrowserModule,
        NavbarComponent,
        LoaderComponent,
    ],
    providers: [
        provideHttpClient(withInterceptorsFromDi()),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoaderInterceptor,
            multi: true
        },
    ]
})

export class AppModule { }