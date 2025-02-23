import pool from "../../index.js";

async function shorten(req, res) {

    const { url } = req.body;

    // check if auth exists
    if (!req.body.auth || !req.body.auth.ui || !req.body.auth.ui.id) {
        return res.status(401).end("Unauthorized");
    }

    const user_id = req.body.auth.ui.id;
    const created_at = new Date();
    // const short_url = `http://localhost:3001/access/${path}`; // hard save domain for now

    // generate a 5 character path of alphanumerics for the shortened URL
    // check that path hasn't been used before in db
    let result;
    try {
        result = await pool.query(
            `SELECT short_url FROM urls`
        );
    } catch (err) {
        console.error(err);
        return res.status(500).end("Internal Error Occurred.");
    }

    const existingUrls = new Set(result.rows.map(row => row.short_url));

    let short_url;
    let path;
    do {
        path = generateRandomString();
        short_url = `http://localhost:3001/access/${path}`;

        // save the original URL and the shortened URL to the postgres database
        try {
            // urls table has user_id, long_url, short_url, click_count and created_at columns
            const result = await pool.query(
                `INSERT INTO urls (user_id, long_url, short_url, click_count, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                [user_id, url, short_url, 0, created_at]
            );
            console.log(result.rows[0]);

            return res.json({
                long_url: url,
                short_url: short_url
            }).end();

        } catch (err) {
            console.error(err);
            return res.status(500).end("Internal Error Occurred.");
        }
    } while (existingUrls.has(short_url));

}

function generateRandomString(length = 5) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

export default shorten;