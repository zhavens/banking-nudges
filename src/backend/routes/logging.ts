import { LogEntry } from '@/models/log';
import * as ndjson from '@helpers/ndjson';
import { instanceToPlain } from 'class-transformer';
import { Router } from 'express';
import fs from 'fs';
import createError from 'http-errors';

const LOG_FILE_PATH = "/var/log/www/banking-nudges/log.ndjson"

const loggingRoute = Router();


loggingRoute.get('/logging', (req, res, next) => {
    console.log('Fetching logs.');
    if (fs.existsSync(LOG_FILE_PATH)) {
        const contents = fs.readFileSync(LOG_FILE_PATH, 'utf-8');
        try {
            res.status(200).json(ndjson.parseToInstance(LogEntry, contents));
        } catch (e) {
            next(createError(500, `Parsing error: ${e}`))
        }
    } else {
        console.log('Log file missing!');
        next(createError(404, "Log file is missing!"));
    }
})

loggingRoute.post('/logging', (req, res, next) => {
    let entry: LogEntry = LogEntry.info('test', [{ val: 1 }])
    fs.appendFileSync(LOG_FILE_PATH, `${JSON.stringify(instanceToPlain(entry))}\n`, 'utf-8');
});

export default loggingRoute;