import express from 'express';
import loggingRoute from './logging';
import { usersRoute } from './users';

const routes = express.Router();

routes.use(usersRoute);
routes.use(loggingRoute);

export default routes;