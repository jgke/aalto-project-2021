import { IConfigs } from './domain/IConfigs';

const configs: IConfigs = {
    poolConfig: {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        database: 'postgres',
        password: 'example',
    },
};

export async function getConfig(): Promise<IConfigs> {
    return configs;
}
