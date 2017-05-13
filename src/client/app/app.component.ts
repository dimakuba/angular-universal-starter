import {Component, OnInit} from "@angular/core";
// external styles
import "../assets/sass/layout.scss";

@Component({
    selector: 'main',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    title: string = 'angular-universal-starter';

    constructor() {
    }

    ngOnInit() {
    }
}
