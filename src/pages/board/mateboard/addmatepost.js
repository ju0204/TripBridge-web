import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './addmatepost.css';
import { savePost } from '../../../api/mateboard';

const getToken = () => {
  return sessionStorage.getItem('accessToken');
};

const AddMatePost = () => {
  const [postData, setPostData] = useState({
    title: '',
    content: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData({ ...postData, [name]: value });
    setErrorMessage(''); // 에러 메시지를 초기화합니다.
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!postData.title.trim() && !postData.content.trim()) {
      setErrorMessage('제목과 내용을 입력해주세요.');
    } else if (!postData.title.trim()) {
      setErrorMessage('제목을 입력해주세요.');
    } else if (!postData.content.trim()) {
      setErrorMessage('내용을 입력해주세요.');
    } else {
      try {
        const token = getToken(); // 로컬 스토리지에서 토큰을 가져옵니다.

        // 토큰이 없으면 로그인 필요 메시지 출력 또는 로그인 페이지로 이동 등의 처리 가능
        if (!token) {
          console.error('로그인이 필요합니다.');
          return;
        }
        await savePost(
          {
            postId : postData.user_id,
            title: postData.title,
            content: postData.content
          },
          {
            // 헤더에 토큰 추가
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log('글쓰기 성공');
        navigate('/mateboard');
      } catch (error) {
        console.error('글쓰기 오류:', error); // 오류가 발생하면 콘솔에 오류 메시지 출력
      }
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    navigate('mateboard');
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            작성 중인 글이 전부 사라집니다. <br />
            <b>정말 취소하시겠습니까?</b>
            <div className="modal-button">
              <Link to="/mateboard">
                <button>확인</button>
              </Link>
              <button onClick={handleCloseModal}>취소</button>
            </div>
          </div>
        </div>
      )}
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="label">
              제목
            </label>
            <input
              type="text"
              name="title"
              className="input-field"
              value={postData.title}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="content" className="label">
              내용
            </label>
            <textarea
              name="content"
              className="input-field"
              value={postData.content}
              onChange={handleChange}
            />
          </div>
          {errorMessage && (
            <div className="custom-error-message">{errorMessage}</div>
          )}
          <div className="button-container">
            <button type="submit" className="button">
              등록
            </button>
            <button onClick={handleCancel} className="button">
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMatePost;
