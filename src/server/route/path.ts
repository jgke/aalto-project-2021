import {Ipath, IPathRoute} from "../domain/IPath";

function path(url: string): IPathRoute {
    const allRoutes: Ipath = {
        "/test": {
            methods: ["POST", "GET", "PUT", "DELETE"]
        },
        "/node": {
            methods: ["POST", "GET", "PUT", "DELETE"]
        },
        "/edge": {
            methods: ["POST", "GET", "PUT", "DELETE"]
        },
        "/edge/delete": {
            methods: ["POST"]
        }
    }
    return allRoutes[url];
}

export default path;
