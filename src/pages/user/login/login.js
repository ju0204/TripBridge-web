// Login.js

import React, { useState } from 'react';
import './login.css'; 

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      console.log("로그인 성공!");
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
    if (formData.password.length < 6) {
      errors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
    }

    return errors;
  };

  return (
    <div className="login-container">
      <h1 className="title">로그인</h1>
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
        <br /> {/* 첫 번째 줄 바꿈 */}
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
        <div className="styled-button-container">
          <button className="styled-button" type="submit">로그인</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
