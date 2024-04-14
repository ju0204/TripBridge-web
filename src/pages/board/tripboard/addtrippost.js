import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './addtrippost.css';
import { savePost } from '../../../api/tripboard';

// getToken 함수는 중복 정의되어 있으므로 이전에 정의된 함수 사용
const getToken = () => {
  return localStorage.getItem('accessToken');
};

const AddTripPost = () => {
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    images: []
  });

  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
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

        const formData = new FormData();
        postData.images.forEach((image, index) => {
          formData.append(`image${index + 1}`, image);
        });

        await savePost(
          {
            title : postData.title,
            content : postData.content
          },
          {
            // 헤더에 토큰 추가
            headers: {
              Authorization: `Bearer ${token}`
             }
          }, formData
        );
        console.log('글쓰기 성공');
        navigate('/mateboard');
      } catch (error) {
        console.error('글쓰기 오류:', error); // 오류가 발생하면 콘솔에 오류 메시지 출력
      }
    }
  };
  

  const handleCancel = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/tripboard');
  };

  return (
    <div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            작성 중인 글이 전부 사라집니다. <br />
            <b>정말 취소하시겠습니까?</b>
            <div className="modal-button">
              {/* 모달 내에서 '확인' 버튼 클릭 시 모달을 닫고 페이지 이동 */}
              <button onClick={() => { setShowModal(false); navigate('/tripboard'); }}>확인</button>
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
              multiple // 여러 개의 파일 선택 가능
            />
          </div>
          {/* 이미지 미리 보기 추가 */}
          <div className="image-preview-container">
            {postData.images.map((image, index) => (
              <img key={index} src={URL.createObjectURL(image)} alt="" className="image-preview" />
            ))}
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

export default AddTripPost;
