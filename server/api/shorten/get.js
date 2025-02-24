import pool from "../../index.js";

async function get(req, res) {
    // get all long to short urls with created time and click count

    try {
        const result = await pool.query(
            `SELECT long_url, short_url, created_at, click_count FROM urls`
        );

        return res.json(result.rows).end();

    } catch (err) {
        console.error(err);
        return res.status(500).end("Internal Error Occurred.");
    }
}

export default get;