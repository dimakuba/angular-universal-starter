import {NgModule} from "@angular/core";
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {HttpTransferModule} from "@ngx-universal/state-transfer";
import {CacheModule} from "@ngx-cache/core";

import {AppComponent} from "./app.component";
import {AppState} from "./app.service";

@NgModule({
    imports: [
        HttpModule,
        FormsModule,
        BrowserModule,
        HttpTransferModule,
        CacheModule.forRoot()
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
