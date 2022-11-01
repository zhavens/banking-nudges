import { User } from '@models/user';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Request, Router } from 'express';
import fs from "fs";

export const usersRoute = Router();

usersRoute.get('/users', (req: Request<{ id: string }>, res) => {
    let contents: User = plainToInstance(User, JSON.parse(fs.readFileSync(`./${req.params['id']}.json`, "utf8")));
    if (contents) {
        res.status(200).json(JSON.stringify(instanceToPlain(contents)));
    } else {
        res.status(404).json(JSON.stringify({ msg: "Missing contents!" }));
    }
});