import express from 'express';
import { usersRoute } from './users';

export const routes = express.Router();

routes.use(usersRoute);