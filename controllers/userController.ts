import { userModel } from "../models/userSchema";
const jwt = require("jsonwebtoken");

interface Error {
    [key: string]: string
}

const handleError = (err:any) : Error => {
    const error:Error = {};
    if(err.code === 11000) {
        error.user = 'Tài khoản này đã được đăng kí';
        return error;
    }
    if(err._message.includes("user validation failed")) {
        Object.values(err.errors).forEach( ({properties}:any) => {
            const {path, message} = properties;
            error[path] = message;
        })
    }
    return error;
}

const createToken = async (id:string) => {
    const token = await jwt.sign({id: id}, 'hiepnknk');
    return token;
}

const signup_post = async (req:any, res: any) => {
    const avatar = req?.file?.path;
    const {user, password} = req.body;
    try {
        const userInfo = await userModel.create({user, password, avatar});
        const token = await createToken(userInfo._id);
        res.json({
            user: userInfo.user,
            id: userInfo._id,
            avatar: userInfo.avatar,
            token: token,
        });
    } catch (err) {
        res.status(400).json({
            ...handleError(err),
            error: true
        });
    }
}


const signin_post = async (req:any, res: any) => {
    const {user, password} = req.body;
    try {
        const userInfo = await userModel.login(user, password);
        const token = await createToken(userInfo._id);
        res.json({
            user: userInfo.user,
            id: userInfo._id,
            token: token,
            avatar: userInfo?.avatar
        });
    } catch (err:any) {
        res.status(400).json({error: err.message})
    }
}


module.exports = { signup_post, signin_post }