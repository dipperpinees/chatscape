import React, { useRef, useState } from 'react';
import { RiEmotionHappyLine, RiInformationLine, RiMoreFill, RiSendPlaneFill } from "react-icons/ri";
import { useMediaQuery } from 'react-responsive';
import ScrollToBottom from 'react-scroll-to-bottom';
import Avatar from '../avatar';
import { Emoji } from '../emoji';
import GroupInfo from '../groupinfo';
import Message from '../message';
import "./styles.scss";
import { IoChevronBackOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { Route, Routes } from 'react-router';

function MessageBox({userId, box, onSend, onOut, onDelete}) {
    const [isShowEmoji, setIsShowEmoji] = useState(false);
    const sendRef = useRef(null);
    const chatRef = useRef(null);
    const isMobile = useMediaQuery({ query: '(max-width: 739px)' })
    const isMaster = userId === box?.member[0].id;
    const [showDropdown, setShowDropdown] = useState(false);

    const handleSend = (e) => {
        e.preventDefault();
        if(sendRef.current.value) {
            onSend({
                message: sendRef.current.value,
                boxId: box?._id
            });
            sendRef.current.value = "";
        } 
    }

    const pickEmoji = (emoji) => {
        sendRef.current.value += emoji;
        sendRef.current.focus();
        setIsShowEmoji(false);
    }

    const findMember = (memberList, id) => {
        return memberList.find((member) => member.id === id)
    }

    return (
        <div className="box">
            <div className="box-message"> 
                <div className="box-message-header">
                    <div className="box-message-header-member">
                        <Link to="/" className="back"> <IoChevronBackOutline /> </Link>
                        <Avatar src="https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes/128/chat-circle-blue-512.png" width={44} height={44} type="circle"/>
                        <div>
                            <h5>{box?.name}</h5>
                            <p>{box?.member.length} thành viên</p>
                        </div>
                    </div>
                    <div className="box-message-header-options">
                        {isMobile && <Link to="info"><RiInformationLine /></Link>}
                        <RiMoreFill style={{marginLeft: 8}} onClick={() => setShowDropdown(!showDropdown)}/>
                        {showDropdown && <ul className="box-message-header-options-dropdown">
                            {isMaster ?<li onClick={() => onDelete(box?._id)}>Xóa phòng</li> : <li onClick={() => onOut(box?._id)}>Rời phòng</li>}  
                        </ul>}
                    </div>
                    
                </div>
                <ScrollToBottom ref={chatRef} className="box-message-chat">
                    {box?.chat?.map(function(chat) {
                        const member = findMember(box?.member, chat.sendId);
                        return (
                            <Message type={chat.sendId === userId ? "you" : "other"} message={chat.message} user={member?.user} avatar={member?.avatar}/>
                        )
                    })}
                </ScrollToBottom>
                <form onSubmit={handleSend} className="box-message-type">
                    <input type="text" placeholder="Gửi tin nhắn ..." ref={sendRef}/>
                    <div className="box-message-type-emoji" style={{position: "relative"}}>
                        <RiEmotionHappyLine onClick={() => setIsShowEmoji(!isShowEmoji)}/>
                        {isShowEmoji && <Emoji pickEmoji={pickEmoji} />}
                    </div>
                    <button type="submit">
                        <RiSendPlaneFill />
                    </button>
                </form>

            </div>
            {/* {showGroupInfo && } */}


            {isMobile ? <Routes>
                <Route path="info" element={<div className="box-group">
                    <GroupInfo members={box?.member} code={box?.code} pass={box?.password}/>
                </div>}/>
                </Routes> 
                : <div className="box-group">
                    <GroupInfo members={box?.member} code={box?.code} pass={box?.password}/>
                </div>}
        </div>
    );
}

export default MessageBox;