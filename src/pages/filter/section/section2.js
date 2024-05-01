// 필요한 모듈 import
import React, { useState } from 'react';
import { motion } from "framer-motion";
// import { sendSelectedData } from '../../../api/filter'; // 변경된 import 경로
import { sendRequest } from '../../../api/filter';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import './section2.css';

// Section 컴포넌트 정의
const Section2 = ( ) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTourType, setSelectedTourType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryMiddle, setSelectedCategoryMiddle] = useState([]);
  const [selectedCategoryThird, setSelectedCategoryThird] = useState([]);
  
  const navigate = useNavigate();

  const location = useLocation();
  const { selectedAreas } = location.state;



  // 관광 타입 클릭 이벤트 핸들러
  const handleTourTypeClick = (tourType) => {
    if (selectedTourType === tourType) {
      setSelectedTourType(null);
      setSelectedCategory(null);
      setSelectedCategoryMiddle([]); // 새로운 관광타입을 선택하면 중분류도 초기화
      setSelectedCategoryThird([]);
    } else {
      setSelectedTourType(tourType);
      setSelectedCategory(null); // 새로운 관광타입을 선택하면 대분류 초기화
      setSelectedCategoryMiddle([]); // 새로운 관광타입을 선택하면 중분류도 초기화
      setSelectedCategoryThird([]);
    }
  };

  // 대분류 클릭 이벤트 핸들러
  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category); // Toggle the selection status of the category
  };

  // 중분류 클릭 이벤트 핸들러
  // 중분류 클릭 이벤트 핸들러
const handleCategoryMiddleClick = (categoryMiddle) => {
  // 중복 선택을 허용하지 않도록 변경
  setSelectedCategoryMiddle([categoryMiddle]);
};

// 소분류 클릭 이벤트 핸들러
const handleCategoryThirdClick = (categoryThird) => {
  setSelectedCategoryThird(prevState => { // 이전 상태값을 prevState로 받음
    if (prevState.includes(categoryThird)) {
      // 이미 선택된 경우 해당 항목을 제거
      return prevState.filter(item => item !== categoryThird);
    } else {
      // 선택되지 않은 경우 해당 항목을 추가
      return [...prevState, categoryThird];
    }
  });
};


  // 결과 보기 버튼 클릭 이벤트 핸들러
  const handleSubmit = async () => {
    if (selectedTourType) {
      try {
        // sendRequest 함수를 사용하여 데이터를 보냅니다.
        const responseData = await sendRequest(selectedAreas, selectedTourType, selectedCategory, selectedCategoryMiddle,selectedCategoryThird);
        console.log('Success:', responseData);
        navigate('/result', { state: { selectedAreas, selectedTourType, selectedCategory, selectedCategoryMiddle,selectedCategoryThird }});
        // 나머지 코드 생략
      } catch (error) {
        console.error('Error while sending data:', error);
      }
    } else {
      console.log("Please select tour type.");
      setShowPopup(true);
    }
  };



  // JSX 반환
  return (
    <div className="filtersection-container">
      <motion.div className="section-container-box" animate={{ y: -100 }}>
        <div className="section-box">
          <div className="section-text-box">
            <p className="section-text">원하는 여행지 타입을 선택해보세요!</p>
          </div>

          <div className="select-area">
            <ul>
                {/* 관광 타입 선택 영역 */}
                <li>
                  <p className="cate-type">관광타입(1개만 선택해주세요)</p>
                  <a className={`cate-ex ${selectedTourType === "12" ? "selected" : ""}`} onClick={() => handleTourTypeClick("12")}>관광지</a>
                  <a className={`cate-ex ${selectedTourType === "14" ? "selected" : ""}`} onClick={() => handleTourTypeClick("14")}>문화시설</a>
                  <a className={`cate-ex ${selectedTourType === "28" ? "selected" : ""}`} onClick={() => handleTourTypeClick("28")}>레포츠</a>
                  <a className={`cate-ex ${selectedTourType === "38" ? "selected" : ""}`} onClick={() => handleTourTypeClick("38")}>쇼핑</a>
                  <a className={`cate-ex ${selectedTourType === "39" ? "selected" : ""}`} onClick={() => handleTourTypeClick("39")}>음식</a>
                </li>




                {/* 대분류 선택 영역 */}
                <li>
                  <p className="cate-type">대분류</p>
                  {/* 밑줄 이거 였음{(selectedTourType === "관광지") && ( */}
                  {(selectedTourType === "12") && (
                    <>
                      <a className={`cate-ex ${selectedCategory === "A01" ? "selected" : ""}`} onClick={() => handleCategoryClick("A01")}>자연</a>
                      <a className={`cate-ex ${selectedCategory === "인문" ? "selected" : ""}`} onClick={() => handleCategoryClick("인문")}>인문</a>
                    </>
                  )}
                  {(selectedTourType === "문화시설") && (
                    <>
                      <a className={`cate-ex ${selectedCategory === "인문" ? "selected" : ""}`} onClick={() => handleCategoryClick("인문")}>인문</a>
                    </>
                  )}
                  {(selectedTourType === "38") && (
                    <>
                      <a className={`cate-ex ${selectedCategory === "A04" ? "selected" : ""}`} onClick={() => handleCategoryClick("A04")}>쇼핑</a>
                    </>
                  )}
                </li>




                {/* 중분류 선택 영역 */}
                {selectedCategory  && (
                  <li>
                    <p className="cate-type">중분류</p>
                    {selectedCategory === "A01" && (
                      <>
                        <a className={`cate-ex ${selectedCategoryMiddle.includes("A0101") ? "selected" : ""}`} onClick={() => handleCategoryMiddleClick("A0101")}>자연관광지</a><br/>
                        <a className={`cate-ex ${selectedCategoryMiddle.includes("A0102") ? "selected" : ""}`} onClick={() => handleCategoryMiddleClick("A0102")}>관광자원</a>
                      </>
                    )}
                    {selectedCategory === "인문" && (
                      <>
                        <a className={`cate-ex ${selectedCategoryMiddle.includes("역사관광지") ? "selected" : ""}`} onClick={() => handleCategoryMiddleClick("역사관광지")}>역사관광지</a><br/>
                        <a className={`cate-ex ${selectedCategoryMiddle.includes("휴양관광지") ? "selected" : ""}`} onClick={() => handleCategoryMiddleClick("휴양관광지")}>휴양관광지</a>
                      </>
                    )}
                    {selectedCategory === "A04" && (
                      <>
                        <a className={`cate-ex ${selectedCategoryMiddle.includes("A0401") ? "selected" : ""}`} onClick={() => handleCategoryMiddleClick("A0401")}>쇼핑</a><br/>
                      </>
                    )}
                  </li>
                )}

                {/* 소분류 선택 영역 */}
                {selectedCategoryMiddle.length > 0 && selectedCategoryMiddle.includes("A0401") && (
                  <li>
                    <p className="cate-type">소분류</p>
                    {/* 중분류가 "A04"일 때만 소분류를 표시 */}
                    {selectedCategoryMiddle.includes("A0401") && (
                      <>
                        <a className={`cate-ex ${selectedCategoryThird.includes("A04010200") ? "selected" : ""}`} onClick={() => handleCategoryThirdClick("A04010200")}>상설시장</a><br/>
                      </>
                    )}
                  </li>
                )}

            </ul>
          </div>
        </div>
        {/* 결과 보기 버튼 */}
          <div className="section-button-container">
            <button className="section-button" type="button" onClick={handleSubmit}>결과보기</button>
          </div>
      </motion.div>
      
      {/* 선택하지 않은 경우에 대한 팝업 */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>타입을 선택해주세요!</p>
            <button onClick={() => setShowPopup(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Section2; 
