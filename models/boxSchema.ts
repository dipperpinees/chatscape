const mongoose = require('mongoose');

const schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const chatSchema = new mongoose.Schema({
    sendId: String,
    message: String,
    image: Array,
    user: String
}, schemaOptions)

const memberSchema = new mongoose.Schema({
    id: String,
    user: String,
    avatar: String,
    isMaster: Boolean,
}, schemaOptions)

const boxSchema = new mongoose.Schema({
    member: [memberSchema],
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String
    },
    chat: [chatSchema],
    code: {
        type: String,
        required: true,
        unique: true
    }
}, schemaOptions)

export const boxModel = mongoose.model("boxchat", boxSchema);



