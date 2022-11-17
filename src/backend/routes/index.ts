import express from 'express';
import expressWs from 'express-ws';
import loggingRoute from './logging';
import usersRoute from './users';


function getApiRouter(): express.Router {
    let routes = express.Router() as expressWs.Router;

    routes.use(usersRoute());
    routes.use(loggingRoute());

    return routes;
}


export default getApiRouter;