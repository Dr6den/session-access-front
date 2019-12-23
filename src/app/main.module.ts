import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ModelModule } from "./model/model.module";
import { CoreModule } from "./core/core.module";
import { InsertionRolesComponent } from './insertion.roles.component';
import { routing } from "./application.routing";

import { ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { JwtInterceptor, ErrorInterceptor, fakeBackendProvider } from './auth/interceptors';
import { GlobalService } from './global.service';

@NgModule({
    imports: [BrowserModule, ModelModule, CoreModule, routing, ReactiveFormsModule, HttpClientModule],
    declarations: [InsertionRolesComponent],
    providers: [
        GlobalService,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    ],
    bootstrap: [InsertionRolesComponent]
})
export class MainModule { }
