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
export const usersRoute = Router();

function getUsers(): User[] {
    const userfiles = fs.readdirSync(USER_DIRECTORY);
    dlog(`Fetching users: ${userfiles}`)
    let users: User[] = [];

    for (let userfile of userfiles) {
        users.push(plainToInstance(User, JSON.parse(fs.readFileSync(path.join(USER_DIRECTORY, userfile), 'utf8'))));
    }

    return users;
}


function getUserById(id: string): User | undefined {
    dlog(`Fetching user ${id}`);
    const userPath = path.join(USER_DIRECTORY, `${id}.json`);
    if (fs.existsSync(userPath)) {
        return plainToInstance(User, JSON.parse(fs.readFileSync(userPath, 'utf-8')));
    }
    return undefined;
}


usersRoute.get('/users', (req: Request<{ id: string }>, res) => {
    res.status(200).json(JSON.stringify(getUsers()));
});

usersRoute.get('/user', (req: TypedRequestQuery<{ id: string, name: string }>, res, next) => {
    console.log(JSON.stringify(req.query));
    if (!req.query.id && !req.query.name) {
        return next(createError(400, 'Missing user ID.'));
    }

    if (req.query.id) {
        const user = getUserById(req.query.id);
        if (user) {
            res.status(200).json(JSON.stringify(instanceToPlain(user)));
            return
        }
    } else {
        const users = getUsers();
        for (let user of users) {
            if (user.username == req.query.name) {
                res.status(200).json(JSON.stringify(instanceToPlain(user)));
                return;
            }
        }

    }

    next(createError(404, 'User not found.'));
});

usersRoute.post('/user', (req, res, next) => {
    console.log(req.body);
    if ('user' in req.body && typeof req.body['user'] == 'object') {
        let user = new User();
        try {
            user = plainToInstance(User, req.body['user']);
        } catch (e) {
            dlog(`Error parsing user object`);
            return next(createError(400, 'Invalid user object.'));
        }

        dlog(`Updating user ${user.id}.`);
        const userPath = path.join(USER_DIRECTORY, `${user.id}.json`);
        try {
            fs.writeFileSync(userPath, JSON.stringify(instanceToPlain(user, { excludeExtraneousValues: true })));
        } catch (e) {
            dlog(`Error writing user file: ${e}`);
            return next(createError(500));
        }
        dlog(`User ${user.id} updated.`)
        res.status(200);
    } else {
        return next(createError(400, 'Missing user data.'))
    }
});