import React, { useContext, useEffect, useRef, useState } from 'react';
import { sign_up } from '../../api/authApi';
import authContext from '../../container/authContext';
import Avatar from "../avatar";
import { FcAddImage } from "react-icons/fc";
import { useNavigate } from 'react-router';
import Loading from '../loading';
import { join_box } from '../../api/chatApi';

function SignUp(props) {
    const fileRef = useRef();
    const [avatar, setAvatar] = useState(null);
    const [isShowAvatar, setIsShowAvatar] = useState(false);
    const [userError, setUserError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [rePasswordError, setRePasswordError] = useState("");
    const formRef = useRef(null);
    const {authentication, setAuthentication } = useContext(authContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(authentication?.token) {
            navigate("/");
        }
    }, [authentication.token, navigate])

    const handleClickFile = () => {
        fileRef.current.click();
    }

    const handleChangeAvatar = () => {
        setIsShowAvatar(true);
        const file  = fileRef.current.files[0]
        const reader  = new FileReader();
    
        reader.onloadend = () => {
            setAvatar(reader.result)
        }
        if (file) {
            reader.readAsDataURL(file);
            setAvatar(reader.result)
        } 
        else {
            setAvatar("");
        }
    }

    const validator = () => {
        let check = true;
        if(formRef.current.user.value.length < 6) {
            setUserError("Tên tài khoản phải có độ dài ít nhất 6 kí tự");
            check = false;
        }
        if(formRef.current.password.value.length < 6) {
            setPasswordError("Mật khẩu phải có độ dài ít nhất 6 kí tự");
            check = false;
        }
        if(formRef.current.repassword.value !== formRef.current.password.value) {
            setRePasswordError("Mật khẩu không trùng khớp");
            check = false;
        }
        return check;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if(validator()) {
            try {
                const form = new FormData();
                form.append('avatar', formRef.current.avatar.files[0]);
                form.append('user', formRef.current.user.value);
                form.append('password', formRef.current.password.value)
                const response = await sign_up(form);
                setAuthentication({
                    user: response?.user,
                    token: response?.token,
                    id: response?.id,
                    avatar: response?.avatar || ""
                })
                await join_box({
                    token: response?.token,
                    box: {codeBox: 100000}
                })
                setIsLoading(false);
                navigate("/");
            } catch (err) {
                alert(err.message);
                setIsLoading(false);
            }
        }
    }

    return (
        <div className="auth">
            <div className="auth-image">
                <img src={require("../../assets/bk1.webp").default} alt="bkg" />
            </div>
            <form onSubmit={handleSubmit} ref={formRef}>
                <h4>Đăng kí</h4>
                <input name="user" onChange={() => setUserError("")} type="text" placeholder="Tên đăng nhập" required/>
                <span className="error">{userError}</span>
                <input name="password" type="password" onChange={() => setPasswordError("")} placeholder="Mật khẩu" required/>
                <span className="error">{passwordError}</span>
                <input name="repassword" onChange={() => setRePasswordError("")} type="password" placeholder="Nhập lại mật khẩu" required/>
                <span className="error">{rePasswordError}</span>
                <div className="auth__avatar" onClick={handleClickFile}>
                    <span>Avatar <FcAddImage /></span>
                    {isShowAvatar && <Avatar src={avatar} height={40} width={40} type="circle"/>}
                </div>
                <input type="file" name="avatar" placeholder="Avatar" onChange={handleChangeAvatar} style={{display: "none"}} ref={fileRef}/>
                <button type='submit'>Đăng kí</button>
            </form>
            {isLoading && <Loading />}
        </div>
    );
}

export default SignUp;