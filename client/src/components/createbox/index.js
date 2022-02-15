import React, { useState } from 'react';


function CreateBox({onSubmit, onClose}) {
    const [name, setName] = useState(null);
    const [password, setPassword] = useState(null);
    const handleSubmit = () => {
        onSubmit({name, password});
    }

    return (
        <div className="createbox">
            <div className="overlay" onClick = {() => onClose()}></div>
            <div className="createbox-form">
                <label htmlFor="name">Tên phòng chat</label>
                <input name="name" onChange={(e) => setName(e.target.value)} type="text" required/>
                <label htmlFor="password">Mật khẩu</label>
                <input name="password" onChange={(e) => setPassword(e.target.value)} type="password" required/>
                {/* <input name="" type="text" required/> */}
                <button className="createbox-create" onClick={handleSubmit}>Tạo phòng</button>
                <button className="createbox-close" onClick = {() => onClose()}>Đóng</button>
            </div>
        </div>
    );
}

export default CreateBox;