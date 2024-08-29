// MyPage.js

import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './mypage.css';

function MyPage() {
  return (
    <div className="mypage">
      <nav className="sidebar">
        <div className="sidebar-title">마이 페이지</div>
        <NavLink to="/mypage/review" className="sidebar-header">나만의 동선 및 후기</NavLink>
        <NavLink to="/mypage/moreplace" className="sidebar-header">주변 장소 추천</NavLink>
      </nav>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default MyPage;
