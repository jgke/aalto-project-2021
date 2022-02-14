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
        '/tag': {
            methods: ['POST', 'GET', 'PUT', 'DELETE'],
        },
    };
    if (url.includes('/edge/')) {
        console.log('Returning weird edge url');
        return allRoutes['/edge/:source/:target'];
    }
    if (url.includes('/node/')) {
        console.log('route found, url: ', url);
        return allRoutes['/node/:id'];
    }
    if (!(url in allRoutes)) {
        console.log(`The path '${url}' was requested but not included in the list of allRoutes`);
    }

    return allRoutes[url];
}

export { path };
