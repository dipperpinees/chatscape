import React, { useState } from 'react';

function JoinBox({onClose, onSubmit}) {
    const [code, setCode] = useState(null);
    const [password, setPassword] = useState(null);

    const handleSubmit = () => {
        onSubmit({codeBox: code, roomPassword: password});
    }

    return (
        <div className="joinbox">
            <div className="overlay" onClick = {() => onClose()}></div>
            <div className="joinbox-form">
                <label htmlFor="codeBox">Code phòng chat</label>
                <input name="codeBox" onChange={(e) => setCode(e.target.value)} type="text" required/>
                <label htmlFor="password">Mật khẩu (nếu có)</label>
                <input name="password" onChange={(e) => setPassword(e.target.value)} type="password" required/>
                {/* <input name="" type="text" required/> */}
                <button className="createbox-create" onClick={handleSubmit}>Tham gia</button>
                <button className="createbox-close" onClick = {() => onClose()}>Đóng</button>
            </div>
        </div>
    );
}

export default JoinBox;