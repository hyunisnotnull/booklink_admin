import React , { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie'; // useCookies import
import { useNavigate } from "react-router-dom";
import '../../css/admin/signin.css';
import { useJwt } from "react-jwt";
import Modal from '../include/modal';


const Signin = () => {
  const [aId, setAId] = useState('');
  const [aPw, setAPw] = useState('');
  const [cookie, setCookie] =  useCookies();
  const navigate = useNavigate(); 
  const [idModalOpen, setIdModalOpen] = useState(false);
  const [pwModalOpen, setPwModalOpen] = useState(false);
  const [aPhone, setAPhone] = useState('');
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  const openIdModal = () => {
    setIdModalOpen(true);
  };
  const closeIdModal = () => {
    setId('');
    setAPhone('');
    setIdModalOpen(false);
  };

  const openPwModal = () => {
    setPwModalOpen(true);
  };
  const closePwModal = () => {
    setId('');
    setAPhone('');
    setPw('');
    setPwModalOpen(false);
  };

  
  // 하이픈 자동 입력
  const hypenPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, ''); 
    const match = cleaned.match(/^(\d{3})(\d{3,4})(\d{4})$/);
    if (match) {
        return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return cleaned;
  }

  const idChangeHandler = (e) => {
    setId(e.target.value);
  }
  
  const aPhoneChangeHandler = (e) => {
      const changePhoneNumber = hypenPhoneNumber(e.target.value);
      setAPhone(changePhoneNumber);
  }

  const aIdChangeHandler = (e) => {
    setAId(e.target.value);
  }
  
  const aPwChangeHandler = (e) => {
    setAPw(e.target.value);
  }

  const handleSearchId = async(e) => {
    e.preventDefault();

    const data = {
      a_phone : aPhone,
    };
    
    try{
        const url=`${process.env.REACT_APP_SERVER}/admin/getid`;
        const res = await axios.post(url, data, { withCredentials: true });
        
        if (res.data.a_ID) {
          setId(res.data.a_ID);
        } else {

          alert('일치하는 데이터가 없습니다.')
          navigate('/signin');
        }

    } catch(err){
      navigate('/signin');
    }

  }

  const handleSearchPw = async(e) => {
    e.preventDefault();

    const data = {
      a_id: id,
      a_phone : aPhone,
    };
    
    try{
        const url=`${process.env.REACT_APP_SERVER}/admin/getpw`;
        const res = await axios.post(url, data, { withCredentials: true });
      
        if (res.data.success) {
          setPw(res.data.message);
        } else {

          alert('일치하는 데이터가 없습니다.')
          navigate('/signin');
        }

    } catch(err){
      navigate('/signin');
    }

  }



  const handleSubmit = async(e) => {
    e.preventDefault();
    


    const data = {
      u_id : aId,
      u_pw : aPw,
    };
    
    try{
        const url=`${process.env.REACT_APP_SERVER}/signinAdmin`;
        const res = await axios.post(url, data, { withCredentials: true });
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

  return (
    <>
    
    <div id="sign_in_modal">
    <h2>로그인</h2>
    <div className="sign_in_form">
      <input type="text" name="u_id"  className="txt_basic" value={aId} onChange={aIdChangeHandler} placeholder="아이디 입력하세요" /> 
      <br />
      <input name="u_pw" className="txt_basic" type="password" value={aPw} onChange={aPwChangeHandler} placeholder="비밀번호를 입력하세요" />
      <br />
      <button type="submit" className="btn_basic"  onClick={handleSubmit}>로그인</button>
    

      <button name="searchid" className="btn_basic" onClick={openIdModal}>ID 찾기</button>
      <Modal open={idModalOpen} close={closeIdModal} header="ID 찾기">
      <input name="phone" type="text" className="txt_basic" value={aPhone} onChange={aPhoneChangeHandler} placeholder="전화번호를 입력하세요" />
      <button className="btn_basic" onClick={handleSearchId}>찾기</button>
      <input type="text" name="id_idsearch" value={id} className="txt_basic" />
      </Modal>
      <button name="searchpw" className="btn_basic" onClick={openPwModal}>PW 찾기</button>
      <Modal open={pwModalOpen} close={closePwModal} header="PW 찾기">
      <input name="id" type="text" className="txt_basic" value={id} onChange={idChangeHandler} placeholder="아이디를 입력하세요" />
      <input name="phone" type="text" className="txt_basic" value={aPhone} onChange={aPhoneChangeHandler} placeholder="전화번호를 입력하세요" />
      <button className="btn_basic" onClick={handleSearchPw}>찾기</button>
      <input type="text" name="pw_pwsearch" value={pw} className="txt_basic" />
      </Modal>
      </div>
    </div>
    
    </>
  );
};

export default Signin;
