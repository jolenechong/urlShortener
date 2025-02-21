/**
 * /api/auth/login.ts
 * Middleware to verify users or set them as unauthenticated
 * 
 */

import verifyToken from "./verifyToken";

const { JWT_SECRET } = process.env;
if (!JWT_SECRET) { throw new Error("JWT_SECRET not set in environment!"); }

async function verify(req, res, next) {

    const token = req.cookies.token

    if (!token) {
        // add this to req
        req.body.auth = { isAuthenticated: false };
        return next();
    }

    const user = await verifyToken(token)

    req.body.auth = { isAuthenticated: !! user, ui: user };
    
    return next();

    // if (!user) { return res.json({ "message": "User cannot be authenticated." }).end(); }

    // return res.json({
    //     id: user._id,
    //     name: user.name,
    //     email: user.email,
    //     level: user.level
    // }).end();
}

export default verify;