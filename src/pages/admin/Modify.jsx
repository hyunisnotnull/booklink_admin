import React , { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import DaumPostcode from 'react-daum-postcode';
import { useJwt } from "react-jwt";
import { useCookies } from 'react-cookie'; // useCookies import
import { jwtDecode } from "jwt-decode";
import '../../css/admin/modify.css';

const Modify = () => {
    
    const [cookie, setCookie, removeCookie] =  useCookies();
    const decoded = jwtDecode(cookie.token);
    const { decodedToken, isExpired } = useJwt(cookie.token);

    const [aZipcode, setAZipcode] = useState(""); // 우편번호
    const [aAddress, setAAddress] = useState(""); // //api상의 주소
    const [aDetailAddress, setADetailAddress] = useState(""); //상세 주소
    // const [detail2address, setDetail2address] = useState(""); //상세주소
    // const {addDocument, response } = useFirestore('manmul');
    const [openPostcode, setOpenPostcode] = useState(false); //카카오api

    const clickButton =() =>{
        setOpenPostcode(current => !current);
    }

    const selectAddress = (data) => {
        console.log(`
                주소: ${data.address},
                우편번호: ${data.zonecode}
            `)
            setAZipcode(data.zonecode);
            setAAddress(data.address)
            setOpenPostcode(false);
    }
    
    
  

    // Hook
    const [aId, setAId] = useState('');
    const [aPw, setAPw] = useState('');
    const [aGender, setAGender] = useState(0);
    const [aAge, setAAge] = useState(0);
    const [aPhone, setAPhone] = useState('');
    const navigate = useNavigate();

    // // 유효성 검사
    // const validateInputs = () => {
    //     const newErrors = {};
    //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;    // @가 있어야 하고 앞, 뒤로 문자가 있어야 함
    //     const pwRegex = /^.{6,}$/;                          // 6자리 이상
    //     const nickRegex = /^[가-힣a-zA-Z0-9]{2,6}$/;        // 한글, 영어 대소문자, 숫자가 2 이상 6 이하
    //     const phoneRegex = /^\d{3}-\d{4}-\d{4}$/;           // {}안에 숫자가 지정한 개수 만큼 있어야 함

    //     if (!emailRegex.test(uId)) {
    //         newErrors.uId = "올바른 이메일 주소를 입력하세요.";
    //     }

    //     if (!pwRegex.test(uPw)) {
    //         newErrors.uPw = "비밀번호는 6자 이상이어야 합니다.";
    //     }

    //     if (!nickRegex.test(uNick)) {
    //         newErrors.uNick = "닉네임은 2자 이상 6자 이하의 한u글, 영어 또는 숫자여야 합니다.";
    //     }

    //     if (!phoneRegex.test(uPhone)) {
    //         newErrors.uPhone = "전화번호는 '000-0000-0000' 형식이어야 합니다.";
    //     }
        
    //     setErrors(newErrors);
    //     return Object.keys(newErrors).length === 0;
    // }

    useEffect(() => {

        const fetchUserData = async () => {

            console.log(`${process.env.REACT_APP_SERVER}/admin/getadmin/${decoded.userId}`)
            try {
              const response = await axios.get(`${process.env.REACT_APP_SERVER}/admin/getadmin/${decoded.userId}`);
              const data = response.data;
              setAId(data.a_ID);
              setAPw();
              setAGender(data.a_SEX);
              setAAge(data.a_AGE);
              setAPhone(data.a_PHONE);
              setAZipcode(data.a_ZIPCODE);
              setAAddress(data.a_POST_ADDRESS); // //api상의 주소
              setADetailAddress(data.a_DETAIL_ADDRESS); //상세 주소

            } catch (error) {
              alert('유저 데이터를 가져오는 데 실패했습니다.');
              navigate('/')  
            } finally {

            }
          };
          if ( !isExpired ){

            console.log(decodedToken)
            fetchUserData();
          } else {
            navigate('/')
          }

    }, []);
          


    const aDetailAddressHandler = (e) => {
        setADetailAddress(e.target.value);
    }

    const aIdChangeHandler = (e) => {
        setAId(e.target.value);
    }

    const aPwChangeHandler = (e) => {
        setAPw(e.target.value);
    }

    const aGenderChangeHandler = (e) => {
        setAGender(e.target.value);
    }

    const aAgeChangeHandler = (e) => {
        setAAge(e.target.value);
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

        const formData = new FormData();
        formData.append("a_id", aId);
        formData.append("a_pw", aPw);
        formData.append("a_sex", aGender);
        formData.append("a_age", aAge);
        formData.append("a_zipcode", aZipcode);
        formData.append("a_phone", aPhone);
        formData.append("a_post_address", aAddress);
        formData.append("a_detail_address", aDetailAddress);

        try{
            const url=`${process.env.REACT_APP_SERVER}/admin/modify`;
            const res = await axios.post(url, formData);
            console.log('data---> ', res.data)
            if (res.data.u_ID !== null) {
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

    //     // 유효성 검사
    //     if (!validateInputs()) {
    //         return;
    //     }

    //     // 비밀번호 암호화
    //     const encryptedPw = encrypt(uPw);

    //     if (acMemDB === null) {
    //         let newMemObj = {
    //             [uId]: {
    //                 'uId': uId,
    //                 'uPw': encryptedPw,
    //                 'uNick': uNick,
    //                 'uGender': uGender,
    //                 'uAge': uAge,
    //                 'uPhone': uPhone,
    //                 'uPicture': uPicture,
    //             }
    //         }
    //         setAcMemDB(newMemObj);

    //     } else {
    //         let aldAcMem = JSON.parse(acMemDB);
    //         aldAcMem[uId] = {
    //             'uId': uId,
    //             'uPw': encryptedPw,
    //             'uNick': uNick,
    //             'uGender': uGender,
    //             'uAge': uAge,
    //             'uPhone': uPhone,
    //             'uPicture': uPicture,
    //         }
    //         setAcMemDB(aldAcMem);
    //     }

    //     // 찜 목록 생성
    //     let acFavDB = getAcFavDB();
    //     if (acFavDB === null) {
    //         let newFavs = {
    //             [uId]: {}
    //         }
    //         setAcFavDB(newFavs);

    //     } else {
    //         let aldAcFavDB = JSON.parse(acFavDB);
    //         aldAcFavDB[uId] = {};
    //         setAcFavDB(aldAcFavDB);
    //     }
    //     alert('회원가입이 완료되었습니다.');
        
    //     // 입력 정보 초기화
    //     setUId('');
    //     setUPw('');
    //     setUNick('');
    //     setUGender(0);
    //     setUAge(0);
    //     setUPhone('');
    //     setUPicture(profilePic);
    //     navigate('/login');
    // }

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




    const style = {
        background : "rgba(0,0,0,0.25)",
        position : "fixed",
        left:"60%",
        top:"65px",
        height:"450px",
        width:"400px",
        border: "1px solid #ccc",
}
    return (
        <div id="sign_up_modal">
            <div className="sign_up_modal_content">
            <form onSubmit={handleSubmit}>
                <h2>회원 수정</h2>
                <input name="a_id" className="txt_basic" type="text" value={aId} onChange={aIdChangeHandler} readonly />


                <br />
                <input name="a_pw" className="txt_basic" type="password" value={aPw} onChange={aPwChangeHandler} placeholder="비밀번호를 입력하세요" />

                <br />
                <input name="a_phone" className="txt_basic" type="text" value={aPhone} onChange={aPhoneChangeHandler} placeholder="휴대전화번호" />

                <select name="a_sex" className="gen" id="gen" value={aGender} onChange={aGenderChangeHandler}>
                    <option value="">성별</option>
                    <option value="M">남성</option>
                    <option value="W">여성</option>
                </select>
                <select name="a_age" id="age" value={aAge} onChange={aAgeChangeHandler}>
                    <option value="">나이</option>
                    <option value="10">10대</option>
                    <option value="20">20대</option>
                    <option value="30">30대</option>
                    <option value="40">40대</option>
                    <option value="50">50대</option>
                    <option value="60">60대 이상</option>
                </select>
                <br />
                <input type="hidden" id="user_post_address" name="a_post_address" />
                <div class="address-group">
                    <input type="text" id="user_zipcode" name="a_zipcode"  value={aZipcode} placeholder="우편번호" readonly required />
                    <input type="button" class="address-btn" onClick={clickButton} value="우편번호 찾기" /> {openPostcode &&
                        <DaumPostcode
                            style={style}
                            onComplete={selectAddress}  // 값을 선택할 경우 실행되는 이벤트
                            autoClose={false} // 값을 선택할 경우 사용되는 DOM을 제거하여 자동 닫힘 설정
                            defaultQuery='의정부 센트럴타워' // 팝업을 열때 기본적으로 입력되는 검색어
                            />
                }
                </div>
                <input className="txt_basic" type="text" id="user_address" name="a_address"  value={aAddress} placeholder="주소" required />
                <br />
                <input className="txt_basic" type="text" id="user_detailAddress" name="a_detail_address"  value={aDetailAddress} onChange={aDetailAddressHandler} placeholder="상세주소" required />
                <br />
                <br />
                <button type="submit" className="btn_basic" >수정</button>
                <button onClick={deleteBtnClickHandler} className="btn_basic" >삭제</button>
                </form>
            </div>
        </div>
    );
}

export default Modify;

