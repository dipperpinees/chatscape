import React from 'react';
import Avatar from '../avatar';

function CoverBox({name, lastMessage}) {
    // style={{backgroundColor: "#F5F7F9", "border-left": "3px solid #8d9bee"}}
    return (
        <div className="coverbox" >
            <Avatar src="https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes/128/chat-circle-blue-512.png" width={44} height={44} type="circle"/>
            <div className="coverbox-info">
                <div>
                    <h5>{name}</h5>
                    <p style={lastMessage?.isNew && {fontWeight: 600, color: "#000"}}> {lastMessage && `${lastMessage?.user}:`} {lastMessage?.message}</p>
                </div>
                {/* <span>{handleTime(updateAt)}</span> */}
            </div>
        </div>
    );
}

export default CoverBox;