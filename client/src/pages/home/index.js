import React, { useContext, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Route, Routes, useNavigate } from 'react-router';
import { io } from 'socket.io-client';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { create_box, get_all_box, join_box, out_box, post_chat, remove_box } from '../../api/chatApi';
import authContext from '../../container/authContext';
import { removeAuth } from '../../container/localstorage';
import AllBox from '../../components/allboxchat';
import CreateBox from '../../components/createbox';
import JoinBox from '../../components/joinbox';
import Loading from '../../components/loading';
import MessageBox from '../../components/messagebox';
import sound from '../../assets/sound.mp3';
import { SOCKET_API } from '../../constant/namespace';

let socket;

function Home(props) {
    const { authentication, setAuthentication } = useContext(authContext);
    const navigate = useNavigate();
    const [boxChat, setBoxChat] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [showJoin, setShowJoin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newUpdate, setNewUpdate] = useState(null);
    const isMobile = useMediaQuery({ query: '(max-width: 739px)' })
    const [audio] = useState(new Audio(sound));

    useEffect(() => {
        if(!authentication?.token) {
            navigate("/signin");
        }
    } ,[authentication.token, navigate])

    useEffect(() => {
        if(authentication.token) {
            socket = io(SOCKET_API,{
                query: {token: authentication.token}
            });
            socket.on("connect", () => {
                setLoading(false);
                console.log('connected socket io')
            });
            socket.on('chat', (msg) => {
                audio.play();
                setNewUpdate({
                    type: 'message',
                    msg: msg
                });  
            })
            socket.on('join', (msg) => {
                setNewUpdate({
                    type: 'member',
                    msg: msg
                })
            })
        }
        return () => {
            if(socket?.connected) {
                socket.close();
            }
        }
    }, [authentication.token, audio])

    useEffect(() => {
        if(authentication.token) {
            const getBoxData = async (token) => {
                try {
                    const boxData = await get_all_box({token});
                    setBoxChat(boxData);
                } catch (err) {
                    alert(err);
                }
            }
            getBoxData(authentication?.token);
        }
    }, [authentication?.token])

    useDeepCompareEffect(() => {
        if(newUpdate?.type === 'message') {
            const {userId, message, boxId, user} = newUpdate.msg;
            const newBoxChat = boxChat.map((box) => {
                if(boxId === box._id) {
                    box.chat.push({
                        sendId: userId,
                        message: message, 
                        user: user,
                        isNew: true,
                    })
                }
                return box;
            });
            setBoxChat(newBoxChat);
        }  
        if(newUpdate?.type === 'member') {
            const {userId, avatar, boxId, user} = newUpdate.msg;
            const newBoxChat = boxChat.map((box) => {
                if(boxId === box._id) {
                    box.member.push({
                        id: userId,
                        avatar: avatar,
                        user: user,
                    })
                }
                return box;
            });
            setBoxChat(newBoxChat);
        }
    }, [newUpdate, boxChat])

    const joinBox = async (args) => {
        setLoading(true);
        try {  
            const box = await join_box({
                token: authentication.token,
                box: args
            })
            socket.emit("join", {
                boxId: box._id,
                user: authentication.user,
                userId: authentication.id,
                avatar: authentication?.avatar
            })
            setBoxChat([...boxChat, box]);
            navigate(box._id);
            setShowJoin(false);
        } catch (err) {
            alert(err.message);
        }
        setLoading(false);
    }


    const createBox = async (args) => {
        setLoading(true);
        try {  
            const box = await create_box({
                token: authentication?.token,
                box: args
            })
            socket.emit("join", {
                boxId: box._id,
                user: authentication.user,
                userId: authentication.id,
                avatar: authentication?.avatar
            })
            setBoxChat([...boxChat, box]);
            setShowCreate(false);
            navigate(box._id);
        } catch (err) {
            alert(err.message);
        }
        setLoading(false);
    }

    const sendChat = async ({message, boxId}) => {
        const newBoxChat = boxChat.map((box) => {
            if(boxId === box._id) {
                box.chat.push({
                    sendId: authentication?.id,
                    message: message, 
                    avatar: authentication?.avatar,
                    user: authentication?.user
                })
            }
            return box;
        });
        setBoxChat(newBoxChat);  
        try {           
            socket.emit("chat", {
                message: message,
                boxId: boxId,
                user: authentication.user
            });
            setBoxChat(newBoxChat);
            await post_chat({
                token: authentication?.token,
                boxId: boxId,
                message: message,
                user: authentication.user
            })
        } catch (err) {
            alert(err);
        }
    }

    const logOut = () => {
        removeAuth()
        setAuthentication({
            token: "",
            id: "",
            avatar: "",
            user: ""
        })
    }

    const outBox = async (boxId) => {
        try {
            const newBox = boxChat.filter((box) => box._id.toString() !== boxId);
            setBoxChat(newBox);
            await out_box({
                token: authentication?.token,
                boxId: boxId.toString()
            })
            navigate("");
        } catch (err) {
            alert(err.message)
        }
    }

    const deleteBox = async (boxId) => {
        try {
            const newBox = boxChat.filter((box) => box._id.toString() !== boxId);
            setBoxChat(newBox);
            await remove_box({
                token: authentication?.token,
                boxId: boxId.toString()
            })
            navigate("")
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <div className="home">
            {!isMobile && <AllBox authentication={authentication} 
                showCreate = {() => setShowCreate(true)} 
                showJoin = {() => setShowJoin(true)} boxChat={boxChat} onLogOut={logOut}/>}
            {showCreate && <CreateBox onSubmit={createBox} onClose={() => setShowCreate(false)}/>}
            {showJoin && <JoinBox onSubmit={joinBox} onClose={() => setShowJoin(false)}/>}
            <div className="home-box">
            <Routes>
                {!isMobile && <Route path="" element={<div className="home-chicken"> 
                    <img src={require("../../assets/image.webp").default} alt="chat"/>
                    <h5>Bấm tham gia bên góc trái để tham gia nhóm chat cùng bạn bè</h5>
                </div>} />}
                {isMobile && <Route path="" 
                    element={<AllBox authentication={authentication} showCreate = {() => setShowCreate(true)} 
                    showJoin = {() => setShowJoin(true)} boxChat={boxChat} onLogOut={logOut}/>} 
                />}
                {boxChat.map((box) => (
                    <Route key={box?._id} path={`${box?._id}/*`} element={<MessageBox userId={authentication?.id} onSend={sendChat} box={box} onOut={outBox} onDelete={deleteBox}/> } />
                ))}
            </Routes>
            </div>
            {loading && <Loading />}
        </div>
    );
}

export default Home;