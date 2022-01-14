import { Ipath, IPathRoute } from '../domain/IPath';

function path(url: string): IPathRoute {
    const allRoutes: Ipath = {
        '/test': {
            methods: ['POST', 'GET', 'PUT', 'DELETE'],
        },
        '/node': {
            methods: ['POST', 'GET', 'PUT', 'DELETE'],
        },
        '/node/:id': {
            methods: ['DELETE'],
        },
        '/edge': {
            methods: ['POST', 'GET', 'PUT', 'DELETE'],
        },
        '/edge/:source/:target': {
            methods: ['DELETE'],
        },
        '/user/register': {
            methods:['POST']
        },
        '/user/login': {
            methods: ['POST']
        }
    };
    if (url.includes('/edge/')) {
        return allRoutes['/edge/:source/:target'];
    }
    if (url.includes('/node/')) {
        return allRoutes['/node/:id'];
    }

    return allRoutes[url];
}

export { path };
