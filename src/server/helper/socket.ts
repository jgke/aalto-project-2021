import { Server } from 'socket.io';

let io: Server;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let projectIo: any | undefined;

if (process.env.NODE_ENV !== 'test') {
    io = new Server(8051, {
        cors: {
            origin: ['http://localhost:3000', 'http://localhost:8050']
        }
    })

    projectIo = io.of('/project')

} else {
    projectIo = undefined
}

export { projectIo };
