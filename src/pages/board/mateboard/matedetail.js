import React, { useState, useEffect } from 'react';
import { getMatePostDetail, saveComment, getComments } from '../../../api/mateboard';
import { useParams } from 'react-router-dom';
import './matedetail.css';

const getToken = () => {
  return localStorage.getItem('accessToken');
};

const MateDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [commentList, setCommentList] = useState([]);
  const [comment, setComment] = useState('');
  const [replyingCommentId, setReplyingCommentId] = useState(null);
  const [replyingContent, setReplyingContent] = useState('');

  useEffect(() => { 
    const fetchPostDetail = async () => {
      try {
        const postData = await getMatePostDetail(postId);
        setPost(postData);
      } catch (error) {
        console.error('게시글을 불러오는 중 에러 발생:', error);
      }
    };

    fetchPostDetail();
  }, [postId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsData = await getComments(postId);
        setCommentList(commentsData);
      } catch (error) {
        console.error('댓글을 불러오는 중 에러 발생:', error);
      }
    };

    fetchComments();
  }, [postId]);

  const formatDate = (dateString) => {
    if (!dateString) return ''; // 날짜 문자열이 없는 경우 처리
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // 유효하지 않은 날짜 문자열인 경우 처리
    return date.toISOString().split('T')[0];
  };

  const handleChangeComment = (e) => {
    const { value } = e.target;
    setComment(value);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      console.error('댓글을 입력해주세요.');
      return;
    }
    try {
      const token = getToken();
      if (!token) {
        console.error('로그인이 필요합니다.');
        return;
      }
      const commentData = {
        matePost_id: postId,
        content: comment,
      };
      await saveComment(commentData, { headers: { Authorization: `Bearer ${token}` } });
      console.log('댓글 작성 성공');
      const updatedComments = await getComments(postId);
      setCommentList(updatedComments);
      setComment('');
    } catch (error) {
      console.error('댓글 작성 오류:', error);
    }
  };

  const handleSubmitReply = async (e, parentId) => {
    e.preventDefault();
    if (!replyingContent.trim()) {
      console.error('댓글을 입력해주세요.');
      return;
    }
    try {
      const token = getToken();
      if (!token) {
        console.error('로그인이 필요합니다.');
        return;
      }
      const commentData = {
        matePost_id: postId,
        content: replyingContent,
        parent_comment_id: parentId,
      };
      await saveComment(commentData, { headers: { Authorization: `Bearer ${token}` } });
      console.log('대댓글 작성 성공');
      const updatedComments = await getComments(postId);
      setCommentList(updatedComments);
      setReplyingContent('');
      setReplyingCommentId(null); // 대댓글 작성 후 상태 초기화
    } catch (error) {
      console.error('대댓글 작성 오류:', error);
    }
  };

  const handleReply = (commentId) => {
    setReplyingCommentId(commentId);
  };

  const handleChangeReply = (e) => {
    const { value } = e.target;
    setReplyingContent(value);
  };

  return (
    <div className="container">
      <div className="matepost-details">
        <div className="matepost-title">{post && post.title}</div>
        <div className="matepost-info">{post && post.user}&nbsp;&nbsp;|&nbsp;&nbsp;{post && formatDate(post.date)}</div>
        <div className="content-box">
          <div className="matepost-content">{post && post.content}</div>
        </div>
      </div>
      <div className="comment-header">댓글</div>
      <div className="comment-section">
        <form onSubmit={handleSubmitComment}>
          <textarea value={comment} onChange={handleChangeComment}></textarea>
          <button type="submit">댓글 남기기</button>
        </form>
        <div className='comment-list'>
          <div className='comment-semiheader'>댓글 목록</div>
          {commentList.map((comment, index) => (
            <div key={index} className="comment-container">
              <div className="comment-box">
                <div className="info">
                  {comment.user} &nbsp;&nbsp;|&nbsp;&nbsp; {formatDate(comment.date)}
                  <button type="button" onClick={() => handleReply(comment.id)}>답글</button>
                </div>
                <div className="content-box">{comment.content}</div>
              </div>
              {replyingCommentId === comment.id && (
                <form onSubmit={(e) => handleSubmitReply(e, comment.id)}>
                  <textarea value={replyingContent} onChange={handleChangeReply}></textarea>
                  <button type="submit">대댓글 남기기</button>
                </form>
              )}
              {comment.children && comment.children.length > 0 && (
                <div className="child-comments">
                  {comment.children.map((childComment, childIndex) => (
                    <div key={childIndex} className="comment-container child-comment">
                      <div className="comment-box">
                        <div className="info">{childComment.user} &nbsp;&nbsp;|&nbsp;&nbsp; {formatDate(childComment.date)}</div>
                        <div className="content-box">{childComment.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MateDetail;
