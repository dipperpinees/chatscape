import { Request, Response, Router } from 'express';
import { createToken } from '../lib/token';
import { userModel } from '../models/userSchema';
const multer = require('multer');
const { storage } = require('../lib/cloudinary');

const router = Router();

interface Error {
    [key: string]: string
}

const upload = multer({ storage: storage });

router.post('/signin', async (req: Request, res: Response) => {
    const { user, password } = req.body;
    try {
        const userInfo = await userModel.login(user, password);
        const token = await createToken(userInfo._id);
        res.json({
            user: userInfo.user,
            id: userInfo._id,
            token: token,
            avatar: userInfo?.avatar,
        });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/signup', upload.single('avatar'), async (req: any, res: Response) => {
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
            error: handleError(err),
        });
    }
})

const handleError = (err:any) : string => {
    if(err.code === 11000) {
        return 'Tài khoản này đã được đăng kí';
    }
    if(err._message.includes("user validation failed")) {
        Object.values(err.errors).forEach( ({properties}:any) => {
            const {path, message} = properties;
            return message;
        })
    }

    return "Lỗi đăng kí";
}

module.exports = router;