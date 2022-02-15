const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const userSchema = new mongoose.Schema({
    user: {
        type: String,
        required: [true, "Cần nhập tài khoản"],
        minLength: [6, "Tài khoản phải có độ dài tối thiểu là 6"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Cần nhập mật khẩu"],
        minLength: [6, "Mật khẩu phải có độ dài tối thiểu là 6"]
    },
    avatar: {
        type: String,
    },
}, schemaOptions)


//pre save password to database
userSchema.pre('save',  async function (this:any, next:any, )  {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    next();
})

//login
userSchema.statics.login = async function(user:string, password:string) {
    const userInfo = await this.findOne({user: user});
    if(userInfo) {
        const auth = await bcrypt.compare(password, userInfo.password);
        if(auth) {
            return userInfo;
        } 
        throw Error("Mật khẩu chưa chính xác")
    }
    throw Error("Tài khoản chưa tồn tại");
}

export const userModel = mongoose.model("user", userSchema);

