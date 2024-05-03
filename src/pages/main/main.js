import React from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
//mui-grid 이용
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';

import seoul from './main-img/seoul.jpg'
import './main.css'; // 분리한 CSS 파일을 가장 먼저 불러옵니다.

const Main = () => {
  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
  };

  /*mui-grid*/
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(0),
    textAlign: 'center',
    
  
  })); 

  const MoveToTop = () => {
    // top:0 >> 맨위로  behavior:smooth >> 부드럽게 이동할수 있게 설정하는 속성
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

  return (
     <div className="wrapper">
      {/* <p>메인페이지 구성</p> */}
      {/* 슬라이드 쇼 */}
      <Slider {...settings} className='slider-context'>
        <div className="slider-item1">
          <div className="slide-content-p1">
            <p className="p-city">서울</p>
            <p className="p-city-ex">
            서울, 역사와 현대의 만남이 공존하는 도시
            한국의 문화와 산업의 중심지<br/>
            이곳에서 새로운 경험과 만남이 당신을 기다립니다!
            </p>
          </div>
          <div className="silde-content-img-seoul">
               <p className="img-x">.</p>
          </div>
        </div>
        
        <div className="slider-item2">
          <div className="slide-content-p2">
            <p className="p-city">부산</p>
            <p className="p-city-ex">
            부산, 역사와 현대의 조화가 빛나는 도시<br/>
            대한민국의 역사와 문화가 어우러고 바다 향기가 가득한 여행지<br/>
            이곳에서 신선한 경험과 휴식을 즐겨보세요!
            </p>
          </div>
          <div className="silde-content-img-busan">
               <p className="img-x">.</p>
          </div>
        </div>
        
        <div className="slider-item3">
          <div className="slide-content-p3">
            <p className="p-city">인천</p>
            <p className="p-city-ex">
            인천, 국제적인 항구 도시
            한국의 국제 무역의 중심지<br/>
            아름다운 자연 경관과 역사적인 장소, 인천만의 명소들을 즐겨보세요!
            </p>
          </div>
          <div className="silde-content-img-incheon">
               <p className="img-x">.</p>
          </div>
        </div>

        <div className="slider-item4">
          <div className="slide-content-p4">
            <p className="p-city">제주</p>
            <p className="p-city-ex">
            제주, 푸른 바다와 신비로운 자연이 어우러진 곳!<br/>
            바다를 떠나지 않은 듯한 휴양과 자연 체험을 하고 다채로운 맛을 즐겨보세요!
            </p>
          </div>
          <div className="silde-content-img-jeju">
               <p className="img-x">.</p>
          </div>
        </div>

        <div className="slider-item5">
          <div className="slide-content-p5">
            <p className="p-city">수원</p>
            <p className="p-city-ex">
            수원, 고귀한 문화와 현대적인 매력이 공존하는 도시<br/>
            화려한 궁전과 역사 유적을 탐험하며 과거로의 여행을 떠나보세요!
            </p>
          </div>
          <div className="silde-content-img-suwon">
               <p className="img-x">.</p>
          </div>
        </div>
      </Slider>
      {/* //gird-삭제예정 */}


      <div className="grid-container">
      <Box sx={{ flexGrow: 1 }} >
      <Grid container spacing={1}  >
        <Grid sm ={7} >
          <Item><div className="grid-item1">
              <p className="grid-func"><Link className="link" to="/filter">여행지 추천</Link></p>
              <p className="func-ex">
              다양한 취향에 맞는 여행지를 찾아보세요! <br/>
                최적의 여행지를 찾고 여행을 떠나보세요</p>
            </div></Item>
        </Grid>
        <Grid xs={5}>
        <Item><div className="grid-item2">
              <p className="grid-func"><Link className="link" to="/" onClick={MoveToTop}>홈페이지</Link> </p>
              <p className="func-ex">
              메인 홈페이지입니다
              </p>
            </div></Item>
        </Grid>
        <Grid xs ={5}>
        <Item><div className="grid-item3">
              <p className="grid-func"><Link className="link" to="/tripboard">여행게시판</Link></p>
              <p className="func-ex">
              여행 게시판에서 다양한 게시글들을 확인하세요</p>
            </div></Item>
        </Grid>
        <Grid xs={7}>
        <Item><div className="grid-item4">
              <p className="grid-func"><Link className="link" to="/">동선추천</Link></p>
              <p className="func-ex">
              원하는 여행지들을 찾았지만 동선을 짜기 어려우신가요? <br/>
                동선추천을 이용해서 최적의 이동동선을 추천해드립니다!<br/>
                여행지를 추천 받은 곳과 원하는 곳을 넣고 동선을 추천받아보세요</p>
            </div></Item>
        </Grid>
        <Grid xs={7}>
        <Item><div className="grid-item5">
              <p className="grid-func"><Link className="link" to="/mateboard">여행 메이트게시판</Link></p>
              <p className="func-ex">
              여행을 혼자 가기 싫으신가요? <br/>
              함께 여행할 메이트를 구해보세요!</p>
            </div></Item>
        </Grid>
        <Grid xs={5}>
        <Item><div className="grid-item6">
              <p className="grid-func"><Link className="link" to="/">챗봇</Link></p>
              <p className="func-ex">
              챗봇을 이용해 다양한 검색을 해보세요! 
              </p>
            </div></Item>
        </Grid>
      </Grid>
    </Box>
      </div>
      <div className="footer">
        <hr/>
        <p className="footer-trip">Trip-Bridge</p>
      </div>
     </div>
  );
};

export default Main;