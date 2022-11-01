// import debug from 'debug';
import bodyParser from 'body-parser';
import express, { Express } from 'express';
import expressWs from 'express-ws';
import createError from 'http-errors';

// var debug = require('debug')('src:server');
import routes from '@backend/routes';
import http from 'http';
// var path = require('path');

export default class BackendApp {
    app: Express;
    server: http.Server;
    wss: expressWs.Instance;
    heartbeat?: NodeJS.Timer;

    routesInitialized = false;

    constructor(private port: number) {
        this.app = express();
        this.server = http.createServer(this.app);
        this.wss = expressWs(this.app, this.server);

        this.app.set('port', this.port);

        // Define the JSON parser as a default way 
        // to consume and produce data through the 
        // exposed APIs.
        this.app.use(bodyParser.json());

        // Can create link to Angular build directory
        // The `ng build` command will save the result
        // under the `dist` folder.
        // const distDir = __dirname + "/dist/";
        const assetsDir = __dirname + "/assets/";
        this.app.use(express.static(assetsDir));
    }

    startServer() {
        if (!this.routesInitialized) {
            this.initializeRoutes();
        }

        this.server.on('error', this.onError);
        this.server.on('listening', this.onListening);

        // Setup heartbeating for WebSocket connections.
        this.heartbeat = setInterval(() => {
            // console.log("Sending pings.")
            this.wss.getWss().clients.forEach(function each(ws: any) {
                // console.log(" - Pinging socket.",)
                ws.send(JSON.stringify({ type: "heartbeat" }));
            });
        }, 30000);

        this.wss.getWss().on('close', () => {
            clearInterval(this.heartbeat);
        });
    }

    listen() {
        this.server.listen(this.port);
    }

    private initializeRoutes() {

        this.app.use('/api', routes);

        /*  "/api/status"
        *   GET: Get server status
        *   PS: it's just an example, not mandatory
        */
        this.app.get("/api/status", function (req: any, res: any) {
            res.status(200).json({ status: "UP" });
        });

        // catch 404 and forward to error handler
        this.app.use(function (req: any, res: any, next: any) {
            next(createError(404));
        });

        // error handler
        this.app.use(function (err: any, req: any, res: any, next: any) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            // render the error page
            res.status(err.status || 500);
            res.json({ status: err.status || 500, msg: err.message })
        });

        this.routesInitialized = true;
    }

    private onError(error: any) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        var bind = 'Port ' + this.port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
            default:
                throw error;
        }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */
    private onListening() {
        var addr = this.server?.address();
        if (addr instanceof Object) {
            var bind = typeof addr === 'string'
                ? 'pipe ' + addr
                : 'port ' + addr.port;
            console.log('Listening on ' + bind);
        }
    }
}