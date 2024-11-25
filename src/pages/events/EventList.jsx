import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// EventList 컴포넌트
const EventList = ({ sortOrder }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 데이터 가져오기
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_SERVER}/event/list`);
        setEvents(response.data.events);  // 서버 응답에서 'events' 배열을 가져옴
        console.log('event:::', response.data.events);
      } catch (err) {
        setError('이벤트 목록을 가져오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []); // 컴포넌트가 마운트될 때만 실행

  // 상태 변경 함수 (자체광고/홈광고 상태 변경)
  const confirmStatusChange = (event, action, isExpired) => {
    const confirmMessage = isExpired === 'true'
      ? `이 이벤트는 만료되어 상태를 변경할 수 없습니다. ${action}이 불가능합니다.`
      : `정말 ${action} 하시겠습니까?`;
    return window.confirm(confirmMessage);
  };

  // 삭제 확인
  const deleteConfirm = () => {
    return window.confirm('정말 삭제하시겠습니까?');
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="events_wrap">
      <h2>이벤트 목록</h2>
      <table>
        <thead>
          <tr>
            <th>제목</th>
            <th>이미지</th>
            <th>설명</th>
            <th>시작일</th>
            <th>종료일</th>
            <th>
              <Link to={`/event/list?sort=E_ACTIVE&order=${sortOrder === 'asc' ? 'desc' : 'asc'}`}>
                상태
              </Link>
            </th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
            {events.map((event) => {
                const endDate = new Date(event.e_end_date);  
                const isExpired = endDate < new Date();
                return (
                <tr key={event.e_no}>  
                    <td>{event.e_title}</td>  {/* 이벤트 제목 */}
                    <td>
                    <img
                        src={`/${event.e_image}`} 
                        alt={event.e_title}
                        width="100"
                    />
                    </td>
                    <td>{event.e_desc}</td>  {/* 설명 */}
                    <td>{event.e_start_date}</td>  {/* 시작일 */}
                    <td>{event.e_end_date}</td>  {/* 종료일 */}
                    <td>
                    {/* 광고 상태에 따른 구분 */}
                    {event.e_active === 3 && (
                        <form
                        action={`/event/event_status/${event.e_no}`}
                        method="POST"
                        style={{ display: 'inline' }}
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (confirmStatusChange(event, '자체광고를 비활성화', `${isExpired}`)) {
                            e.target.submit();
                            }
                        }}
                        >
                        <button type="submit">자체광고 비활성화</button>
                        </form>
                    )}
                    {event.e_active === 1 && (
                        <form
                        action={`/event/event_status/${event.e_no}`}
                        method="POST"
                        style={{ display: 'inline' }}
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (confirmStatusChange(event, '홈광고를 비활성화', `${isExpired}`)) {
                            e.target.submit();
                            }
                        }}
                        >
                        <button type="submit">홈광고 비활성화</button>
                        </form>
                    )}
                    {event.e_active === 2 && (
                        <form
                        action={`/event/event_status/${event.e_no}`}
                        method="POST"
                        style={{ display: 'inline' }}
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (confirmStatusChange(event, '홈광고를 활성화', `${isExpired}`)) {
                            e.target.submit();
                            }
                        }}
                        >
                        <button type="submit">홈광고 활성화</button>
                        </form>
                    )}
                    {event.e_active === 4 && (
                        <form
                        action={`/event/event_status/${event.e_no}`}
                        method="POST"
                        style={{ display: 'inline' }}
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (confirmStatusChange(event, '자체광고를 활성화', `${isExpired}`)) {
                            e.target.submit();
                            }
                        }}
                        >
                        <button type="submit">자체광고 활성화</button>
                        </form>
                    )}
                    </td>
                    <td>
                    <Link className="edit-link" to={`/event/modify_event_form/${event.e_no}`}>수정</Link>
                    <form
                        action="/event/delete_event_confirm"
                        name="delete_event_confirm"
                        method="POST"
                        style={{ display: 'inline' }}
                        onSubmit={(e) => {
                        e.preventDefault();
                        if (deleteConfirm()) {
                            e.target.submit();
                        }
                        }}
                    >
                        <input type="hidden" name="eventId" value={event.e_no} />
                        <button type="submit">삭제</button>
                    </form>
                    </td>
                </tr>
                );
            })}
        </tbody>
      </table>
      <Link to="/event/register_event_form">이벤트 등록</Link>
    </div>
  );
};

export default EventList;
