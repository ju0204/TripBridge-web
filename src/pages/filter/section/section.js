import React, { useState } from 'react';
import { sendRequest } from '../../../api/filter';
import { useNavigate } from 'react-router-dom';
import { FaArrowCircleRight } from "react-icons/fa";
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

  const renderCheckboxLabels = () => {
    const areas = [
      { id: "1", name: "서울" },
      { id: "2", name: "인천" },
      { id: "3", name: "대전" },
      { id: "4", name: "대구" },
      { id: "5", name: "광주" },
      { id: "6", name: "부산" },
      { id: "7", name: "울산" },
      { id: "8", name: "세종" },
      { id: "31", name: "경기" },
      { id: "32", name: "강원" },
      { id: "33", name: "충북" },
      { id: "34", name: "충남" },
      { id: "35", name: "경북" },
      { id: "36", name: "경남" },
      { id: "37", name: "전북" },
      { id: "38", name: "전남" },
      { id: "39", name: "제주" },
    ];

    const rows = [];
    for (let i = 0; i < areas.length; i += 6) {
      rows.push(areas.slice(i, i + 6));
    }

    return rows.map((row, index) => (
      <div key={index} className="checkbox-row">
        {row.map((area) => (
          <div
            key={area.id}
            className={`checkbox-label ${selectedAreas.includes(area.id) ? 'selected' : ''}`}
            onClick={() => handleAreaClick(area.id)}
          >
            {area.name}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="filtersection-container">
      <div className="section-container-box">
        <div className="section-box">
          <div className="section-text1">이번 여행, 어디로 가고 싶으신가요?</div>
          <div className="section-text2"><FaArrowCircleRight className='rightrow' /> 여행을 떠나고 싶은 지역을 선택해주세요.</div>
          {renderCheckboxLabels()}
            <button className="section-button" type="button" onClick={handleSubmit}>다음</button>
        </div>
      </div>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>지역이 선택되지 않았습니다.</p>
            <button onClick={() => setShowPopup(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Section;
