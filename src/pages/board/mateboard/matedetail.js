import React, { useState, useEffect } from 'react';
import { getMatePostDetail, saveComment, getComments } from '../../../api/mateboard';
import { useParams } from 'react-router-dom';
import './matedetail.css';

const MateDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

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
  }, [postId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsData = await getComments(postId);
        setComments(commentsData);
      } catch (error) {
        console.error('댓글을 불러오는 중 에러 발생:', error);
      }
    };

    fetchComments();
  }, [postId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    try {
      await saveComment({ postId, content: comment });
      const updatedComments = await getComments(postId);
      setComments(updatedComments);
    } catch (error) {
      console.error('댓글 저장 실패:', error);
    }
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
        <div>
          <div className='comment-semiheader'>댓글 목록</div>
          <ul>
            {comments.map((comment, index) => (
              <li key={index}>
                <div>작성자: {comment.user}</div>
                <div>작성일: {comment.date}</div>
                <div>내용: {comment.content}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MateDetail;
