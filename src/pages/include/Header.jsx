import React, { useEffect }  from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useJwt } from "react-jwt";
import { useCookies } from 'react-cookie'; // useCookies import
import '../../css/include/Header.css';



const Header = () => {
  
  const navigate = useNavigate(); 
  const [cookie, setCookie, removeCookie] =  useCookies();
  const { decodedToken, isExpired } = useJwt(cookie.token);
  // const decoded = jwtDecode(token);
  
  
  useEffect(() => {
  }, [isExpired, cookie.token, decodedToken, navigate]);
  
  const signOutClickHandler = (e) => {
    e.preventDefault();
    // props.setULoginId('');
    removeCookie('token');
    navigate('/');
  }

  return (
    <header className="header">
      <div className="header_wrap">
        <div className="logo">
          <a href='/'>
            <h1>도서링크</h1> 
          </a>
        </div>
        <div className="auth">
          {!isExpired ?
            <>
            <a href='/modify'>회원수정</a>
            <a href='#none' onClick={signOutClickHandler} >로그아웃</a>
            </>
            :
            <>
            <a href='/signin'>로그인</a>
            <a href='/signup'>회원가입</a>
            </>
            }
        </div>
      </div>
    </header>
  );
};

export default Header;
