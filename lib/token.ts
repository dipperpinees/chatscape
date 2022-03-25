const jwt = require('jsonwebtoken');
require('dotenv').config();

export const decodeToken = async (token: string) => {
    let id:string = "";
    await jwt.verify(token, process.env.TOKENDECODEPASS, function(err:any, decoded:any) {
        if(!err) {
            id = decoded.id;
        } else {
            throw Error("Xác thực không thành công");
        }
    });
    return id;
}

export const createToken = async (id:string) => {
    const token = await jwt.sign({id: id}, process.env.TOKENDECODEPASS);
    return token;
}