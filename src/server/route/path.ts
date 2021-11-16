import {Ipath, IPathRoute} from "../domain/IPath";

function path(url: string): IPathRoute {
    const allRoutes: Ipath = {
        "/test": {
            methods: ["POST", "GET", "PUT", "DELETE"]
        },
        "/node": {
            methods: ["GET"]
        }
    }
    return allRoutes[url];
}

export default path;
