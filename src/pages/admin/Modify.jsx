import React , { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useJwt } from "react-jwt";
import { useCookies } from 'react-cookie'; // useCookies import
import { jwtDecode } from "jwt-decode";
import '../../css/admin/modify.css';

const Modify = () => {
    
    const [cookie, setCookie, removeCookie] =  useCookies();
    const decoded = jwtDecode(cookie.token);
    const { decodedToken, isExpired } = useJwt(cookie.token);


    // Hook
    const [aId, setAId] = useState('');
    const [aPw, setAPw] = useState('');
    const [aMail, setAMail] = useState(0);
    const [aPhone, setAPhone] = useState('');
    const navigate = useNavigate();

    useEffect(() => {

        if (!cookie.token || isExpired) {
            alert('로그인 후 확인할 수 있습니다.');
            navigate('/signin');
            return;
        }

        const fetchUserData = async () => {

            console.log(`${process.env.REACT_APP_SERVER}/admin/getadmin/${decoded.userId}`)
            try {
              const response = await axios.get(`${process.env.REACT_APP_SERVER}/admin/getadmin/${decoded.userId}`);
              const data = response.data;
              setAId(data.a_ID);
              setAPw();
              setAMail(data.a_MAIL);
              setAPhone(data.a_PHONE);

            } catch (error) {
              alert('유저 데이터를 가져오는 데 실패했습니다.');
              navigate('/')  
            } finally {

            }
          };
          if ( !isExpired ){

            fetchUserData();
          } else {
            navigate('/')
          }

    }, []);
          


    const aIdChangeHandler = (e) => {
        setAId(e.target.value);
    }

    const aPwChangeHandler = (e) => {
        setAPw(e.target.value);
    }

    const aMailChangeHandler = (e) => {
        setAMail(e.target.value);
    }

    // 하이픈 자동 입력
    const hypenPhoneNumber = (value) => {
        const cleaned = value.replace(/\D/g, ''); 
        const match = cleaned.match(/^(\d{3})(\d{3,4})(\d{4})$/);
        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
        }
        return cleaned;
    }

    const aPhoneChangeHandler = (e) => {
        const changePhoneNumber = hypenPhoneNumber(e.target.value);
        setAPhone(changePhoneNumber);
    }


    const handleSubmit = async(e) => {
        e.preventDefault();

        const formData = {
            a_id: aId,
            a_pw: aPw,
            a_mail: aMail,
            a_phone: aPhone,
        }

        try{
            const url=`${process.env.REACT_APP_SERVER}/admin/modify`;
            const res = await axios.post(url, formData);
            console.log('data---> ', res.data)
            if (res.data.a_ID !== null) {
                removeCookie('token');
                navigate('/signin');
            } else {
                alert('이미 사용중인 ID입니다.');
                navigate('/signup');
            }
   
        } catch(err){
            console.log('err---> ', err);
            // console.log(err.response.status);
        }

    }

    const deleteBtnClickHandler = () => {
        console.log('deleteBtnClickHandler()');
 
        if (window.confirm('정말로 탈퇴 하시겠습니까?')) {
         // DELETE MEMBER INFO

         axios.get(`${process.env.REACT_APP_SERVER}/admin/delete/${aId}`)
         .then(response => {
           const data = response.data;
           console.log(data);
           alert('계정 삭제가 완료되었습니다.');  // notification UI
           removeCookie('token');
           navigate('/')               // 화면 전환
           
         })
         .catch(error => {
           console.error('Error deleteing user:', error);
         });
 
 
 
 
         } else {
             alert('계정 삭제가 취소되었습니다.');  // notification UI
 
         }
     }


    return (
        <div id="sign_up_modal">
            <div className="sign_up_modal_content">
            <form onSubmit={handleSubmit}>
                <h2>회원 수정</h2>
                <input name="a_id" className="txt_basic" type="text" value={aId} onChange={aIdChangeHandler} readOnly />

                <br />
                <input name="a_pw" className="txt_basic" type="password" value={aPw} onChange={aPwChangeHandler} placeholder="비밀번호를 입력하세요" />

                <br />
                <input name="a_mail" className="txt_basic" type="text" value={aMail} onChange={aMailChangeHandler} placeholder="이메일을 입력하세요" />

                <br />
                <input name="a_phone" className="txt_basic" type="text" value={aPhone} onChange={aPhoneChangeHandler} placeholder="휴대전화번호" />

                <br />
                <button type="submit" className="btn_basic" name="modify">수정</button>
                <button onClick={deleteBtnClickHandler} className="btn_basic" >삭제</button>
                </form>
            </div>
        </div>
    );
}

export default Modify;


