import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useJwt } from "react-jwt";
import { jwtDecode } from "jwt-decode";
import { useCookies } from 'react-cookie';
import DOMPurify from 'dompurify';
import '../../css/events/EventList.css';
import Pagination from '../../comp/Pagination';


const EventList = ({ sortOrder }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1); 
  const [eventsPerPage] = useState(5);  // 한페이지에 표시할 이벤트 수 

  const [cookie] =  useCookies();
  const { isExpired, decodedToken } = useJwt(cookie.token);

  const navigate = useNavigate();

  useEffect(() => {
    if (!cookie.token || isExpired) {
      alert('로그인 후 확인할 수 있습니다.');
      navigate('/signin');
      return;
    }

    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_SERVER}/event/list`);
        setEvents(response.data.events);
      } catch (err) {
        setError('이벤트 목록을 가져오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleRegisterEvent = () => {
    navigate('/event/register_event_form'); 
  };

  const confirmStatusChange = (event, action, isExpired) => {
    const confirmMessage = isExpired === 'true'
      ? `이 이벤트는 만료되어 상태를 변경할 수 없습니다. ${action}이 불가능합니다.`
      : `정말 ${action} 하시겠습니까?`;
    return window.confirm(confirmMessage);
  };

  const handleStatusChange = async (eventId, newStatus) => {
    try {
      console.log('New Status:', newStatus);
      const response = await axios.put(`${process.env.REACT_APP_SERVER}/event/event_status/${eventId}`, { newStatus });
      if (response.status === 200) {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.e_no === eventId ? { ...event, e_active: newStatus } : event
          )
        );
        alert('이벤트 상태가 변경되었습니다.');
      } else {
        alert('상태 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error changing event status:', error);
      alert('상태 변경에 실패했습니다.');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        console.log('eventId:', eventId);
        const response = await axios.delete(`${process.env.REACT_APP_SERVER}/event/delete_event_confirm/${eventId}`);
        if (response.status === 200) {
          alert('이벤트가 성공적으로 삭제되었습니다.');
          setEvents((prevEvents) => prevEvents.filter((event) => event.e_no !== eventId));
        } else {
          alert('이벤트 삭제에 실패했습니다.');
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('이벤트 삭제에 실패했습니다.');
      }
    }
  };

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const totalPages = Math.ceil(events.length / eventsPerPage);

  return (
    <div className="events_wrap">
      <h2>이벤트 목록</h2>
      <table className="event-table">
        <thead>
          <tr>
            <th>제목</th>
            <th>이미지</th>
            <th>설명</th>
            <th>시작일</th>
            <th>종료일</th>
            <th>
              <Link to={`/event/list?sort=E_ACTIVE&order=${sortOrder === 'asc' ? 'desc' : 'asc'}`} className="sort-link">상태</Link>
            </th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {currentEvents.map((event) => {
            const endDate = new Date(event.e_end_date);
            const isExpired = endDate < new Date();
            const safeDesc = DOMPurify.sanitize(event.e_desc);

            return (
              <tr key={event.e_no}>
                <td>{event.e_title}</td>
                <td><img src={`${process.env.REACT_APP_IMAGE_SERVER}/${event.e_title}/${event.e_image}`} alt={event.e_title} className="event-img" /></td>
                <td dangerouslySetInnerHTML={{ __html: safeDesc }} />
                <td>{event.e_start_date}</td>
                <td>{event.e_end_date}</td>
                <td className="status-column">
                  {event.e_active === 3 && !isExpired && (
                    <button
                      onClick={() => {
                        if (confirmStatusChange(event, '자체광고를 비활성화', `${isExpired}`)) {
                          handleStatusChange(event.e_no, 4);
                        }
                      }}
                      className="status-button deactivate"
                    >
                      자체광고 비활성화
                    </button>
                  )}
                  {event.e_active === 1 && !isExpired && (
                    <button
                      onClick={() => {
                        if (confirmStatusChange(event, '홈광고를 비활성화', `${isExpired}`)) {
                          handleStatusChange(event.e_no, 2);
                        }
                      }}
                      className="status-button deactivate"
                    >
                      홈광고 비활성화
                    </button>
                  )}
                  {event.e_active === 2 && !isExpired && (
                    <button
                      onClick={() => {
                        if (confirmStatusChange(event, '홈광고를 활성화', `${isExpired}`)) {
                          handleStatusChange(event.e_no, 1);
                        }
                      }}
                      className="status-button activate"
                    >
                      홈광고 활성화
                    </button>
                  )}
                  {event.e_active === 4 && !isExpired && (
                    <button
                      onClick={() => {
                        if (confirmStatusChange(event, '자체광고를 활성화', `${isExpired}`)) {
                          handleStatusChange(event.e_no, 3);
                        }
                      }}
                      className="status-button activate"
                    >
                      자체광고 활성화
                    </button>
                  )}
                  {isExpired && (
                    <span className="expired-status">이벤트 종료됨</span>
                  )}
                </td>
                <td className="action-column">
                  <Link className="edit-link" to={`/event/modify_event_form/${event.e_no}`}>
                    <button className="action-button edit-button">수정</button>
                  </Link>
                  <button onClick={() => handleDeleteEvent(event.e_no)} className="action-button delete-button">삭제</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button className="register-button" onClick={handleRegisterEvent}>이벤트 등록</button>

      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={paginate} 
      />
    </div>
  );
};

export default EventList;
