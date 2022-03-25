import { boxModel } from "../models/boxSchema";
import { decodeToken } from "./token";

module.exports = function(io:any) {
    io.use(async (socket: any, next: any) => {
        if (socket.handshake.query && socket.handshake.query.token) {
            const id = await decodeToken(socket.handshake.query.token);
            socket.handshake.query.id = id;
            next();
        } else {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', async (socket: any) => {
        const userId = socket.handshake.query.id;
        const yourBox = await boxModel.find({
            member: { $elemMatch: { id: userId } },
        });
        yourBox.forEach((box: any) => {
            socket.join(box?._id.toString());
        });
    
        socket.on('join', async (msg: any) => {
            const { boxId, userId } = msg;
            const joinBox = await boxModel.findOne({
                _id: boxId,
                member: { $elemMatch: { id: userId } },
            });
            if (joinBox) {
                socket.join(boxId.toString());
                socket.broadcast.to(boxId.toString()).emit('join', msg);
            }
        });
    
        socket.on('chat', async (msg: any) => {
            const { boxId } = msg;
            socket.to(boxId.toString()).emit('chat', { ...msg, userId });
        });
    });
};