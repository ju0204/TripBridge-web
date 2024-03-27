import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import SignUp from './pages/user/signup/signup';
import Nav from './components/header/nav'
import LogIn from './pages/user/login/login';
import PasswordCheck from './pages/user/password/pwsearch';
import Main from './pages/main/main'; // 메인 페이지 컴포넌트 import

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 로그아웃 처리 함수
  const handleLogout = () => {
    // 여기에 로그아웃 처리 로직을 작성합니다.
    setIsLoggedIn(false); // 예시로 상태만 변경하는 코드를 작성
  };

  return (
    <div className="App">
      <Nav isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes> {/* Switch 대신에 Routes를 사용 */}
        <Route path="/" element={<Main />} /> {/* "/" 경로에 Main 컴포넌트를 연결 */}
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        {/* 다른 페이지들의 라우팅 설정도 필요 */}
      </Routes>
    </div>
  );
};

export default App;