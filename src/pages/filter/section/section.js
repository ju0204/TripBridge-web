import React, { useState } from 'react';
import { FaCheck } from "react-icons/fa";
import { motion } from "framer-motion";
// import { sendSelectedArea } from '../../../api/filter';
import { sendRequest } from '../../../api/filter';
import { useNavigate } from 'react-router-dom';

import Bag  from './img/bag.png';
import './section.css';

const Section = () => {
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate(); // useHistory 대신 useNavigate 사용


  const handleAreaClick = (area) => {
    // const isSelected = selectedAreas.includes(area);
    // if (isSelected) {
    //   // 이미 선택된 지역을 클릭하면 선택을 취소합니다.
    //   setSelectedAreas(selectedAreas.filter(item => item !== area));
    // } else {
    //   // 이미 선택된 지역이 아니면 선택합니다.
    //   setSelectedAreas([...selectedAreas, area]);
    // }
    setSelectedAreas([area]);
  };
  
  


const handleSubmit = async () => {
  console.log('handleSubmit 함수가 호출되었습니다.');

  if (selectedAreas.length > 0) {
    try {
      navigate('/section2', { state: { selectedAreas }});
      // sendSelectedArea 함수를 호출하여 요청을 보냅니다.
      const responseData = await sendRequest(selectedAreas);
      console.log('Success:', responseData); // 응답 데이터를 콘솔에 출력합니다.
      // 선택된 지역이 있을 때만 다음 작업을 수행합니다.
      // 예를 들어, 다음 페이지로 이동할 수 있습니다.
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
      <motion.div className="section-container-box" animate={{ y: -100 }}>
        <div className="section-box">
          <div className="section-text-box">
            <div className="section-icon-div"><img className="section-icon" src={Bag} /><hr className="hr"/></div>
            <p className="section-text1">이번 여행, 어디로 가고 싶으신가요?</p>
            <p className="section-text2">여행을 떠나고 싶은 지역을 선택해주세요.</p>
          </div>

          <div className="select-area">
            <ul>
              <li>
                <input
                  className="checkbox-input"
                  type="checkbox"
                  id="area1"
                  checked={selectedAreas.includes("1")}
                  onChange={() => handleAreaClick("1")}
                />
                <label className={`checkbox-label ${selectedAreas.includes("1") ? 'selected' : ''}`} htmlFor="area1">
                  서울
                  <div className="icon-wrapper">
                    {selectedAreas.includes("1") && (
                      <FaCheck  className="icon" />
                    )}
                  </div>
                </label>
                <input
                  className="checkbox-input"
                  type="checkbox"
                  id="area2"
                  checked={selectedAreas.includes("2")}
                  onChange={() => handleAreaClick("2")}
                />
                <label className={`checkbox-label ${selectedAreas.includes("2") ? 'selected' : ''}`} htmlFor="area2">
                  인천
                  <div className="icon-wrapper">
                    {selectedAreas.includes("2") && (
                      <FaCheck  className="icon" />
                    )}
                  </div>
                </label>
                <input
                  className="checkbox-input"
                  type="checkbox"
                  id="area3"
                  checked={selectedAreas.includes("3")}
                  onChange={() => handleAreaClick("3")}
                />
                <label className={`checkbox-label ${selectedAreas.includes("3") ? 'selected' : ''}`} htmlFor="area3">
                  대전
                  <div className="icon-wrapper">
                    {selectedAreas.includes("3") && (
                      <FaCheck  className="icon" />
                    )}
                  </div>
                </label>
                <input
                  className="checkbox-input"
                  type="checkbox"
                  id="area4"
                  checked={selectedAreas.includes("4")}
                  onChange={() => handleAreaClick("4")}
                />
                <label className={`checkbox-label ${selectedAreas.includes("4") ? 'selected' : ''}`} htmlFor="area4">
                  대구
                  <div className="icon-wrapper">
                    {selectedAreas.includes("4") && (
                      <FaCheck  className="icon" />
                    )}
                  </div>
                </label>
                <input
                  className="checkbox-input"
                  type="checkbox"
                  id="area5"
                  checked={selectedAreas.includes("5")}
                  onChange={() => handleAreaClick("5")}
                />
                <label className={`checkbox-label ${selectedAreas.includes("5") ? 'selected' : ''}`} htmlFor="area5">
                  광주
                  <div className="icon-wrapper">
                    {selectedAreas.includes("5") && (
                      <FaCheck  className="icon" />
                    )}
                  </div>
                </label>
                <input
                  className="checkbox-input"
                  type="checkbox"
                  id="area6"
                  checked={selectedAreas.includes("6")}
                  onChange={() => handleAreaClick("6")}
                />
                <label className={`checkbox-label ${selectedAreas.includes("6") ? 'selected' : ''}`} htmlFor="area6">
                  부산
                  <div className="icon-wrapper">
                    {selectedAreas.includes("6") && (
                      <FaCheck  className="icon" />
                    )}
                  </div>
                </label>
                <input
                  className="checkbox-input"
                  type="checkbox"
                  id="area7"
                  checked={selectedAreas.includes("7")}
                  onChange={() => handleAreaClick("7")}
                />
                <label className={`checkbox-label ${selectedAreas.includes("7") ? 'selected' : ''}`} htmlFor="area7">
                  울산
                  <div className="icon-wrapper">
                    {selectedAreas.includes("7") && (
                      <FaCheck  className="icon" />
                    )}
                  </div>
                </label>
                <input
                  className="checkbox-input"
                  type="checkbox"
                  id="area8"
                  checked={selectedAreas.includes("8")}
                  onChange={() => handleAreaClick("8")}
                />
                <label className={`checkbox-label ${selectedAreas.includes("8") ? 'selected' : ''}`} htmlFor="area8">
                  세종
                  <div className="icon-wrapper">
                    {selectedAreas.includes("8") && (
                      <FaCheck  className="icon" />
                    )}
                  </div>
                </label>
                <input
                  className="checkbox-input"
                  type="checkbox"
                  id="area31"
                  checked={selectedAreas.includes("31")}
                  onChange={() => handleAreaClick("31")}
                />
                <label className={`checkbox-label ${selectedAreas.includes("31") ? 'selected' : ''}`} htmlFor="area31">
                  경기
                  <div className="icon-wrapper">
                    {selectedAreas.includes("31") && (
                      <FaCheck  className="icon" />
                    )}
                  </div>
                </label>
                <input
                  className="checkbox-input"
                  type="checkbox"
                  id="area32"
                  checked={selectedAreas.includes("32")}
                  onChange={() => handleAreaClick("32")}
                />
                <label className={`checkbox-label ${selectedAreas.includes("32") ? 'selected' : ''}`} htmlFor="area32">
                  강원도
                  <div className="icon-wrapper">
                    {selectedAreas.includes("32") && (
                      <FaCheck  className="icon" />
                    )}
                  </div>
                </label>
                <input
                  className="checkbox-input"
                  type="checkbox"
                  id="area33"
                  checked={selectedAreas.includes("33")}
                  onChange={() => handleAreaClick("33")}
                />
                <label className={`checkbox-label ${selectedAreas.includes("33") ? 'selected' : ''}`} htmlFor="area33">
                  충청북도
                  <div className="icon-wrapper">
                    {selectedAreas.includes("33") && (
                      <FaCheck  className="icon" />
                    )}
                  </div>
                </label>
                <input
                  className="checkbox-input"
                  type="checkbox"
                  id="area34"
                  checked={selectedAreas.includes("34")}
                  onChange={() => handleAreaClick("34")}
                />
                <label className={`checkbox-label ${selectedAreas.includes("34") ? 'selected' : ''}`} htmlFor="area34">
                  충청남도
                  <div className="icon-wrapper">
                    {selectedAreas.includes("34") && (
                      <FaCheck  className="icon" />
                    )}
                  </div>
                </label>
                <input
                  className="checkbox-input"
                  type="checkbox"
                  id="area35"
                  checked={selectedAreas.includes("35")}
                  onChange={() => handleAreaClick("35")}
                />
                <label className={`checkbox-label ${selectedAreas.includes("35") ? 'selected' : ''}`} htmlFor="area35">
                  경상북도
                  <div className="icon-wrapper">
                    {selectedAreas.includes("35") && (
                      <FaCheck  className="icon" />
                    )}
                  </div>
                </label>
                <input
                  className="checkbox-input"
                  type="checkbox"
                  id="area36"
                  checked={selectedAreas.includes("36")}
                  onChange={() => handleAreaClick("36")}
                />
                <label className={`checkbox-label ${selectedAreas.includes("36") ? 'selected' : ''}`} htmlFor="area36">
                  경상남도
                  <div className="icon-wrapper">
                    {selectedAreas.includes("36") && (
                      <FaCheck  className="icon" />
                    )}
                  </div>
                </label>
                <input
                  className="checkbox-input"
                  type="checkbox"
                  id="area37"
                  checked={selectedAreas.includes("37")}
                  onChange={() => handleAreaClick("37")}
                />
                <label className={`checkbox-label ${selectedAreas.includes("37") ? 'selected' : ''}`} htmlFor="area37">
                  전북
                  <div className="icon-wrapper">
                    {selectedAreas.includes("37") && (
                      <FaCheck  className="icon" />
                    )}
                  </div>
                </label>
                <input
                  className="checkbox-input"
                  type="checkbox"
                  id="area38"
                  checked={selectedAreas.includes("38")}
                  onChange={() => handleAreaClick("38")}
                />
                <label className={`checkbox-label ${selectedAreas.includes("38") ? 'selected' : ''}`} htmlFor="area38">
                  전남
                  <div className="icon-wrapper">
                    {selectedAreas.includes("38") && (
                      <FaCheck  className="icon" />
                    )}
                  </div>
                </label>
                <input
                  className="checkbox-input"
                  type="checkbox"
                  id="area39"
                  checked={selectedAreas.includes("39")}
                  onChange={() => handleAreaClick("39")}
                />
                <label className={`checkbox-label ${selectedAreas.includes("39") ? 'selected' : ''}`} htmlFor="area39">
                  제주
                  <div className="icon-wrapper">
                    {selectedAreas.includes("39") && (
                      <FaCheck  className="icon" />
                    )}
                  </div>
                </label>

                
              </li>
              {/* <li>
                <input
                  className="checkbox-input"
                  type="checkbox"
                  id="area7"
                  checked={selectedAreas.includes("울산")}
                  onChange={() => handleAreaClick("울산")}
                />
                <label className={`checkbox-label ${selectedAreas.includes("울산") ? 'selected' : ''}`} htmlFor="area7">
                  울산
                  <div className="icon-wrapper">
                    {selectedAreas.includes("울산") && (
                      <FaCheck  className="icon" />
                    )}
                  </div>
                </label>
              </li> */}


              {/* 다른 지역에 대한 라벨 및 입력란을 여기에 추가할 수 있습니다. */}
            </ul>
          </div>

          <div className="section-button-container">
            <button className="section-button" type="button" onClick={handleSubmit}>다음</button>
          </div>
        </div>
      </motion.div>
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