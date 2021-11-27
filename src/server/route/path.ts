import {Ipath, IPathRoute} from "../domain/IPath";

function path(url: string): IPathRoute {
    const allRoutes: Ipath = {
        "/test": {
            methods: ["POST", "GET", "PUT", "DELETE"]
        },
        "/node": {
            methods: ["POST", "GET", "PUT", "DELETE"]
        },
        "/node/:id": {
            methods: ["DELETE"]
        },
        "/edge": {
            methods: ["POST", "GET", "PUT", "DELETE"]
        }
    }

    if(url.includes('/node/')){
        console.log("route found, url: ", url)
        return allRoutes["/node/:id"]
    } else {
        console.log("Not it fam. It was", url)
    }

    return allRoutes[url];
}

export default path;
