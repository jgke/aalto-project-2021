import {getConfig} from './configs';
import {Pool, QueryConfig} from 'pg';

class Database {
	private _pool: Pool | null = null;

    async query(text: string | QueryConfig<any>, params: unknown[]) {
		const start = Date.now();
		const pool = await this.getPool();
		const res = await pool.query(text, params);
		const duration = Date.now() - start;
		console.log('executed query', { text, duration, rows: res.rowCount });
		return res;
    }

    async getClient() {
		const pool = await this.getPool();
      const client = await pool.connect();
      return client;
    }

	async getPool(): Promise<Pool> {
		if (!this._pool) {
			const config = await getConfig();
			this._pool = new Pool(config.poolConfig);
		}
		return this._pool;
	}
}

const db = new Database();
export { db };