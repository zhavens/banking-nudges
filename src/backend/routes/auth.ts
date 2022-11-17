import { instanceToPlain, plainToInstance } from 'class-transformer';
import debug from 'debug';
import { Router } from 'express';
import fs from 'fs';
import path from 'path';

import { User } from '@models/user';

const USER_DIRECTORY = '/var/log/www/banking-nudges/users'
var dlog = debug.debug('banking:users');

function authRoute(): Router {
    const router = Router();

    router.post('/auth', (req, res, next) => {
        dlog(`Auth request: ${typeof req.body}:${JSON.stringify(req.body)}`)

        const username = req.body["username"];
        const password = req.body["password"];

        const userPath = path.join(USER_DIRECTORY, `${username}.json`);
        if (fs.existsSync(userPath)) {
            const user = plainToInstance(User, JSON.parse(fs.readFileSync(userPath, 'utf-8')))
            dlog(`(${username}: Found`)
            if (user.password == password) {
                dlog(`(${username}): Password match. Auth successful.`)
                res.status(200).json(instanceToPlain(user));
            } else {
                dlog(`(${username}): Password mismatch.`)
                res.status(401).send('Invalid username or password.');
            }
        } else {
            dlog(`(${username}): Not found.`)
            res.status(401).send('Invalid username or password.');
        }
    })

    return router;
}

export default authRoute