import express from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;
const pool = new Pool({
    user: 'postgres',
    host: 'postgres',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 0,
});
const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
// GET endpoint for retrieving paginated apartments
app.get("/apartments", async (req, res) => {
    const pageSize = 25;
    let page = 1;
    if (req.query.page) {
        page = parseInt(req.query.page.toString());
    }
    const offset = (page - 1) * pageSize;
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM apartments LIMIT ${pageSize} OFFSET ${offset}`);
        const apartments = result.rows;
        res.json(apartments);
        client.release();
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
//# sourceMappingURL=index.js.map