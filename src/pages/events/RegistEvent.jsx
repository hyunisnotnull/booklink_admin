import React, { useState } from 'react';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useNavigate } from 'react-router-dom';

const EventRegister = () => {
  // 폼 데이터를 관리할 상태 변수들
  const [title, setTitle] = useState('');
  const [eventImage, setEventImage] = useState('');
  const [url, setUrl] = useState('');
  const [eActive, setEActive] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const navigate = useNavigate();  

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
      // 서버에 POST 요청 보내기
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER}/event/register_event_confirm`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        alert('이벤트가 등록되었습니다.');
        navigate('/event');
      }
    } catch (error) {
      console.error('Error registering event:', error);
      alert('이벤트 등록에 실패했습니다.');
    }
  };

  return (
    <div>
      <h4>이벤트 등록</h4>
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
            required
          />
          <small>이벤트에 사용될 이미지를 선택하세요.</small>
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
            <option value="">이벤트 사용처</option>
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
        <button type="submit">이벤트 등록</button>
      </form>
    </div>
  );
};

export default EventRegister;
