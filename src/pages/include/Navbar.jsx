import { Link, useNavigate } from 'react-router-dom'; 
import React, { useState, useEffect } from 'react';
import { useJwt } from "react-jwt";
import { useCookies } from 'react-cookie';
import axios from 'axios';
import '../../css/include/Navbar.css'; 

const Navbar = () => {
  const [loading, setLoading] = useState(false);
  const [cookie] =  useCookies();
  const { decodedToken, isExpired } = useJwt(cookie.token);
  const navigate = useNavigate();

  useEffect(() => {
  }, [isExpired, cookie.token, decodedToken]);

  const handleLibraryUpdate = async () => {
    if (!cookie.token || isExpired) {
      alert('로그인 후 업데이트 할 수 있습니다.');
      navigate('/signin');
      return;
    }

    try {
      setLoading(true);  // 로딩 상태
      const response = await axios.post(`${process.env.REACT_APP_SERVER}/library/JPA`); // POST 요청

      // 서버에서 응답 메시지 처리
      alert(response.data.message);

    } catch (error) {
      alert('도서관 데이터 업데이트 실패');
      console.error('Error updating library:', error);

    } finally {
      setLoading(false); // 요청 완료 후 로딩 상태 해제

    }
  };

  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li className="nav-item">
          <Link to="/stat">통계</Link>
        </li>
        <li className="nav-item">
          <Link to="/event">배너 관리</Link>
        </li>
        {!isExpired ?
        <>
        <li className="nav-item">
          <a href="#none" onClick={handleLibraryUpdate} className="update-link" disabled={loading}>
              {loading ? '업데이트 중...' : '도서관 업데이트'}
          </a>
        </li>
        </>
        :
        <>
        </>
        }
      </ul>
    </nav>
  );
};

export default Navbar;