import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
// import { sendResult, sendScrap } from '../../../api/filter'; // 수정된 import 경로
import { sendRequest, sendScrap } from '../../../api/filter';
import image from './img/no_img.jpg';
import HeartButton from './heart';
import { useLocation } from 'react-router-dom';
import './result.css';

const Result = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 15;

  const location = useLocation();
  const { selectedAreas, selectedTourType, selectedCategory, selectedCategoryMiddle, selectedCategoryThird} = location.state;


  useEffect(() => {
    const fetchData = async () => {
      try {
        const resultData = await sendRequest(selectedAreas, selectedTourType, selectedCategory, selectedCategoryMiddle,selectedCategoryThird);
        setPosts(resultData);
      } catch (error) {
        console.error('데이터 가져오기 오류_result.js:', error);
      }
    };

    fetchData();
  }, [selectedAreas, selectedTourType, selectedCategory, selectedCategoryMiddle,selectedCategoryThird]);



    // 스크랩(좋아요) 버튼 클릭 시 실행되는 함수
    const handleScrap = async (postId) => {
      try {
        await sendScrap(postId);
        // 스크랩이 성공하면 해당 게시물의 liked 상태를 반전시킴
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return { ...post, liked: !post.liked };
          }
          return post;
        }));
      } catch (error) {
        console.error('스크랩 요청 오류:', error);
      }
    };

  // 현재 페이지의 게시물 가져오기
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // 페이지네이션 클릭
  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  return (
    <div className="filtersection-container">
      <motion.div className="section-container-box" animate={{ y: -100 }}>
        <div className="section-box">
          <div className="section-text-box">
            <p className="text">여행지 추천 장소 입니다!</p>
          </div>

           {/* 백엔드에서 가져온 게시물 데이터를 표시하는 부분 */}
          <div className="result-wrapper">
            {currentPosts.map(post => (
              <div className="result" key={post.contentId}>
                <div className="result_img_div">
                <img src={post.image || image} className="result_img" alt={post.title || "이미지 없음"} />
                </div>
                <HeartButton 
                  like={post.liked}
                  onClick={() => handleScrap(post.contentId)}
                />
                <h5 className="result_title">{post.title || "제목 없음"}</h5>
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