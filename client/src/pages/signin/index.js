import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { sign_in } from '../../api/authApi';
import authContext from '../../container/authContext';
import Loading from '../../components/loading';
import { useAlert } from 'react-alert';

function SignIn(props) {
    const formRef = useRef(null);
    const {authentication, setAuthentication} = useContext(authContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const alert = useAlert();

    useEffect(() => {
        if(authentication?.token) {
            navigate("/");
        }
    }, [authentication.token, navigate])

    const handleSubmit = async (e, data) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await sign_in({user: formRef.current.user.value, password: formRef.current.password.value});
            setAuthentication({
                user: response?.user,
                token: response?.token,
                id: response?.id,
                avatar: response?.avatar
            })
            navigate("/");
        } catch (err) {
            setIsLoading(false);
            alert.show(err.message);
        }
    }

    return (
        <div className="auth">
            <div className="auth-image">
                <img src={require("../../assets/bk2.webp").default} alt="bkg" />
            </div>
            <form onSubmit={handleSubmit} ref={formRef} >
                <h4>Đăng nhập</h4>
                <input type="text" name="user" placeholder="Tên đăng nhập" required/>
                <input type="password" name="password" placeholder="Mật khẩu" required/>
                <button type='submit' >Đăng nhập</button>
                <p>Chưa có tài khoản? <Link to="/signup">Đăng kí</Link> </p>
                {isLoading && <Loading />}
            </form>
        </div>
        
    );
}

export default SignIn;