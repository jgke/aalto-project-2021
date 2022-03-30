import { Server } from 'socket.io';

//let io: Server;
/// eslint-disable-next-line @typescript-eslint/no-explicit-any
//let projectIo: any | undefined;

const io = new Server(8051, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:8050']
    }
})

const projectIo = io.of('/project')

export { io };
export { projectIo };
