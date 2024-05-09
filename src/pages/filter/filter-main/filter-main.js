import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import map from '../filter-img/map.png'


import './filter-main.css'; // 분리한 CSS 파일을 불러옵니다.

const Filter = ({ isLoggedIn, nickname }) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleStartClick = (event) => {
    if (!isLoggedIn) {
      // 로그인하지 않은 경우 팝업을 띄우고 이동을 막음
      event.preventDefault();
      setShowPopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="filtermain-container">
      <motion.div className="container-box" animate={{ y: -100 }}>
        <div className="filter-text">
          <p className="text-main">여행지 추천</p>
          {!isLoggedIn && (
            <>
              <p className="text-user"> 환영합니다! </p>
            </>
          )}
          {isLoggedIn && (
            <>
              <p className="text-user"> {nickname}님 환영합니다! </p>
            </>
          )}
          <p className="text-ex">원하는 여행지를 찾기 어려우신가요?<br />
            취향에 맞는 여행을 선택하고 추천받아보세요!
          </p>
        </div>
        <motion.div className="filter-box">
          <div className="img">
            <img className="map" src={map} alt="map" />
          </div>
          </motion.div>
          <div className="glassButton">
            <Link className="button-start" to='/section' onClick={handleStartClick}>start</Link>
          </div>

      </motion.div>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>로그인을 해야 합니다!</p>
            <button onClick={handleClosePopup}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;