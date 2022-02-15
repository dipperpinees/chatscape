import React from 'react';
import Avatar from '../avatar';
import "./styles.scss";

function Member({member}) {
    return (
        <div className="member">
            <Avatar type="circle" width={36} height={36} src={member?.avatar || require("../../assets/user.webp").default} />
            <div className="member-name">
                <h5>{member?.user}{member?.isMaster && "(Chủ phòng)"}</h5>
                <span style={{color: "#5BC98A"}}>Online</span>
            </div>
        </div>
    );
}

export default Member;