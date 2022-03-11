import { Ipath, IPathRoute } from '../domain/IPath';

function path(url: string): IPathRoute {
    const allRoutes: Ipath = {
        '/test': {
            methods: ['POST', 'GET', 'PUT', 'DELETE'],
        },
        '/node': {
            methods: ['POST', 'PUT'],
        },
        '/node/:id': {
            methods: ['GET', 'DELETE'],
        },
        '/edge': {
            methods: ['POST', 'PUT'],
        },
        '/edge/:source/:target': {
            methods: ['GET', 'DELETE'],
        },
        '/project': {
            methods: ['POST', 'GET', 'PUT', 'DELETE'],
        },
        '/project/:id': {
            methods: ['DELETE'],
        },
        '/tag': {
            methods: ['POST', 'GET', 'PUT', 'DELETE'],
        },
        '/tag/proj/:proj': {
            methods: ['GET'],
        },
        '/user/register': {
            methods: ['POST'],
        },
        '/user/login': {
            methods: ['POST', 'GET'],
        },
        '/user/validity': {
            methods: ['POST'],
        },
    };
    if (url.includes('/edge/')) {
        return allRoutes['/edge/:source/:target'];
    } else if (url.includes('/node/')) {
        return allRoutes['/node/:id'];
    } else if (url.includes('/project/')) {
        return allRoutes['/project/:id'];
    } else if (url.includes('/tag/proj/')) {
        return allRoutes['/tag/proj/:proj'];
    }
    if (!(url in allRoutes)) {
        console.log(
            `The path '${url}' was requested but not included in the list of allRoutes`
        );
    }
    return allRoutes[url];
}

export { path };
