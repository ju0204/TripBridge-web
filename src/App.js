// App.js
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import SignUp from './pages/user/signup/signup';
import Nav from './components/header/nav'
import LogIn from './pages/user/login/login';
import PasswordCheck from './pages/user/password/pwsearch';
import Main from './pages/main/main'; // 메인 페이지 컴포넌트 import

const App = () => {
  // 로그인 상태를 관리하는 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState('');

  // 로그아웃 함수
  const handleLogout = () => {
    // 로컬 스토리지에서 토큰 제거 등 로그아웃 관련 작업 수행
    localStorage.removeItem('token');
    // 로그인 상태 변경
    setIsLoggedIn(false);
    setNickname('');
  };

  return (
    <div className="App">
      <Nav isLoggedIn={isLoggedIn} nickname={nickname} onLogout={handleLogout} />
      <Routes> {/* Switch 대신에 Routes를 사용 */}
        <Route path="/" element={<Main />} /> {/* "/" 경로에 Main 컴포넌트를 연결 */}
        {/* setNickname props 추가 */}
        <Route path="/login" element={<LogIn setIsLoggedIn={setIsLoggedIn}  setNickname={setNickname} />} /> 
        <Route path="/signup" element={<SignUp />} />
        {/* 다른 페이지들의 라우팅 설정도 필요 */}
      </Routes>
    </div>
  );
};

export default App;








