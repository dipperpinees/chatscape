import React, { useState } from 'react';
import "./styles.scss";
import Member from "../member";
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';

function GroupInfo({members, code, pass}) {
    const [showPass, setShowPass] = useState(false);
    
    const hidePassword = (password) => {
        let ans = "";
        for(let i = 0; i<password.length; i++) {
            ans+="*";
        }
        return ans;
    }

    return (
        <div className="info">
            <div>
                <h4>Thông tin nhóm chat</h4>
                <span className="info-title">Share nhóm chat</span>
                <p> Code: {code} </p>
                {pass && <p className="info-password"> Password: {showPass ? pass : hidePassword(pass)}  
                {showPass ? <RiEyeOffFill onClick={() => setShowPass(false)}/> : <RiEyeFill onClick={() => setShowPass(true)}/> }</p>}
            </div>
            <div style={{marginTop: 20}}>
                <span className="info-title">Thành viên</span>
                <ul>
                    {members?.map((member) => (
                        <Member key={member?.id} member={member}/>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default GroupInfo;