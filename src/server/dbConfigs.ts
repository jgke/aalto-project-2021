import {getConfig} from './configs';
import {Pool, PoolConfig, QueryConfig} from 'pg';
import { migrate } from "postgres-migrations";

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
db.getClient().then((client) => { 
  console.log("running migrations");
  migrate({ client }, "./migrations").catch( async () => { 
    console.log("migration failed, dropping all tables");

    await client.query(
      `DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO postgres;
      GRANT ALL ON SCHEMA public TO public;
      COMMENT ON SCHEMA public IS 'standard public schema';`
    );

    console.log("rerunning migrations");
    return migrate({client}, "./migrations");
  }); 
});

export { db };