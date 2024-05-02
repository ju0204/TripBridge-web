import React, { useState, useEffect } from 'react';
import './tripboardlist.css';
import { Link } from 'react-router-dom';
import { showTripPost } from '../../../api/tripboard';

const TripPostList = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 15;

  useEffect(() => {
    const showpost = async () => {
      try {
        const data = await showTripPost();
        setPosts(data);
      } catch (error) {
        console.error('게시물 불러오기 오류:', error);
      }
    };
    showpost();
  }, []);

  // 현재 페이지의 게시물
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // yyyy-mm-dd 형식으로 날짜 포맷팅하는 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // 페이지네이션 클릭
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className='trip-board-banner'>/배너/</div>
      <div className="trip-board-main">여행 게시판</div>
      <div className="trip-board-container">
        <div className="post-header">
          <div className="post-header-item">번호</div>
          <div className="post-header-item">제목</div>
          <div className="post-header-item">작성자</div>
          <div className="post-header-item">작성일</div>
        </div>
        <div className="post-list">
          {currentPosts.map((post, index) => (
            <div className={`post-item ${index === currentPosts.length - 1 ? 'last-item' : ''}`} key={post.id}>
              <div className="post-content">
                <div className="post-data">{indexOfFirstPost + index + 1}</div>
                <div className="post-data">
                  <Link to={`/tripboard/${post.id}`} className="post-title">{post.title}</Link>
                </div>
                <div className="post-data">{post.user}</div>
                <div className="post-data">{formatDate(post.date)}</div>
              </div>
            </div>
          ))}
        </div>
        {/* 페이지 네이션 */}
        <div className="pagination">
          {Array.from({ length: Math.ceil(posts.length / postsPerPage) }, (_, i) => (
            <button key={i + 1} onClick={() => paginate(i + 1)}>
              {i + 1}
            </button>
          ))}
        </div>
        <Link to="/trip" className="write-post-button">✏️글쓰기</Link>
      </div>
    </div>
  );
};

export default TripPostList;