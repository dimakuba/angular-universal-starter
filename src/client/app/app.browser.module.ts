// angular
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
// libs
import {BrowserTransferStateModule} from "@nglibs/universal-transfer-state";
// modules & components
import {AppModule} from "./app.module";
import {AppComponent} from "./app.component";

@NgModule({
    bootstrap: [AppComponent],
    imports: [
        BrowserModule.withServerTransition({
            appId: 'angular-universal-starter'
        }),
        BrowserTransferStateModule,
        AppModule
    ],
})
export class AppBrowserModule {
}
