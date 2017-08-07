// polyfills
import "zone.js/dist/zone-node";
import "reflect-metadata";
import "rxjs/Rx";
// angular
import {enableProdMode} from "@angular/core";
// libs
import * as express from "express";
import * as compression from "compression";
import {ngExpressEngine} from "@ngx-universal/express-engine";
import * as path from "path";
// module
import {AppServerModule} from "./app/app.server.module";

enableProdMode();
const server = express();
server.use(compression());

const CLIENT_DIR = path.join(path.resolve(__dirname, '../client'));

/**
 * Set view engine
 */
server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule
}));

server.set('view engine', 'html');
server.set('views', CLIENT_DIR);

/**
 * Point static path to `public`
 */
server.use('/', express.static(CLIENT_DIR, {index: false}));

/**
 * Catch all routes and return the `index.html`
 */
server.get('*', (req, res) => {
    res.render('index', {
        req: req,
        res: res
    });
});

/**
 * Port & host settings
 */
const PORT = process.env.PORT || 8000;
const HOST = process.env.BASE_URL || 'localhost';
const baseUrl = `http://${HOST}:${PORT}`;

server.set('port', PORT);

/**
 * Begin listening
 */
server.listen(server.get('port'), () => {
    console.log(`Express server listening on ${baseUrl}`);
});
