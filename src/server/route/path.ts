import {Ipath, IPathRoute} from '../domain/IPath';

function path(url: string): IPathRoute {
    const allRoutes: Ipath = {
        '/test': {
            methods: ['POST', 'GET', 'PUT', 'DELETE']
        },
        '/node': {
            methods: ['POST', 'GET', 'PUT', 'DELETE']
        },
        '/node/:id': {
            methods: ['DELETE']
        },
        '/edge': {
            methods: ['POST', 'GET', 'PUT', 'DELETE']
        },
        '/edge/:source/:target': {
            methods: ['DELETE']
        }
    }
    if(url.includes('/edge/')){
        console.log('Returning weird edge url')
        return allRoutes['/edge/:source/:target']
    }
    if(url.includes('/node/')){
        console.log('route found, url: ', url)
        return allRoutes['/node/:id']
    } else {
        console.log('Not it fam. It was', url)
    }

    return allRoutes[url];
}

export default path;
