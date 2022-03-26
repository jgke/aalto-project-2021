import { Server } from 'socket.io';

let io: Server;
let projectIo: any | undefined;

if (process.env.NODE_ENV !== 'test') {
    io = new Server(8051, {
        cors: {
            origin: ['http://localhost:3000']
        }
    })

    projectIo = io.of('/project')

    //// eslint-disable-next-line @typescript-eslint/no-var-requires
    /* projectIo: Server = require('socket.io')(8051, {
        cors: {
            origin: ['http://localhost:3000'],
        },
    }).of('/project'); */
} else {
    projectIo = undefined
}

export { projectIo };
