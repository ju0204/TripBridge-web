import React from "react";
import styled  from 'styled-components';
import { Link } from 'react-router-dom';
import './main.css'
import { useState, useEffect } from 'react';
import { GrFormNext,GrFormPrevious } from "react-icons/gr";
import { TbCircleArrowRight } from "react-icons/tb";

const Main = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const handleClickPrev = () => {
    setCurrentSlide((prev) => (prev === 1 ? 7 : prev - 1));
  };

  const handleClickNext = () => {
    setCurrentSlide((prev) => (prev === 7 ? 1 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === 7 ? 1 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const Container = styled.div`
    width: ${7 * 100}vw; /* Adjusted for 5 banners */
    height: 480px;
    transition: transform 0.5s ease-in-out;
    transform: translateX(-${(currentSlide - 1) * 100}vw);
    overflow: hidden;
    display: flex; /* Ensures inner divs are in a row */
  `;



  return (
    <div className="main">
      <div className="banner-text">TRIP BRIDGE</div>
      <div className="banner-text2">나만의 여행을 즐길 수 있는 곳, 트립 브릿지</div>
      <div style={{ overflow: 'hidden' }}>
        <Container currentSlide={currentSlide}>
        <div className="inner">
            <img src="./main/seoul.jpg" alt="배너1" className="Img" />
          </div>
          <div className="inner">
            <img src="./main/suwon.jpg" alt="배너2" className="Img" />
          </div>
          <div className="inner">
            <img src="./main/gangwon.jpg" alt="배너3" className="Img" />
          </div>
          <div className="inner">
            <img src="./main/jj.jpg" alt="배너4" className="Img" />
          </div>
          <div className="inner">
            <img src="./main/busan2.jpg" alt="배너5" className="Img" />
          </div>
          <div className="inner">
            <img src="./main/gyeongju.jpg" alt="배너6" className="Img" />
          </div>
          <div className="inner">
            <img src="./main/jeju.jpg" alt="배너7" className="Img" />
          </div>
        </Container>
        <GrFormPrevious size={45} className="left-icon" onClick={handleClickNext} />
        <GrFormNext size={45} className="right-icon" onClick={handleClickPrev} />
      </div>

      <div className="func-container">
        <div className = "func1"> 여행지 추천
          <div className="detail">나만의 완벽한 여행지!<br />원하는 조건에 맞는 여행지를 쉽게 찾을 수 있습니다.</div>
          <Link to = "/filter" className = "moveto">
            <TbCircleArrowRight />
          </Link>
        </div>
        <div className="func2">동선 추천
          <div className="detail">여행의 시작은 계획에서부터!<br /> 편리한 동선 설계로 여행 준비를 도와드립니다.</div>
          <Link to = "/map" className = "moveto">
            <TbCircleArrowRight />
          </Link>
        </div>
        <div className="func3">여행 게시판
          <div className="detail">모두 함께 만드는 여행 커뮤니티!<br /> 여행 정보를 나누고 서로에게 영감을 주는 공간입니다.</div>
          <Link to = "/tripboard" className = "moveto">
            <TbCircleArrowRight />
          </Link>
        </div>
        <div className="func4">여행 메이트 게시판
          <div className="detail">혼자보다 함께가 더 즐거운 여행!<br /> 마음 맞는 여행 메이트를 여기서 찾을 수 있습니다.</div>
          <Link to = "/mateboard" className = "moveto">
            <TbCircleArrowRight />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Main;