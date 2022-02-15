const jwt = require("jsonwebtoken");
import { boxModel } from "../models/boxSchema";
import { userModel } from "../models/userSchema";

interface Message {
    sendId: string,
    message: string,
    user: string,
    image?: string[],
}

interface Box {
    boxId: string,
    name: string
}

interface Member {
    id: string,
    user: string,
    avatar?: string,
    isMaster: boolean
}

const decodeToken = async (token: string) => {
    let id:string = "";
    await jwt.verify(token, 'hiepnknk', function(err:any, decoded:any) {
        if(!err) {
            id = decoded.id;
        } else {
            throw Error("Xác thực không thành công");
        }
    });
    return id;
}

const create_box = async (req:any, res:any) => {
    const token = req.headers.authorization;
    const {name, password} = req.body;
    try {
        const userId = await decodeToken(token);
        const user = await userModel.findById(userId);

        const userInfo:Member = {
            id: userId,
            user: user.user,
            avatar: user.avatar || "",
            isMaster: true
        }

        let code:string = "100000";
        const lastItem = await boxModel.find().sort({ _id: -1 }).limit(1);
        if(lastItem.length !== 0) {
            code = (Number(lastItem[0].code) + 1).toString();
        } 

        const box = await boxModel.create({
            member: [userInfo],
            name: name,
            code: code,
            password: password || ""
        });

        res.json(box);
    } catch (err:any) {
        res.status(400).json({error: err.message})
    }
}

const join_box = async (req:any, res: any) => {
    const { codeBox, roomPassword } = req.body; 
    const token = req.headers.authorization;
    try {
        const userId = await decodeToken(token);
        
        const {password} = await boxModel.findOne({code: codeBox});
        if(!password || password === roomPassword) {
            const user = await userModel.findById(userId);
            const userInfo:Member = {
                id: userId,
                user: user.user,
                avatar: user.avatar || "",
                isMaster: false
            }
            const box = await boxModel.findOneAndUpdate({code: codeBox}, 
                {$addToSet: {"member": userInfo}},
                {safe: true, upsert: true})

            res.json(box);
        } else {
            res.status(400).json({error: "Mật khẩu không chính xác"});
        }
    } catch (err:any) {
        res.status(400).json({error: err.message});
    }
}

const get_box = async (req:any, res:any) => {
    const boxId:string = req.params.id;
    const token:string = req.headers.authorization;
    try {
        const userId = await decodeToken(token);
        const box = await boxModel.findOne({_id: boxId, member: {$elemMatch: {id: userId}}});
        if(box) {
            const {password,...restBox} = box._doc;
            res.json(restBox);
        } else {
            res.status(400).json({error: "Bạn không có quyền truy cập phòng này"})
        }
    } catch(err:any) {
        res.status(400).json({error: err.message})
    }
}

const send_message = async (req:any, res:any) => {
    const boxId:string  = req.params.id; 
    const token:string = req.headers.authorization;
    const {message, user} = req.body;
    try {
        const id = await decodeToken(token);
        // , member: {$elemMatch: {id: id}}}
        const member = await boxModel.findOne({_id: boxId, member: {$elemMatch: {id: id}}});
        if(member) {
            const messageBox:Message = {
                sendId: id,
                message: message,
                user: user
            }
            await boxModel.findByIdAndUpdate(boxId, 
                {$push: {"chat": messageBox}},
                {safe: true, upsert: true})
            res.json({boxId: boxId, message: message});
        } else {
            res.status(400).json({error: "Bạn không có quyền truy cập phòng chat này"});
        }
    } catch (err:any) {
        res.status(400).json({error: err.message});
    }
}

const get_all_box = async (req:any, res:any) => {
    const token:string = req.headers.authorization;
    try {
        const userId = await decodeToken(token);
        const yourBox = await boxModel.find({member: {$elemMatch: {id: userId}}});
        // res.json({boxId: boxId, message: message});
        res.json(yourBox);
    } catch(err:any) {
        res.status(400).json({error: err.message});
    }
}

const out_box = async (req:any, res:any) => {
    const token:string = req.headers.authorization;
    const id = req.params.id;
    try {
        const userId = await decodeToken(token);
        await boxModel.findByIdAndUpdate(id, 
            {$pull: {member: {id: userId}}})
        res.json({boxId: id});
    } catch (err:any) {
        res.status(400).json({error: err.message})
    }
}

const delete_box = async (req:any, res:any) => {
    const token:string = req.headers.authorization;
    const {id} = req.body;
    try {
        const userId = await decodeToken(token);
        const thisBox = await boxModel.findOneAndDelete({_id: id, member: {$elemMatch: {id: userId, isMaster: true}}})
        if(thisBox) {
           res.json({id: thisBox._id});
        } else {
            res.status(400).json({error: "Xóa không thành công"})
        }
    } catch (err:any) {
        res.status(400).json({error: err.message})
    }
}

module.exports = {
    create_box,
    join_box,
    send_message,
    get_box,
    get_all_box,
    out_box,
    delete_box
}