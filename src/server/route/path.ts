import {Ipath, IPathRoute} from "../domain/IPath";

function path(url: string): IPathRoute {
    const allRoutes: Ipath = {
        "/test": {
            methods: ["POST", "GET", "PUT", "DELETE"]
        },
        "/node": {
<<<<<<< HEAD
            methods: ["GET"]
=======
            methods: ["POST", "GET", "PUT", "DELETE"]
>>>>>>> 07a358b5aa96c8aec67f5ea1e1a2d562ee87179e
        }
    }
    return allRoutes[url];
}

export default path;
