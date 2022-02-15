import React from 'react';
import Avatar from '../avatar';

function Message({type, message, user, avatar}) {
    return (
        <div className={type === "other" ? "other-message" : "your-message"}>
            <Avatar src={avatar || require("../../assets/user.webp").default} height={30} width={30} type="circle" />
            <div>
                <h5>{type === "other" ? user : "Bạn"}</h5>
                <p>
                    {message}
                </p>
            </div>
        </div>
    );
}

export default Message;