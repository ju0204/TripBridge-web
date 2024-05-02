// 필요한 모듈 import
import React, { useState } from 'react';
import { motion } from "framer-motion";
// import { sendSelectedData } from '../../../api/filter'; // 변경된 import 경로
import { sendRequest } from '../../../api/filter';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Bag  from './img/bag.png';

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
      setSelectedCategory([]); // 새로운 관광타입을 선택하면 대분류 초기화
      setSelectedCategoryMiddle([]); // 새로운 관광타입을 선택하면 중분류도 초기화
      setSelectedCategoryThird([]);
    }
  };

  // 대분류 클릭 이벤트 핸들러
    const handleCategoryClick = (category) => {
      // If the same category is clicked again, clear the selection
      if (category === selectedCategory) {
        setSelectedCategory(null); // Clear the category selection
        setSelectedCategoryMiddle([]); // Clear the subcategory selection
        setSelectedCategoryThird([]); // Clear the third category selection
      } else {
        setSelectedCategory(category);
      }
    };

  // 중분류 클릭 이벤트 핸들러
  const handleCategoryMiddleClick = (categoryMiddle) => {
    setSelectedCategoryMiddle(prevState => {
      // Check if the clicked categoryMiddle is already selected
      if (prevState.includes(categoryMiddle)) {
        // If already selected, clear the selection
        return [];
      } else {
        // If not selected, set the selection to the clicked categoryMiddle
        return [categoryMiddle];
      }
    });
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
  if (selectedTourType || selectedCategory || selectedCategoryMiddle.length > 0 || selectedCategoryThird.length > 0) {
    try {
      // sendRequest 함수를 사용하여 데이터를 보냅니다.
      const responseData = await sendRequest(selectedAreas, selectedTourType, selectedCategory, selectedCategoryMiddle, selectedCategoryThird);
      console.log('Success:', responseData);
      navigate('/result', { state: { selectedAreas, selectedTourType, selectedCategory, selectedCategoryMiddle, selectedCategoryThird }});
      // 나머지 코드 생략
    } catch (error) {
      console.error('Error while sending data:', error);
    }
  } else {
    console.log("Please select at least one option.");
    setShowPopup(true);
  }
};



  // JSX 반환
  return (
    <div className="filtersection-container">
      <motion.div className="section-container-box" animate={{ y: -100 }}>
        <div className="section2-box">
          <div className="section-text-box">
            <div className="section-icon-div"><img className="section-icon" src={Bag} /><hr className="hr"/></div>
            <p className="section-text1">원하는 타입을 직접 선택해 장소를 추천 받아볼까요?</p>
            <p className="section-text2">원하는 관광타입을 선택해주세요!</p>
          </div>

          <div className="select-type">
            <ul>
                {/* 관광 타입 선택 영역 */}
                <li>
                  <p className="cate-type">관광타입(1개만 선택해주세요)</p>
                  <a className={`cate-ex-a ${selectedTourType === "12" ? "selected" : ""}`} onClick={() => handleTourTypeClick("12")}>관광지</a>
                  <a className={`cate-ex ${selectedTourType === "14" ? "selected" : ""}`} onClick={() => handleTourTypeClick("14")}>문화시설</a>
                  <a className={`cate-ex ${selectedTourType === "28" ? "selected" : ""}`} onClick={() => handleTourTypeClick("28")}>레포츠</a>
                  <a className={`cate-ex ${selectedTourType === "38" ? "selected" : ""}`} onClick={() => handleTourTypeClick("38")}>쇼핑</a>
                  <a className={`cate-ex ${selectedTourType === "39" ? "selected" : ""}`} onClick={() => handleTourTypeClick("39")}>음식</a>
                </li>

                {/* 대분류 선택 영역 */}
                <li>
                  <p className="cate-type">대분류</p>
                  {/* 관광지*/}
                  {(selectedTourType === "12") && (
                    <>
                      <a className={`cate-ex ${selectedCategory === "A01" ? "selected" : ""}`} onClick={() => handleCategoryClick("A01")}>자연</a>
                      <a className={`cate-ex ${selectedCategory === "A02" ? "selected" : ""}`} onClick={() => handleCategoryClick("A02")}>인문(문화/예술/역사)</a>
                    </>
                  )}
                  {(selectedTourType === "14") && (
                    <>
                      <a className={`cate-ex ${selectedCategory === "A02" ? "selected" : ""}`} onClick={() => handleCategoryClick("A02")}>인문(문화/예술/역사)</a>
                    </>
                  )}
                  {(selectedTourType === "28") && (
                    <>
                      <a className={`cate-ex ${selectedCategory === "A03" ? "selected" : ""}`} onClick={() => handleCategoryClick("A03")}>레포츠</a>
                    </>
                  )}
                  {(selectedTourType === "38") && (
                    <>
                      <a className={`cate-ex ${selectedCategory === "A04" ? "selected" : ""}`} onClick={() => handleCategoryClick("A04")}>쇼핑</a>
                    </>
                  )}
                  {(selectedTourType === "39") && (
                    <>
                      <a className={`cate-ex ${selectedCategory === "A05" ? "selected" : ""}`} onClick={() => handleCategoryClick("A05")}>음식</a>
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
                    {selectedCategory === "A02" &&  selectedTourType === "12" && (
                      <>
                        <a className={`cate-ex ${selectedCategoryMiddle.includes("A0201") ? "selected" : ""}`} onClick={() => handleCategoryMiddleClick("A0201")}>역사관광지</a>
                        <a className={`cate-ex ${selectedCategoryMiddle.includes("A0202") ? "selected" : ""}`} onClick={() => handleCategoryMiddleClick("A0202")}>휴양관광지</a>
                        <a className={`cate-ex ${selectedCategoryMiddle.includes("A0203") ? "selected" : ""}`} onClick={() => handleCategoryMiddleClick("A0203")}>체험관광지</a>
                        <a className={`cate-ex ${selectedCategoryMiddle.includes("A0204") ? "selected" : ""}`} onClick={() => handleCategoryMiddleClick("A0204")}>산업관광지</a>
                        <a className={`cate-ex ${selectedCategoryMiddle.includes("A0205") ? "selected" : ""}`} onClick={() => handleCategoryMiddleClick("A0205")}>건축/조형물</a>
                      </>
                    )}
                    {selectedCategory === "A02" && selectedTourType === "14" && (
                      <>
                        <a className={`cate-ex ${selectedCategoryMiddle.includes("A0201") ? "selected" : ""}`} onClick={() => handleCategoryMiddleClick("A0201")}>역사관광지</a>
                        <a className={`cate-ex ${selectedCategoryMiddle.includes("A0202") ? "selected" : ""}`} onClick={() => handleCategoryMiddleClick("A0202")}>휴양관광지</a>
                        
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
          <div className="section2-button-container">
            <button className="section2-button" type="button" onClick={handleSubmit}>결과보기</button>
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