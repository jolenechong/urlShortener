/**
 * /api/auth/verifyToken.ts
 * Helper function to verify JWT Token
 * 
 * Created by Jolene Chong
 */

import { User, UserModel } from "../../models/user.model";
import jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;
if (!JWT_SECRET) { throw new Error("JWT_SECRET not set in environment!"); }

async function verifyToken(token) {

    // const decode = jwt.verify(token, JWT_SECRET!) as UserModel;

    // if (!decode) { return false; }
    // let user = await User.findOne({ _id: decode.id });
    // const user_update = {"id": user?._id,
    //     "name": user?.name,
    //     "email": user?.email,
    //     "count": user?.count
    // }
    // if (!user) {user_update === null}
    // return user_update || false;

    return false;

}

export default verifyToken;