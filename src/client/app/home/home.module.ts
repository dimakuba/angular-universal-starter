import {NgModule} from '@angular/core';
import {RouterModule} from "@angular/router";

import {HomeComponent} from "./home.component";
import {routes} from "./home-routing.module";

@NgModule({
    imports: [RouterModule.forChild(routes)],
    declarations: [HomeComponent],
})
export class HomeModule {
}
