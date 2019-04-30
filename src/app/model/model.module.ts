import { NgModule } from "@angular/core";
import { Model } from "./repository.model";
import { HttpClientModule, HttpClientJsonpModule } from "@angular/common/http";
import { RestDataSource, REST_URL } from "./rest.datasource";

@NgModule({
    imports: [HttpClientModule, HttpClientJsonpModule],
    providers: [Model, RestDataSource,
        { provide: REST_URL, useValue: `http://localhost:8080/testangular` }]
})
export class ModelModule { }
