// import { User } from "../../models/user.model";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;
if (!JWT_SECRET) { throw new Error("JWT_SECRET not set in environment!"); }

async function signup(req, res) {

    if (!req.body.name || !req.body.email || !req.body.password || !req.body.confirmPassword) { return res.json({"message":"Please fill up all fields."}).end(); }
    if (req.body.password !== req.body.confirmPassword){ return res.json({"message":"Passwords should be the same."}).end();}

    try {
        // const user = await User.findOne({ email: req.body.email });
        // if (user) { return res.status(409).end("Email already in use."); }

        // const password = bcrypt.hashSync(req.body.password, 10);

        // const newUser = new User({
        //     name: req.body.name,
        //     email: req.body.email,
        //     password: password,
        //     count: 0
        // });

        // await newUser.save();

        // const token = jwt.sign({ id: newUser._id }, JWT_SECRET!);

        // res.cookie('token', token);

        // console.log('new user created')

        // return res.json({
        //     id: newUser._id,
        //     name: newUser.name,
        //     email: newUser.email,
        //     count: 1
        // }).end();
        
        return res.json({"message":"Signup is disabled for now."}).end();

    } catch (err) {
        console.error(err);
        return res.status(500).end("Internal Error Occurred.");
    }

}

export default signup;