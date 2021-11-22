<<<<<<< HEAD
import {configs} from './configs';
import {Pool, PoolClient, QueryConfig} from 'pg';

const pool = new Pool(configs.poolConfig);

interface ExtendedPoolClient extends PoolClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lastQuery: any[];
}

class Database {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async query(text: string | QueryConfig<any>, params: any) {
      const start = Date.now();
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      console.log('executed query', { text, duration, rows: res.rowCount });
      return res;
    }

    async getClient() {
      const client = await pool.connect() as ExtendedPoolClient;
    //   const query = client.query;
    //   const release = client.release;
    //   // set a timeout of 5 seconds, after which we will log this client's last query
    //   const timeout = setTimeout(() => {
    //     console.error('A client has been checked out for more than 5 seconds!');
    //     console.error(`The last executed query on this client was: ${client.lastQuery}`);
    //   }, 5000);
    //   // monkey patch the query method to keep track of the last query executed
    //   client.query = (...args) => {
    //     client.lastQuery = args;
    //     return query.apply(client, args);
    //   }
    //   client.release = () => {
    //     // clear our timeout
    //     clearTimeout(timeout);
    //     // set the methods back to their old un-monkey-patched version
    //     client.query = query;
    //     client.release = relealinse;
    //     return release.apply(client);
    //   }
      return client;
    }
=======
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
>>>>>>> origin/database-migration
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
    //migration failed, probably because of existing data
    //therefore, during development, drop all tables and try again

    await client.query(
      `DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO postgres;
      GRANT ALL ON SCHEMA public TO public;
      COMMENT ON SCHEMA public IS 'standard public schema';`
    );

    console.log("rerunning migrations");
    return migrate({client}, "./migrations");
  }).then(() => { console.log("migrations done"); }); 
});

export { db };