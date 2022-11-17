import express from 'express';
import expressWs from 'express-ws';

import { LogEntry } from '@/models/log';
import * as ndjson from '@helpers/ndjson';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import debug from 'debug';
import fs from 'fs';
import createError from 'http-errors';

const LOG_FILE_PATH = '/var/log/www/banking-nudges/log.ndjson'
var dlog = debug.debug('banking:logging');

function loggingRoute(): expressWs.Router {
    const router = express.Router() as expressWs.Router;


    router.get('/logging', (req, res, next) => {
        dlog('Fetching logs.');
        if (fs.existsSync(LOG_FILE_PATH)) {
            const contents = fs.readFileSync(LOG_FILE_PATH, 'utf-8');
            try {
                res.status(200).json(ndjson.parseToInstance(LogEntry, contents));
            } catch (e) {
                next(createError(500, `Parsing error: ${e}`));
            }
        } else {
            console.log('Log file missing!');
            next(createError(404, 'Log file is missing!'));
        }
    })

    router.post('/logging', (req, res, next) => {
        if (typeof req.body == 'object') {
            dlog(`Log Posted: ${JSON.stringify(req.body)}`);
            let entry = plainToInstance(LogEntry, req.body);
            fs.appendFileSync(LOG_FILE_PATH, `${JSON.stringify(instanceToPlain(entry))}\n`, 'utf-8');
            res.status(200).send();
        } else {
            next(createError(500, `Invalid log type.`));
        }
    });

    router.ws('/logging', (ws, req) => {
        ws.on('message', (msg) => {
            if (typeof req.body == 'object') {
                dlog(`Log Posted: ${JSON.stringify(msg)}`);
                let entry = plainToInstance(LogEntry, msg);
                fs.appendFileSync(LOG_FILE_PATH, `${JSON.stringify(instanceToPlain(entry))}\n`, 'utf-8');
            } else {
                ws.send(createError(500, `Invalid log type.`));
            }
        });
    });

    return router;
}


export default loggingRoute;