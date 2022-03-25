import { Request, Response, Router } from 'express';
import { decodeToken } from '../lib/token';
import { boxModel } from '../models/boxSchema';
import { userModel } from '../models/userSchema';

const router = Router();

interface Message {
    sendId: string;
    message: string;
    user: string;
    image?: string[];
}

interface Member {
    id: string;
    user: string;
    avatar?: string;
    isMaster: boolean;
}

interface UserRequest extends Request {
    userId?: string;
}

router.use(async (req: UserRequest, res: Response, next) => {
    try {
        const token: string = req.headers.authorization || '';
        req.userId = await decodeToken(token);
        next();
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
})

//get all box chat
router.get('/', async (req: UserRequest, res: Response) => {
    try {
        const yourBox = await boxModel.find({ member: { $elemMatch: { id: req.userId } } });
        res.json(yourBox);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

//create box chat
router.post('/', async (req: UserRequest, res: Response) => {
    const { name, password } = req.body;
    try {
        const user = await userModel.findById(req.userId);

        const userInfo: Member = {
            id: req.userId || "",
            user: user.user,
            avatar: user.avatar || '',
            isMaster: true,
        };

        let code: string = '100000';
        const lastItem = await boxModel.find().sort({ _id: -1 }).limit(1);
        if (lastItem.length !== 0) {
            code = (Number(lastItem[0].code) + 1).toString();
        }

        const box = await boxModel.create({
            member: [userInfo],
            name: name,
            code: code,
            password: password || '',
        });

        res.json(box);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

//join box chat
router.put('/', async (req: UserRequest, res: Response) => {
    const { codeBox, roomPassword } = req.body;
    try {
        const { password } = await boxModel.findOne({ code: codeBox });
        if (!password || password === roomPassword) {
            const user = await userModel.findById(req.userId);
            const userInfo: Member = {
                id: req.userId || "",
                user: user.user,
                avatar: user.avatar || '',
                isMaster: false,
            };
            const box = await boxModel.findOneAndUpdate(
                { code: codeBox },
                { $addToSet: { member: userInfo } },
                { safe: true, upsert: true }
            );

            res.json(box);
        } else {
            res.status(400).json({ error: 'Mật khẩu không chính xác' });
        }
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

//delete box chat
router.delete('/', async (req: UserRequest, res: Response) => {
    const { id } = req.body;
    try {
        const thisBox = await boxModel.findOneAndDelete({
            _id: id,
            member: { $elemMatch: { id: req.userId, isMaster: true } },
        });
        if (thisBox) {
            res.json({ id: thisBox._id });
        } else {
            res.status(400).json({ error: 'Xóa không thành công' });
        }
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

//get data box chat
router.get('/:id', async (req: UserRequest, res: Response) => {
    const boxId: string = req.params.id;
    try {
        const box = await boxModel.findOne({ _id: boxId, member: { $elemMatch: { id: req.userId } } });
        if (box) {
            const { password, ...restBox } = box._doc;
            res.json(restBox);
        } else {
            res.status(400).json({ error: 'Bạn không có quyền truy cập phòng này' });
        }
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

// send message
router.post('/:id', async (req: UserRequest, res: Response) => {
    const boxId: string = req.params.id;
    const { message, user } = req.body;
    try {
        const member = await boxModel.findOne({ _id: boxId, member: { $elemMatch: { id: req.userId } } });
        if (member) {
            const messageBox: Message = {
                sendId: req.userId || "",
                message: message,
                user: user,
            };
            await boxModel.findByIdAndUpdate(
                boxId,
                { $push: { chat: messageBox } },
                { safe: true, upsert: true }
            );
            res.json({ boxId: boxId, message: message });
        } else {
            res.status(400).json({ error: 'Bạn không có quyền truy cập phòng chat này' });
        }
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

//out box chat
router.delete('/:id', async (req: UserRequest, res: Response) => {
    const id = req.params.id;
    try {
        await boxModel.findByIdAndUpdate(id, { $pull: { member: { id: req.userId } } });
        res.json({ boxId: id });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
