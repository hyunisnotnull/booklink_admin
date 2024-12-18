import React, { useEffect }  from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
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
          <Link to='/'>
            <h1>도서링크</h1> 
          </Link>
        </div>
        <div className="auth">
          {!isExpired ?
            <>
            <Link to='/modify'>회원수정</Link>
            <Link to='#none' onClick={signOutClickHandler} >로그아웃</Link>
            </>
            :
            <>
            <Link to='/signin'>로그인</Link>
            <Link to='/signup'>회원가입</Link>
            </>
            }
        </div>
      </div>
    </header>
  );
};

export default Header;
