import { instanceToPlain, plainToInstance } from 'class-transformer';
import debug from 'debug';
import { Request, Router } from 'express';
import fs from 'fs';
import createError from 'http-errors';
import path from 'path';

import { TypedRequestQuery } from '@backend/helpers/route_typing';
import { User } from '@models/user';

const USER_DIRECTORY = '/var/log/www/banking-nudges/users'
var dlog = debug.debug('banking:users');

function usersRoute(): Router {
    const router = Router();

    function getUsers(): User[] {
        const userfiles = fs.readdirSync(USER_DIRECTORY);
        dlog(`Loading users: ${userfiles}`)
        let users: User[] = [];

        for (let userfile of userfiles) {
            users.push(plainToInstance(User, JSON.parse(fs.readFileSync(path.join(USER_DIRECTORY, userfile), 'utf8'))));
        }

        return users;
    }

    function getUserByUsername(username: string): User | undefined {
        dlog(`Loading user ${username}`);
        const userPath = path.join(USER_DIRECTORY, `${username}.json`);
        if (fs.existsSync(userPath)) {
            return plainToInstance(User, JSON.parse(fs.readFileSync(userPath, 'utf-8')));
        }
        return undefined;
    }


    router.get('/users', (req: Request<{ id: string }>, res) => {
        res.status(200).json(JSON.stringify(getUsers()));
    });

    router.get('/user', (req: TypedRequestQuery<{ id: string, name: string }>, res, next) => {
        dlog(`Getting user: ${JSON.stringify(req.query)}`);
        if (!req.query.name) {
            return next(createError(400, 'Missing username.'));
        }

        let user = getUserByUsername(req.query.name);

        if (user) {
            res.status(200).json(JSON.stringify(instanceToPlain(user)));
        } else {
            next(createError(404, 'User not found.'));
        }
    });

    router.post('/user', (req, res, next) => {
        dlog(`User update request ${JSON.stringify(req.body)}`);
        if (req.body && typeof req.body === 'object') {
            let user = new User();
            try {
                user = plainToInstance(User, req.body);
            } catch (e) {
                dlog(`Error parsing user object`);
                return next(createError(400, 'Invalid user object.'));
            }

            dlog(`Updating user ${user.username}`);
            const userPath = path.join(USER_DIRECTORY, `${user.username}.json`);
            try {
                fs.writeFileSync(userPath, JSON.stringify(instanceToPlain(user)));
            } catch (e) {
                dlog(`Error writing user file: ${e}`);
                return next(createError(500));
            }
            dlog(`User ${user.username} updated.`)
            res.status(200);
        } else {
            return next(createError(400, 'Missing user data.'))
        }
    });

    return router;
}

export default usersRoute