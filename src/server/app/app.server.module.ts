// angular
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {ServerModule} from "@angular/platform-server";
import {Http} from "@angular/http";
// libs
import {ServerStateTransferModule, StateTransferService} from "@ngx-universal/state-transfer";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
// modules & components
import {AppModule} from "../../client/app/app.module";
import {AppComponent} from "../../client/app/app.component";

export function HttpLoaderFactory(http: Http) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    bootstrap: [AppComponent],
    imports: [
        BrowserModule.withServerTransition({
            appId: 'vakon-salon-id'
        }),
        ServerModule,
        ServerStateTransferModule.forRoot(),
        AppModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [Http]
            }
        })
    ]
})
export class AppServerModule {
    constructor(private readonly transferState: StateTransferService) {
    }

    ngOnBootstrap = () => {
        this.transferState.inject();
    }
}
