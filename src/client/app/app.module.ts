import {NgModule} from "@angular/core";
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {TransferHttpModule} from "@nglibs/universal-transfer-state";

import {AppComponent} from "./app.component";
import {AppState} from "./app.service";

@NgModule({
    imports: [
        HttpModule,
        FormsModule,
        BrowserModule,
        TransferHttpModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        AppState
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
