import React, { useState } from 'react';
import './login.css'; 
import { login } from '../../../api/user';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsLoggedIn, setNickname }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(''); // 추가: 오류 메시지 상태 변수
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
    setErrorMessage(''); // 추가: 입력 값이 변경되면 오류 메시지 초기화
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const userData = await login(formData);
        setIsLoggedIn(true);
        setNickname(userData.data.nickname);
        sessionStorage.setItem('accessToken', userData.data.accessToken); // Store the access token in local storage
        sessionStorage.setItem('nickname', userData.data.nickname); // Store the nickname in local storage
        console.log('로그인 성공!', userData);
        navigate('/');
      } catch (error) {
        console.error('로그인 실패:', error);
        setErrorMessage('로그인에 실패했습니다. 이메일 주소 또는 비밀번호를 확인하세요.');
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = (formData) => {
    let errors = {};

    if (!formData.email.trim()) {
      errors.email = '이메일 주소를 입력하세요.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = '유효한 이메일 주소를 입력하세요.';
    }
    if (formData.password.length < 3) {
      errors.password = '비밀번호는 최소 4자 이상이어야 합니다.';
    }

    return errors;
  };

  return (
    <div className="login-container">
      <h1 className="title">LOGIN</h1>
      <hr className="hr-login"/>
      <form className="login-form" onSubmit={handleSubmit}>
        <label className="styled-label">이메일 주소</label>
        <input
          className={`styled-input ${errors.email && 'error'}`}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.email && <span className="styled-error">{errors.email}</span>}
        <br />
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
        {errorMessage && <span className="styled-error">{errorMessage}</span>} {/* 추가: 오류 메시지 표시 */}
        <div className="styled-button-container">
          <button className="login-styled-button" type="submit">로그인</button>
        </div>
      </form>
    </div>
  );
};

export default Login;

