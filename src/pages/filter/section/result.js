import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { sendRequest, sendScrap, deleteScrap } from '../../../api/filter';
import image from './img/no_img.jpg';
import HeartButton from './heart';
import { useLocation } from 'react-router-dom';
import './result.css';

const Result = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 15;

  // Load scrapped items from local storage on component mount and when currentPage changes
  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('scrappedPosts'));
    if (savedPosts) {
      setPosts(savedPosts);
    }
  }, [currentPage]);

  const location = useLocation();
  const { selectedAreas, selectedTourType, selectedCategory, selectedCategoryMiddle, selectedCategoryThird} = location.state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resultData = await sendRequest(selectedAreas, selectedTourType, selectedCategory, selectedCategoryMiddle, selectedCategoryThird);
        // Add 'liked' property to each item
        const postsWithLiked = resultData.map(post => ({ ...post, liked: false }));
        setPosts(postsWithLiked);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedAreas, selectedTourType, selectedCategory, selectedCategoryMiddle, selectedCategoryThird, currentPage]);

  const handleScrap = async (place, address, longitude, latitude) => {
    try {
      const scrapData = {
        place: place,
        address: address,
        longitude: longitude,
        latitude: latitude
      };
  
      console.log('스크랩 요청 데이터:', scrapData);
  
      await sendScrap(scrapData);
  
      // 스크랩 상태를 해당 포스트에 업데이트
      setPosts(posts =>
        posts.map(post => {
          if (post.place === place && post.address === address) {
            return { ...post, liked: !post.liked };
          }
          return post;
        })
      );
  
      // 로컬 스토리지에서 기존에 스크랩된 항목 가져오기
      const existingScrappedPosts = JSON.parse(localStorage.getItem('scrappedPosts')) || [];
  
      // 새로운 스크랩 항목 추가
      const newScrappedPost = {
        place: place,
        address: address,
        longitude: longitude,
        latitude: latitude,
        liked: true
      };
  
      // 기존에 스크랩된 항목과 새로운 항목 합치기
      const updatedScrappedPosts = [...existingScrappedPosts, newScrappedPost];
  
      // 로컬 스토리지에 업데이트된 스크랩된 항목 저장
      localStorage.setItem('scrappedPosts', JSON.stringify(updatedScrappedPosts));
  
    } catch (error) {
      console.error('스크랩 요청 에러:', error);
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
                <HeartButton 
                  like={post.liked}
                  onClick={() => handleScrap(post.place, post.address, post.longitude, post.latitude)}
                />
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
    </div>
  );
};

export default Result;