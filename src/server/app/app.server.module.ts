// angular
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {ServerModule} from "@angular/platform-server";
// libs
import {ServerStateTransferModule, StateTransferService} from "@ngx-universal/state-transfer";
// modules & components
import {AppModule} from "../../client/app/app.module";
import {AppComponent} from "../../client/app/app.component";

@NgModule({
    bootstrap: [AppComponent],
    imports: [
        BrowserModule.withServerTransition({
            appId: 'vakon-salon-id'
        }),
        ServerModule,
        ServerStateTransferModule.forRoot(),
        AppModule
    ]
})
export class AppServerModule {
    constructor(private readonly transferState: StateTransferService) {
    }

    ngOnBootstrap = () => {
        this.transferState.inject();
    }
}
