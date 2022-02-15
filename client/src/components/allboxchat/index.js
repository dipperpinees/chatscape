import React, { useState } from 'react';
import Avatar from '../avatar';
import { RiChatSmile2Fill, RiCollageFill } from 'react-icons/ri';
import { NavLink } from 'react-router-dom';
import CoverBox from '../coverbox';

function AllBox({authentication, showCreate, showJoin, boxChat, onLogOut}) {
    const [showDropDown, setShowDropDown] = useState(false);
    
    return (
        <div className="home-all">
            <div className="home-all-user">
                <div onClick={() => setShowDropDown(!showDropDown)}>
                    <Avatar src={authentication?.avatar || require("../../assets/user.webp").default} width={72} height={72} type="curved"/>
                </div>
                {showDropDown && <ul className="home-all-logout">
                    <li onClick={() => onLogOut()}>Đăng xuất</li> 
                </ul>}
                
                <div>
                    <h3>{authentication?.user}</h3>
                    <div className="home-button">
                        <button className="home-create" onClick={() => showCreate()}><RiCollageFill />Tạo</button>
                        <button className="home-join" onClick={() => showJoin()}><RiChatSmile2Fill />Tham gia</button>
                    </div>
                </div>
            </div>
            <div className="home-all-box">  
                <span>Tin Nhắn ({boxChat.length})</span> 
                <ul>
                    {boxChat.map(box => (
                        <NavLink key={box?._id} to={box?._id}><CoverBox name={box?.name} id={box?._id} lastMessage={box?.chat[box?.chat.length - 1]}/></NavLink>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AllBox;