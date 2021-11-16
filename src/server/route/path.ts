import {Ipath, IPathRoute} from "../domain/IPath";

function path(url: string): IPathRoute {
    const allRoutes: Ipath = {
        "/test": {
            methods: ["POST", "GET", "PUT", "DELETE"]
        },
        "/node": {
            methods: ["POST", "GET", "PUT", "DELETE"]
        }
    }
    return allRoutes[url];
}

export default path;
