import React from 'react';
import '../../css/include/Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <a href='/'>
          <h1>도서링크</h1> 
        </a>
      </div>
      <div className="auth">
        <a href='#none'>로그인</a>
        <a href='#none'>회원가입</a>
      </div>
    </header>
  );
};

export default Header;
