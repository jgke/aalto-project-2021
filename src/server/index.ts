import express, { Request, Response, Router, Express } from 'express';
require('express-async-errors'); //This needs to be imported before 'router' at least
import * as router from './route';
import { RequestHandler } from 'express-serve-static-core';
import { Server } from 'socket.io';
import { initSockets } from './helper/socket';

// call express
export const app: Express = express(); // define our app using express

// configure app to use bodyParser for
// Getting data from body of requests

app.use(express.urlencoded({ extended: true }) as RequestHandler);

app.use(express.json() as RequestHandler);

const port: number = Number(process.env.PORT) || 8050; // set our port

// REGISTER ROUTES
// all of the routes will be prefixed with /api
const routes: Router[] = Object.values(router);
app.use('/api', routes);

// Send index.html on root request
app.use(express.static('dist'));
app.get('/*', (req: Request, res: Response) => {
    res.sendFile('/dist/index.html', { root: __dirname });
});

let io: Server | undefined;

// START THE SERVER
// =============================================================================
if (process.env.NODE_ENV !== 'test') {
    const server = app.listen(port);
    io = new Server(server);
    initSockets(io);

    // eslint-disable-next-line no-console
    console.log(`App listening on ${port}`);
}
