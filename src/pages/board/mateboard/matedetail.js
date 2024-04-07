import React, { useState, useEffect } from 'react';
import { getMatePostDetail } from '../../../api/board';
import { useParams } from 'react-router-dom';
import './matedetail.css';

const MateDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const postData = await getMatePostDetail(postId);
        setPost(postData);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchPostDetail();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    // 여기에 댓글을 서버에 제출하는 로직 추가
    // 서버에 제출 후 comments 상태 업데이트
    setComments([...comments, comment]);
    setComment('');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error.message}</div>;
  }

  if (!post) {
    return <div className="not-found">Post not found</div>;
  }

  return (
    <div className="container">
      <div className="matepost-details">
        <div className="matepost-title">{post.title}</div>
        <div className="matepost-info">{post.user}&nbsp;&nbsp;|&nbsp;&nbsp;{formatDate(post.date)}</div>
        <div className="content-box">
          <div className="matepost-content">{post.content}</div>
        </div>
      </div>
      <div className="comment-header">댓글</div>
        <div className="comment-section">
        <form onSubmit={handleSubmitComment}>
          <textarea value={comment} onChange={handleCommentChange}></textarea>
          <button type="submit">댓글 남기기</button>
        </form>
        <div className="comments">
          {comments.map((comment, index) => (
            <div key={index}>{comment}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MateDetail;
