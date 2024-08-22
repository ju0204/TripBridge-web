import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './nav.css';

const Nav = ({ isLoggedIn, nickname, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false); // 모달 상태 추가

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

  const handleLinkClick = (path) => {
    if (!isLoggedIn) {
      setShowModal(true); // 로그인 상태가 아니면 모달 열기
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <ul className="nav-list-1">
          <li className="nav-item"><Link className="styled-trip" to="/">Trip-Bridge</Link></li>
          <li className="nav-item"><Link className="styled-link" to="/filter">여행지 추천</Link></li>
          <li className="nav-item">
            <Link className="styled-link" to="/map" onClick={() => handleLinkClick('/map')}>동선 추천</Link>
          </li>
          <li className="nav-item"><Link className="styled-link" to="/route">트레킹 코스</Link></li>
          <li className="nav-item" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <div className="styled-link" onMouseEnter={handleDropdownMouseEnter} onMouseLeave={handleDropdownMouseLeave}>
              게시판
            </div>
            {showDropdown && (
              <div className="dropdown-item" onMouseEnter={handleDropdownMouseEnter} onMouseLeave={handleDropdownMouseLeave}>
                <Link to="/tripboard">여행 게시판</Link>
                <Link to="/mateboard">메이트 게시판</Link>
              </div>
            )}
          </li>
        </ul>
        <ul className="nav-list-2">
          {!isLoggedIn && ( // Render login and signup links only if not logged in
            <>
              <li className="auth-item"><Link className="styled-link-login" to="/login">LOGIN</Link></li>
              <li className="auth-item"><Link className="styled-link-signup" to="/signup">SIGN UP</Link></li>
            </>
          )}
          {isLoggedIn && (
            <>
              <li className="nav-item">
                <div className="styled-user">{nickname}님</div>
              </li>
              <li className="nav-item"><Link className="styled-link-logout" onClick={onLogout} to="/">LOGOUT</Link></li>
            </>
          )}
        </ul>
      </div>

      {showModal && ( // 모달 표시
        <div className="login-modal">
          <div className="login-modal-content">
            <p>동선 추천은 로그인 후 이용이 가능합니다. <br/> 로그인하시겠습니까?</p>
            <button onClick={() => { setShowModal(false); window.location.href = '/login'; }}>로그인</button>
            <button onClick={() => setShowModal(false)}>취소</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
