import React from 'react';
import { Link } from 'react-router-dom';
import './nav.css'; 

const Nav = ({ isLoggedIn, username, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <ul className="nav-list-1">
          <li className="nav-item"><Link className="styled-link" to="/">홈</Link></li>
          <li className="nav-item"><Link className="styled-link" to="/about">여행지 추천</Link></li>
          <li className="nav-item"><Link className="styled-link" to="/contact">동선짜기</Link></li>
          <li className="nav-item"><Link className="styled-link" to="/contact">게시판</Link></li>
          {isLoggedIn && (
            <li className="nav-item">{username}님 환영합니다.</li>
          )}
        </ul>
        <ul className="nav-list-2">
          {!isLoggedIn && (
            <>
              <li className="auth-item"><Link className="styled-link" to="/login">로그인</Link></li>
              <li className="auth-item"><Link className="styled-link" to="/signup">회원가입</Link></li>
            </>
          )}
          {isLoggedIn && (
            <li className="auth-item"><Link className="styled-link" onClick={onLogout}>로그아웃</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
