import { LogEntry } from '@/models/log';
import * as ndjson from '@helpers/ndjson';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import debug from 'debug';
import { Router } from 'express';
import fs from 'fs';
import createError from 'http-errors';

const LOG_FILE_PATH = '/var/log/www/banking-nudges/log.ndjson'

const loggingRoute = Router();

var dlog = debug.debug('banking:logging');

loggingRoute.get('/logging', (req, res, next) => {
    dlog('Fetching logs.');
    if (fs.existsSync(LOG_FILE_PATH)) {
        const contents = fs.readFileSync(LOG_FILE_PATH, 'utf-8');
        try {
            res.status(200).json(ndjson.parseToInstance(LogEntry, contents));
        } catch (e) {
            next(createError(500, `Parsing error: ${e}`))
        }
    } else {
        console.log('Log file missing!');
        next(createError(404, 'Log file is missing!'));
    }
})

loggingRoute.post('/logging', (req, res, next) => {
    if (typeof req.body == 'object') {
        dlog(`Log Posted: ${JSON.stringify(req.body)}`)
        let entry = plainToInstance(LogEntry, req.body);
        fs.appendFileSync(LOG_FILE_PATH, `${JSON.stringify(instanceToPlain(entry))}\n`, 'utf-8');
        res.status(200);
    } else {
        next(createError(500, `Invalid log type.`));
    }
});

export default loggingRoute;