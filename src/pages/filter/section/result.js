import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { sendRequest, sendScrap, deleteScrap, fetchScrap } from '../../../api/filter';
import image from './img/no_img.jpg';
import  HeartImg  from "./img/scrap.png";
import  EmptyHeartImg  from "./img/empty_scrap.png";
import White from "./img/white-background.png";
import { useLocation } from 'react-router-dom';
import './result.css';
//세션 스토리지 부분 2개 
const Result = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 15;
  const [scrapedPosts, setScrapedPosts] = useState([]);
  const [showScrapedPopup, setShowScrapedPopup] = useState(false);
  const [showAlreadyScrapedPopup, setShowAlreadyScrapedPopup] = useState(false);


  const location = useLocation();
  const { selectedAreas, selectedTourType, selectedCategory, selectedCategoryMiddle, selectedCategoryThird} = location.state;


  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const resultData = await sendRequest(selectedAreas, selectedTourType, selectedCategory, selectedCategoryMiddle, selectedCategoryThird);
        setPosts(resultData);
      } catch (error) {
        console.error('데이터 가져오기 오류_result.js:', error);
      }
    };

    fetchData();
  }, [selectedAreas, selectedTourType, selectedCategory, selectedCategoryMiddle, selectedCategoryThird, currentPage]); // currentPage를 의존성 배열에 추가하여 페이지가 변경될 때마다 데이터를 다시 불러옴

  useEffect(() => {
    // 세션 스토리지에서 스크랩된 게시물 상태 불러오기
    const savedScrapedPosts = sessionStorage.getItem('scrapedPosts');
    if (savedScrapedPosts) {
      setScrapedPosts(JSON.parse(savedScrapedPosts));
    }
  }, []); // 컴포넌트가 처음 마운트될 때만 실행되도록 빈 의존성 배열 추가


// 스크랩(좋아요) 버튼 클릭 시 실행되는 함수
const handleScrap = async (place, address, longitude, latitude) => {
  try {
    const scrapData = {
      place: place,
      address: address,
      longitude: longitude,
      latitude: latitude
    };

    console.log('스크랩 요청 데이터:', scrapData);
    if (scrapedPosts.some(post => post.place === place && post.address === address)) {
      setShowAlreadyScrapedPopup(true);
      return;
    }
    await sendScrap(scrapData);
    setShowScrapedPopup(true);
    
    // 게시물을 고유하게 식별할 수 있는 속성을 사용하여 게시물의 liked 상태를 업데이트
    setPosts(posts.map(post => {
      if (post.place === place && post.address === address) {
        return { ...post, liked: !post.liked };
      }
      return post;
    }));
  } catch (error) {
    console.error('스크랩 요청 오류:', error);
    setShowAlreadyScrapedPopup(true);
  }
};

  // 현재 페이지의 게시물 가져오기
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // 페이지네이션 클릭
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="result-container">
      <motion.div className="result-container-box" animate={{ y: -100 }}>
        <div className="section-box">
          <div className="section-text-box">
            <p className="text">여행지 추천 장소 입니다!</p>
          </div>

           {/* 백엔드에서 가져온 게시물 데이터를 표시하는 부분 */}
          <div className="result-wrapper">
            {currentPosts.map(post => (
              <div className="result" key={post.contentId}>
                <div className="result_img_div">
                  <img src={post.image || image} className="result_img" alt={post.place || "이미지 없음"} />
                </div>
                <button onClick={() => handleScrap(post.place, post.address, post.longitude, post.latitude)} className="scrapbutton">
                <div><img className="scrap_img"src={HeartImg} alt="Heart Filled" /></div>
                </button>
                <h5 className="result_title">{post.place || "제목 없음"}</h5>
              </div>
            ))}
          </div>

          {/* 페이지 네이션 */}
          <div className="pagination1">
            <button
              disabled={currentPage === 1} // 현재 페이지가 1페이지면 비활성화
              onClick={() => paginate(1)} // 맨 처음 페이지로 이동하는 함수 호출
            >
              {"<<"}
            </button>
            {Array.from({ length: Math.ceil(posts.length / postsPerPage) }, (_, i) => {
              const startPage = currentPage <= 5 ? 1 : currentPage - 4; // Calculate the start page of the range
              const endPage = Math.min(startPage + 9, Math.ceil(posts.length / postsPerPage)); // Calculate the end page of the range
              if (i + 1 >= startPage && i + 1 <= endPage) { // Only render buttons within the range
                return (
                  <button 
                    key={i + 1} 
                    className={currentPage === i + 1 ? "active" : ""} // 현재 페이지와 일치할 때 active 클래스 추가
                    onClick={() => paginate(i + 1)}
                  >
                    {i + 1}
                  </button>
                );
              }
              return null; // Render nothing for pages outside the range
            })}
            <button
              disabled={currentPage === Math.ceil(posts.length / postsPerPage)} // 현재 페이지가 마지막 페이지면 비활성화
              onClick={() => paginate(Math.ceil(posts.length / postsPerPage))} // 맨 마지막 페이지로 이동하는 함수 호출
            >
              {">>"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Scraped Popup */}
      {showScrapedPopup && (
        <div className="popup">
          <div className="popup-inner">
            <p>스크랩되었습니다!</p>
            <button onClick={() => setShowScrapedPopup(false)}>확인</button>
          </div>
        </div>
      )}

      {/* Already Scraped Popup */}
      {showAlreadyScrapedPopup && (
        <div className="popup">
          <div className="popup-inner">
            <p>이미 스크랩된 내용입니다.</p>
            <button onClick={() => setShowAlreadyScrapedPopup(false)}>확인</button>
          </div>
        </div>
      )}
    </div>
    

    
  );
};

export default Result;
