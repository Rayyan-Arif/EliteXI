import { Pool } from "pg";

const pool = new Pool(
    process.env.NODE_ENV === 'development' ? 
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: +process.env.DB_PORT!
    } : 
    {
        connectionString: process.env.DB_URL,
    }
);

export default pool;