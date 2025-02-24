import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from "../../index.js";
import keys from "./../../keys.js";

async function login(req, res) {

    const { email, password } = req.body;

    if (!email || !password ) { return res.json({"message":"Please fill up all fields."}).end(); }

    // Check if user with email exists with pool
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (!user.rows[0]) { return res.status(403).json({"message": "Email and Password combination is incorrect"}); }

    // Check if password is valid
    const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);
    if (!isPasswordValid) { return res.status(403).json({"message": "Email and Password combination is incorrect"}); }

    if (!keys.jwtSecret) { return res.status(500).json({"message": "Missing Secret"}); }
    const token = jwt.sign({ id: user.rows[0].id, email: user.rows[0].email }, keys.jwtSecret);

    res.cookie('token', token);

    return res.json({
        id: user.rows[0].id,
        email: user.rows[0].email
    }).end();
}

export default login;