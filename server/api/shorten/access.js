import pool from "../../index.js";

async function access(req, res) {

    const { url } = req.body;

    // save the original URL and the shortened URL to the postgres database
    try {
        
        // get long_url from urls table with short_url
        const result = await pool.query(
            `SELECT long_url FROM urls WHERE short_url = $1`,
            [url]
        );

        if (result.rows.length == 0) { return res.status(404).end("URL not found."); }

        // increment click_count
        await pool.query(
            `UPDATE urls SET click_count = click_count + 1 WHERE short_url = $1`,
            [url]
        );

        return res.json({
            long_url: result.rows[0].long_url
        }).end();

    } catch (err) {
        console.error(err);
        return res.status(500).end("Internal Error Occurred.");
    }
}

export default access;