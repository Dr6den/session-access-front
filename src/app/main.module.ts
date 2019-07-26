import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ModelModule } from "./model/model.module";
import { CoreModule } from "./core/core.module";
import { InsertionRolesComponent } from './insertion.roles.component';
import { routing } from "./insertion.roles.routing";

import { ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { JwtInterceptor, ErrorInterceptor, fakeBackendProvider } from './auth/interceptors';

@NgModule({
    imports: [BrowserModule, ModelModule, CoreModule, routing, ReactiveFormsModule, HttpClientModule],
    declarations: [InsertionRolesComponent],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
        fakeBackendProvider
    ],
    bootstrap: [InsertionRolesComponent]
})
export class MainModule { }
