import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../../css/admin/signup.css';

const Signup = () => {

    // Hook
    const [aId, setAId] = useState('');
    const [aPw, setAPw] = useState('');
    const [aMail, setAMail] = useState('');
    const [aPhone, setAPhone] = useState('');
    const navigate = useNavigate();

    const aIdChangeHandler = (e) => {
        setAId(e.target.value);
    }

    const aPwChangeHandler = (e) => {
        setAPw(e.target.value);
    }

    const aMailChangeHandler = (e) => {
        setAMail(e.target.value);
    }

    // 하이픈 자동 입력
    const hypenPhoneNumber = (value) => {
        const cleaned = value.replace(/\D/g, ''); 
        const match = cleaned.match(/^(\d{3})(\d{3,4})(\d{4})$/);
        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
        }
        return cleaned;
    }

    const aPhoneChangeHandler = (e) => {
        const changePhoneNumber = hypenPhoneNumber(e.target.value);
        setAPhone(changePhoneNumber);
    }


    const handleSubmit = async(e) => {
        e.preventDefault();

        const data = {
            a_id : aId,
            a_pw : aPw,
            a_mail : aMail,
            a_phone : aPhone,
        };
        

        try{
            const url=`${process.env.REACT_APP_SERVER}/admin/signup`;
            const res = await axios.post(url, data);
            console.log('data---> ', res.data)
            if (res.data.a_ID !== null) {
                navigate('/signin');
            } else {
                alert('이미 사용중인 ID입니다.');
                navigate('/signup');
            }
   
        } catch(err){
            console.log('err---> ', err);
        }

    }


    return (
        <div id="sign_up_modal">
            <div className="sign_up_modal_content">
            <form className='sign_up_form' onSubmit={handleSubmit}>
                <h2>회원 가입</h2>
                <input name="a_id" className="txt_basic" type="text" value={aId} onChange={aIdChangeHandler} placeholder="아이디 입력하세요" />

                <br />
                <input name="a_pw" className="txt_basic" type="password" value={aPw} onChange={aPwChangeHandler} placeholder="비밀번호를 입력하세요" />

                <br />
                <input name="a_mail" className="txt_basic" type="text" value={aMail} onChange={aMailChangeHandler} placeholder="이메일을 입력하세요" />

                <br />
                <input name="a_phone" className="txt_basic" type="text" value={aPhone} onChange={aPhoneChangeHandler} placeholder="휴대전화번호" />

                <br />
                <button type="submit" className="btn_basic" name="signup">회원 가입</button>
                </form>
            </div>
        </div>
    );
}

export default Signup;


