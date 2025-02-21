// import { User } from "../../models/user.model";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const { JWT_SECRET } = process.env;
if (!JWT_SECRET) { throw new Error("JWT_SECRET not set in environment!"); }

async function login(req, res) {

    if ( !req.body.email || !req.body.password ) { return res.json({"message":"Please fill up all fields."}).end(); }

    // Check if user with email exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) { return res.status(403).end("Email and Password combination is incorrect"); }

    // Check if password is valid
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) { return res.status(403).end("Email and Password combination is incorrect"); }

    const token = jwt.sign({ id: user._id }, JWT_SECRET);

    res.cookie('token', token);

    return res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        count: user.count
    }).end();
}

export default login;