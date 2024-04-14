import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './addtrippost.css';
import { savePostWithImage } from '../../../api/tripboard';

const AddTripPost = () => {
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    images: []
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false); // 모달창 표시 여부 상태 추가
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData({ ...postData, [name]: value });
    setErrorMessage('');
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setPostData({ ...postData, images: files });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!postData.title.trim() && !postData.content.trim()) {
      setErrorMessage('제목과 내용을 입력해주세요.');
      return;
    }
  
    if (!postData.title.trim()) {
      setErrorMessage('제목을 입력해주세요.');
      return;
    }
  
    if (!postData.content.trim()) {
      setErrorMessage('내용을 입력해주세요.');
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('title', postData.title);
      formData.append('content', postData.content);
      
      // 이미지가 있는 경우에만 FormData에 추가
      if (postData.images.length > 0) {
        postData.images.forEach((image) => {
          formData.append('images', image);
        });
      }
  
      // 이미지가 없어도 게시글을 저장할 수 있도록 처리
      await savePostWithImage(formData);
  
      navigate('/tripboard');
    } catch (error) {
      console.error('게시글 저장 실패:', error);
      setErrorMessage('게시글 저장에 실패했습니다.');
    }
  };
  
  
  
  const handleCancel = () => {
    setShowModal(true); // 모달창 표시
  };

  const handleCloseModal = () => {
    setShowModal(false); // 모달창 닫기
  };

  const handleConfirmCancel = () => {
    handleCloseModal(); // 모달창 닫기
    navigate('/tripboard'); // 게시판으로 이동
  };

  return (
    <div className="add-trip-post-container">
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            작성 중인 글이 전부 사라집니다. <br />
            <b>정말 취소하시겠습니까?</b>
            <div className="modal-button">
              <button onClick={handleConfirmCancel}>확인</button>
              <button onClick={handleCloseModal}>취소</button>
            </div>
          </div>
        </div>
      )}
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="label">제목</label>
            <input type="text"
              name="title"
              className="input-field"
              value={postData.title}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="content" className="label">내용</label>
            <textarea
              name="content"
              className="input-field"
              value={postData.content}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="image" className="label">이미지</label>
            <input
              type="file"
              id="image"
              className="input-field"
              accept="image/*"
              onChange={handleImageChange}
              multiple
            />
          </div>
          {errorMessage && (
            <div className="custom-error-message">{errorMessage}</div>
          )}
          <div className="button-container">
            <button type="submit" className="button">
              등록
            </button>
            <button type="button" onClick={handleCancel} className="button">
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTripPost;
