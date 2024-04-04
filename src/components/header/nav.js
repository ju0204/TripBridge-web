import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './nav.css';

const Nav = ({ isLoggedIn, nickname, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setShowDropdown(false);
  };

  const handleDropdownMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleDropdownMouseLeave = () => {
    setShowDropdown(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <ul className="nav-list-1">
          <li className="nav-item"><Link className="styled-link" to="/">홈</Link></li>
          <li className="nav-item"><Link className="styled-link" to="/about">여행지 추천</Link></li>
          <li className="nav-item"><Link className="styled-link" to="/contact">동선추천</Link></li>
          <li className="nav-item" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <div className="styled-link" onMouseEnter={handleDropdownMouseEnter} onMouseLeave={handleDropdownMouseLeave}>
              게시판
            </div>
            {showDropdown && (
              <div className="dropdown-item" onMouseEnter={handleDropdownMouseEnter} onMouseLeave={handleDropdownMouseLeave}>
                <Link to="/board">여행 게시판</Link>
                <Link to="/mate-board">여행 메이트 구하기</Link>
              </div>
            )}
          </li>
          
        </ul>
        <ul className="nav-list-2">
          {!isLoggedIn && (
            <>
              <li className="auth-item"><Link className="styled-link" to="/login">로그인</Link></li>
              <li className="auth-item"><Link className="styled-link" to="/signup">회원가입</Link></li>
            </>
          )}
          {isLoggedIn && (
            <>
              <li className="nav-item">
                <div className="styled-user">{nickname}님 환영합니다.</div></li>
              <li className="nav-item"><Link className="styled-link" onClick={onLogout}>로그아웃</Link></li>
              
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Nav;



