import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useParams, useNavigate } from 'react-router-dom';

const EventModifyForm = () => {
  // 폼 데이터를 관리할 상태 변수들
  const [title, setTitle] = useState('');
  const [eventImage, setEventImage] = useState('');
  const [url, setUrl] = useState('');
  const [eActive, setEActive] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { eventId } = useParams();  // URL 파라미터로 이벤트 ID 받기
  const navigate = useNavigate();  

  // 수정할 이벤트 데이터를 가져오기
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER}/event/modify_event_form/${eventId}`);
        const data = response.data;
        setTitle(data.e_title);
        setEventImage(data.e_image);  // 파일이 아닌 경우, 서버에서 받아온 이미지 URL
        setUrl(data.e_url);
        setEActive(data.e_active);
        setDescription(data.e_desc);
        setStartDate(data.e_start_date);
        setEndDate(data.e_end_date);
      } catch (error) {
        setError('이벤트 데이터를 가져오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId]);

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('event_image', eventImage);
    formData.append('url', url);
    formData.append('e_active', eActive);
    formData.append('description', description);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);

    try {
      // PUT 요청을 사용하여 수정된 데이터 전송
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER}/event/modify_event_confirm/${eventId}`,  // 수정 URL
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        alert('이벤트가 수정되었습니다.');
        navigate('/event/list');  // 수정 후 목록으로 리다이렉트
      }
    } catch (error) {
      console.error('Error modifying event:', error);
      alert('이벤트 수정에 실패했습니다.');
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h4>이벤트 수정</h4>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <input
            type="text"
            name="title"
            placeholder="이벤트 제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <small>이벤트의 제목을 입력하세요.</small>
        </div>
        <div>
          <input
            type="file"
            name="event_image"
            onChange={(e) => setEventImage(e.target.files[0])}
          />
          {eventImage && <img src={eventImage} alt="현재 이미지" width="100" />}
          <small>이벤트에 사용될 이미지를 선택하거나 변경하세요.</small>
        </div>
        <div>
          <input
            type="text"
            name="url"
            placeholder="이벤트 URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <small>이벤트 이동 URL을 입력하세요.</small>
        </div>
        <div>
          <select
            name="e_active"
            value={eActive}
            onChange={(e) => setEActive(e.target.value)}
            required
          >
            <option value="1">배너광고(홈)</option>
            <option value="3">자체광고(로그인/회원가입)</option>
          </select>
          <small>이벤트 사용처를 선택하세요.</small>
        </div>
        <div>
          <label>이벤트 설명</label>
          <CKEditor
            editor={ClassicEditor}
            data={description}
            onChange={(event, editor) => {
              const data = editor.getData();
              setDescription(data);  // CKEditor에서 받은 데이터를 상태에 저장
            }}
          />
          <small>이벤트에 대한 설명을 입력하세요.</small>
        </div>
        <div>
          <input
            type="datetime-local"
            name="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <small>이벤트 시작 날짜와 시간을 선택하세요.</small>
        </div>
        <div>
          <input
            type="datetime-local"
            name="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
          <small>이벤트 종료 날짜와 시간을 선택하세요.</small>
        </div>
        <button type="submit">수정하기</button>
      </form>
      <button onClick={() => navigate('/event/list')}>목록으로</button>
    </div>
  );
};

export default EventModifyForm;
