import React , { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie'; // useCookies import
import { useNavigate } from "react-router-dom";
import '../../css/admin/signin.css';
import { useJwt } from "react-jwt";


const Signin = () => {
  // const [uLoginId, setULoginId] = useState('');
  const [aId, setAId] = useState('');
  const [aPw, setAPw] = useState('');
  const [cookie, setCookie] =  useCookies();
  const navigate = useNavigate(); 

  const aIdChangeHandler = (e) => {
    setAId(e.target.value);
  }

  const aPwChangeHandler = (e) => {
      setAPw(e.target.value);
  }

  const handleSubmit = async(e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("a_id", aId);
    formData.append("a_pw", aPw);
    
    try{
        const url=`${process.env.REACT_APP_SERVER}/signin`;
        const res = await axios.post(url, formData, { withCredentials: true });
        if (res.data.userId !== undefined) {
          navigate('/');
        } else {

          alert('입력 데이터 오류!!')
          navigate('/signin');
        }

    } catch(err){
      navigate('/signin');
    }

}

const googleLogin = (e) => {
  e.preventDefault();
  // 구글 로그인 화면으로 이동시키기
window.location.href = `https://accounts.google.com/o/oauth2/auth?
client_id=${process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID}
&redirect_uri=${process.env.REACT_APP_GOOGLE_AUTH_REDIRECT_URI}
&response_type=code
&scope=email profile`;
};


  return (
    <>
    <div id="sign_in_modal">
    <h2>로그인</h2>
    <form onSubmit={handleSubmit}>
      <input type="text" name="u_id"  className="txt_basic" value={aId} onChange={aIdChangeHandler} placeholder="아이디 입력하세요" /> 
      <br />
      <input name="u_pw" className="txt_basic" type="password" value={aPw} onChange={aPwChangeHandler} placeholder="비밀번호를 입력하세요" />
      <br />
      <button type="submit" className="btn_basic" >로그인</button>
      <button className="btn_basic" onClick={googleLogin} >Google</button>
    </form>
    </div>
    </>
  );
};

export default Signin;