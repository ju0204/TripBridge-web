import React, { useState } from 'react';
import { sendRequest } from '../../../api/filter';
import { useNavigate } from 'react-router-dom';

import './section.css';

const Section = () => {
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleAreaClick = (area) => {
    // Clear the previously selected areas
    setSelectedAreas([area]);
  };

  const handleSubmit = async () => {
    console.log('handleSubmit 함수가 호출되었습니다.');

    if (selectedAreas.length > 0) {
      try {
        navigate('/section2', { state: { selectedAreas }});
        const responseData = await sendRequest(selectedAreas);
        console.log('Success:', responseData);
      } catch (error) {
        console.error('Error while sending data:', error);
      }
    } else {
      console.log("지역을 선택해주세요.");
      setShowPopup(true);
    }
  };

  return (
    <div className="filtersection-container">
      <div className="section-container-box">
        <div className="section-box">
          <div className="section-text1">이번 여행, 어디로 가고 싶으신가요?</div>
          <div className="section-text2">여행을 떠나고 싶은 지역을 선택해주세요.</div>
                <div
                  className={`checkbox-label ${selectedAreas.includes("1") ? 'selected' : ''}`}
                  onClick={() => handleAreaClick("1")}
                >
                  서울
                </div>
                <div
                  className={`checkbox-label ${selectedAreas.includes("2") ? 'selected' : ''}`}
                  onClick={() => handleAreaClick("2")}
                >
                  인천
                </div>
                <div
                  className={`checkbox-label ${selectedAreas.includes("3") ? 'selected' : ''}`}
                  onClick={() => handleAreaClick("3")}
                >
                  대전
                </div>
                <div
                  className={`checkbox-label ${selectedAreas.includes("4") ? 'selected' : ''}`}
                  onClick={() => handleAreaClick("4")}
                >
                  대구
                </div>
                <div
                  className={`checkbox-label ${selectedAreas.includes("5") ? 'selected' : ''}`}
                  onClick={() => handleAreaClick("5")}
                >
                  광주
                </div>
                <div
                  className={`checkbox-label ${selectedAreas.includes("6") ? 'selected' : ''}`}
                  onClick={() => handleAreaClick("6")}
                >
                  부산
                </div>
                <div
                  className={`checkbox-label ${selectedAreas.includes("7") ? 'selected' : ''}`}
                  onClick={() => handleAreaClick("7")}
                >
                  울산
                </div>
                <div
                  className={`checkbox-label ${selectedAreas.includes("8") ? 'selected' : ''}`}
                  onClick={() => handleAreaClick("8")}
                >
                  세종
                </div>
                <div
                  className={`checkbox-label ${selectedAreas.includes("31") ? 'selected' : ''}`}
                  onClick={() => handleAreaClick("31")}
                >
                  경기
                </div>
                <div
                  className={`checkbox-label ${selectedAreas.includes("32") ? 'selected' : ''}`}
                  onClick={() => handleAreaClick("32")}
                >
                  강원
                </div>
                <div
                  className={`checkbox-label ${selectedAreas.includes("33") ? 'selected' : ''}`}
                  onClick={() => handleAreaClick("33")}
                >
                  충북
                </div>
                <div
                  className={`checkbox-label ${selectedAreas.includes("34") ? 'selected' : ''}`}
                  onClick={() => handleAreaClick("34")}
                >
                  충남
                </div>
                <div
                  className={`checkbox-label ${selectedAreas.includes("35") ? 'selected' : ''}`}
                  onClick={() => handleAreaClick("35")}
                >
                  경북
                </div>
                <div
                  className={`checkbox-label ${selectedAreas.includes("36") ? 'selected' : ''}`}
                  onClick={() => handleAreaClick("36")}
                >
                  경남
                </div>
                <div
                  className={`checkbox-label ${selectedAreas.includes("37") ? 'selected' : ''}`}
                  onClick={() => handleAreaClick("37")}
                >
                  전북
                </div>
                <div
                  className={`checkbox-label ${selectedAreas.includes("38") ? 'selected' : ''}`}
                  onClick={() => handleAreaClick("38")}
                >
                  전남
                </div>
                <div
                  className={`checkbox-label ${selectedAreas.includes("39") ? 'selected' : ''}`}
                  onClick={() => handleAreaClick("39")}
                >
                  제주
                </div>
          </div>
          <div className="section1-button-container">
            <button className="section1-button" type="button" onClick={handleSubmit}>다음</button>
          </div>
        </div>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>지역을 선택해주세요.</p>
            <button onClick={() => setShowPopup(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Section;
