import { Link } from 'react-router-dom'; 
import React, { useState } from 'react';
import axios from 'axios';
import '../css/Navbar.css'; 

const Navbar = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLibraryUpdate = async () => {
    try {
      setLoading(true);  // 로딩 상태
      const response = await axios.post(`${process.env.REACT_APP_SERVER}/library`); // POST 요청

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
        <li className="nav-item">
          <button onClick={handleLibraryUpdate} disabled={loading}>
            {loading ? '업데이트 중...' : '도서관 업데이트'}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

