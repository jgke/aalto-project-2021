import { Namespace, Server, Socket } from 'socket.io';

export let projectIo: Namespace | undefined;

export const initSockets = (io: Server) => {
    if (process.env.NODE_ENV !== 'test') {
        projectIo = io.of('/project');

        projectIo.on('connection', (socket: Socket) => {
            socket.on('join-project', (room: string) => {
                socket.join(room);
            });

            socket.on('leave-project', (room: string) => {
                socket.leave(room);
            });
        });
    } else {
        projectIo = undefined;
    }
};
