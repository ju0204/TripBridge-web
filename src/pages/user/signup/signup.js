
import React, { useState } from 'react';
import './signup.css';
import { signup } from '../../../api/user';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    
    // Check if both checkboxes are selected
    const checkboxes = document.querySelectorAll('.required');
    const checked = Array.from(checkboxes).every(checkbox => checkbox.checked);
    
    if (Object.keys(validationErrors).length === 0 && checked) {
      try {
        const response = await signup({
          name: formData.name,
          nickname: formData.nickname,
          email: formData.email,
          password: formData.password,
          pw_check: formData.confirmPassword,
          alarm: '1',
          alarm2: '1'
        });
        console.log('회원가입 성공:', response);
        navigate('/login');
      } catch (error) {
        console.error('회원가입 실패:', error);
      }
    } else {
      setErrors(validationErrors);
      // Scroll to the checkbox section to make it visible
      document.querySelector('.agreement-label').scrollIntoView({ behavior: 'smooth' });
      // Check if both checkboxes are not selected
      if (!checked) {
        setErrors(prevErrors => ({
          ...prevErrors,
          confirmCheckbox: '약관에 동의해야 합니다.'
        }));
      }
    }
  };

  const validateForm = (formData) => {
    let errors = {};

    if (!formData.name.trim()) {
      errors.name = '이름을 입력하세요.';
    }
    if (!formData.nickname.trim()) {
      errors.nickname = '닉네임을 입력하세요.';
    }
    if (!formData.email.trim()) {
      errors.email = '이메일 주소를 입력하세요.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = '유효한 이메일 주소를 입력하세요.';
    }
    if (formData.password.length < 4) {
      errors.password = '비밀번호는 최소 4자 이상이어야 합니다.';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    return errors;
  };

  

  return (
    <div className="sign-up-page">
      <div className="sign-up-container">
        <h1 className="title">회원가입</h1>
        <form className="sign-up-form" onSubmit={handleSubmit}>
          <label className="styled-label">이름</label>
          <input
          className={`styled-input ${errors.name && 'error'}`}
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          />
          {errors.name && <span className="styled-error">{errors.name}</span>}
          <label className="styled-label">닉네임</label>
          <input
          className={`styled-input ${errors.nickname && 'error'}`}
          type="text"
          name="nickname"
          value={formData.nickname}
          onChange={handleChange}
          required
          />
          {errors.nickname && <span className="styled-error">{errors.nickname}</span>}
          <label className="styled-label">이메일 주소</label>
        
          <input
            className={`styled-input ${errors.email && 'error'}`}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          {errors.email && <span className="styled-error-email">{errors.email}</span>}

          <label className="styled-label">비밀번호</label>
          <input
          className={`styled-input ${errors.password && 'error'}`}
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          />
          {errors.password && <span className="styled-error">{errors.password}</span>}
        
          <label className="styled-label">비밀번호 확인</label>
          <input
          className={`styled-input ${errors.confirmPassword && 'error'}`}
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          />
          {errors.confirmPassword && <span className="styled-error">{errors.confirmPassword}</span>}
        
          <br/>
          <br/>

          
          {/* 약관동의 추가 */}
          <label className="agreement-label">약관 동의</label>
          <div class="contents">
            <ul class="terms__list">
              <li class="terms__box">
              <div class="input__check">
                <input type="checkbox" class="required"/>
                <label for="termsOfService">Trip Bridge 이용약관 동의</label>
              </div>
              <div class="terms__content">
                여러분을 환영합니다. Trip Bridge 서비스 및 제품(이하 ‘서비스’)을 이용해
                주셔서 감사합니다. 본 약관은 다양한 JUN 서비스의 이용과 관련하여
                Trip Bridge 서비스를 제공하는 Trip Bridge 주식회사(이하 ‘Trip Bridge’)와 이를 이용하는
                Trip Bridge 서비스 회원(이하 ‘회원’) 또는 비회원과의 관계를 설명하며,
                아울러 여러분의 Trip Bridge 서비스 이용에 도움이 될 수 있는 유익한
                정보를 포함하고 있습니다. Trip Bridge 서비스를 이용하시거나 Trip Bridge 서비스
                회원으로 가입하실 경우 여러분은 본 약관 및 관련 운영 정책을
                확인하거나 동의하게 되므로, 잠시 시간을 내시어 주의 깊게 살펴봐
                주시기 바랍니다.
              </div>
              </li>
              <li class="terms__box">
              <div class="input__check">
                <input type="checkbox" class="required"/>
               <label for="termsOfService">개인정보 수집 및 이용 동의</label>
               </div>
              <div class="terms__content">
                개인정보보호법에 따라 Trip Bridge에 회원가입 신청하시는 분께 수집하는
                개인정보의 항목, 개인정보의 수집 및 이용목적, 개인정보의 보유 및
                이용기간, 동의 거부권 및 동의 거부 시 불이익에 관한 사항을 안내
                드리오니 자세히 읽은 후 동의하여 주시기 바랍니다.
                1. 수집하는 개인정보 이용자는 회원가입을 하지 않아도 정보 검색, 뉴스 보기 등
                대부분의 네이버 서비스를 회원과 동일하게 이용할 수 있습니다.
                2. 이용자가 메일, 캘린더, 카페, 블로그 등과 같이 개인화 혹은 회원제
                서비스를 이용하기 위해 회원가입을 할 경우, 네이버는 서비스
                이용을 위해 필요한 최소한의 개인정보를 수집합니다.
              </div>
            </li>
          </ul>
        </div>

        {/* Checkbox error message */}
        {errors.confirmCheckbox && <span className="styled-error-agree">약관에 동의해야 합니다.</span>}


        <div className="styled-button-container">
            <button className="styled-button" type="submit">회원가입</button>
        </div>
      </form>
    
      </div>
    </div>
  );
};

export default SignUp;



