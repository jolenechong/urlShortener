/**
 * /api/auth/verifyToken.ts
 * Helper function to verify JWT Token
 * 
 */

import jwt from "jsonwebtoken";
import pool from "../../index.js";
import keys from "./../../keys.js";

async function verifyToken(token) {

    try {
        const decode = jwt.verify(token, keys.jwtSecret) || false;
        if (!decode) { return false; }

        // check decode email
        if (!decode.email || decode.email == "") { return false; }

        let user = await pool.query("SELECT * FROM users WHERE email = $1", [decode.email]);
        if (user.rows.length == 0) { return false; }

        return user.rows[0] || false;
    } catch (err) {
        console.error(err);
        return false;
    }

}

export default verifyToken;