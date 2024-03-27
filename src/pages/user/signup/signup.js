import React, { useState } from 'react';
import './signup.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // 입력이 변경될 때마다 해당 입력란의 에러를 초기화
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      // 회원가입 로직을 실행
      console.log("회원가입 성공!");
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = (formData) => {
    let errors = {};

    // 각 입력 필드를 검증
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
    if (formData.password.length < 6) {
      errors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    return errors;
  };

  return (
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
        <br />
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
        <div className="styled-button-container">
            <button className="styled-button" type="submit">회원가입</button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
