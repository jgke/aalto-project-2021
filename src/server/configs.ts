import {IConfigs} from "./domain/IConfigs";

const configs: IConfigs = {
    poolConfig: {
        host: String(process.env.PG_HOSTNAME),
        port: Number(process.env.PG_PORT) || 5432,
        user: String(process.env.PG_USER),
        database: String(process.env.PG_DATABASE),
        password: String(process.env.PG_PASSWORD)
    }
}

export async function getConfig(): Promise<IConfigs> {
    return configs
}