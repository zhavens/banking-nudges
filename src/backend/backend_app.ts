import bodyParser from 'body-parser';
import debug from 'debug';
import express, { Express } from 'express';
import expressWs from 'express-ws';
import http from 'http';
import createError, { HttpError } from 'http-errors';

import routes from '@backend/routes';

export default class BackendApp {
    app: Express;
    server: http.Server;
    wss: expressWs.Instance;
    heartbeat?: NodeJS.Timer;
    dlog: debug.Debugger;

    routesInitialized = false;

    constructor(private port: number) {
        this.app = express();
        this.server = http.createServer(this.app);
        this.wss = expressWs(this.app, this.server);
        this.dlog = debug.debug('backend:app');

        this.app.set('port', this.port);

        // Define the JSON parser as a default way 
        // to consume and produce data through the 
        // exposed APIs.
        this.app.use(bodyParser.json());

        const assetsDir = __dirname + '/assets/';
        this.app.use(express.static(assetsDir));
    }

    startServer() {
        if (!this.routesInitialized) {
            this.initializeRoutes();
        }

        this.server.on('error', this.onError);
        this.server.on('listening', this.onListening);

        // Setup heartbeating for WebSocket connections.
        this.dlog('Starting WebSocket heartbeats.');
        this.heartbeat = setInterval(() => {
            this.wss.getWss().clients.forEach(function each(ws: any) {
                ws.send(JSON.stringify({ type: 'heartbeat' }));
            });
        }, 30000);

        this.wss.getWss().on('close', () => {
            this.dlog('Shutting down WebSocket heartbeats.');
            clearInterval(this.heartbeat);
        });
    }

    listen() {
        this.dlog('Listening...');
        this.server.listen(this.port);
    }

    private initializeRoutes() {
        this.dlog(`Initializing routes.`);

        // all app routes defined within
        this.app.use('/api', routes);

        // expose server running status
        this.app.get('/api/status', function (req: any, res: any) {
            res.status(200).json({ status: 'UP' });
        });

        // catch 404 and forward to error handler
        this.app.use(function (req: any, res: any, next: any) {
            next(createError(404));
        });

        // error handler
        this.app.use(function (err: HttpError, req: any, res: any, next: any) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            // set internal error message as json response for debugging
            if (req.app.get('env') === 'development') {
                res.json({ status: err.status || 500, msg: err.message })
            }
            // set appropriate response. 
            res.status(err.status || 500);
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
     * Event listener for HTTP server 'listening' event.
     */
    private onListening() {
        var addr = this.server?.address();
        if (addr instanceof Object) {
            var bind = typeof addr === 'string'
                ? 'pipe ' + addr
                : 'port ' + addr.port;
            this.dlog('Listening on ' + bind);
        }
    }
}