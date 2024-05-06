import React, { useState, useEffect } from 'react';
import { getTripPostDetail, saveComment, getComments, deletePost, deleteComment } from '../../../api/tripboard';
import { useParams, useNavigate } from 'react-router-dom';
import './tripdetail.css';
import ImageModal from './imageModal';

const getToken = () => {
    return sessionStorage.getItem('accessToken');
}

const TripDetail = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [commentList, setCommentList] = useState([]);
    const [comment, setComment] = useState('');
    const [replyingToId, setReplyingToId] = useState(null);
    const [replyingToContent, setReplyingToContent] = useState('');
    const [replyingToUser, setReplyingToUser] = useState('');
    const [modalImageUrl, setModalImageUrl] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    //게시글
    useEffect(() => {
        const fetchData = async () => {
            try {
                const postData = await getTripPostDetail(postId);
                setPost(postData);
            } catch (error) {
                console.error('게시물을 불러오는 중 오류 발생:', error);
            }
        };

        //댓글
        const fetchComments = async () => {
            try {
                const commentsData = await getComments(postId);
                setCommentList(commentsData);
            } catch (error) {
                console.error('댓글을 불러오는 중 오류 발생:', error);
            }
        };

        fetchData();
        fetchComments();
    }, [postId]);


const handleDeletePost = async () => {
    try {
        const shouldDelete = window.confirm('게시글을 삭제하시면 다시 복구할 수 없습니다.\n정말 게시글을 삭제하시겠습니까?');
        if (shouldDelete) {
            // 해당 게시글의 댓글들을 먼저 삭제합니다.
            const commentsData = await getComments(postId);
            for (const comment of commentsData) {
                await deleteComment(comment.id);
            }
            // 댓글 삭제 후 게시글 삭제
            await deletePost(postId);
            console.log('게시글과 댓글이 성공적으로 삭제되었습니다.');
            navigate('/tripboard');
        }
    } catch (error) {
        console.error('게시글 또는 댓글 삭제 중 오류 발생:', error);
    }
};


    const handleChangeComment = (e) => {
        const { value } = e.target;
        setComment(value);
    };

    //댓글 작성
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
                tripPost_id: postId,
                content: comment,
            };
            await saveComment(commentData, { headers: { Authorization: `Bearer ${token}` } });
            console.log('댓글이 성공적으로 작성되었습니다.');
            const updatedComments = await getComments(postId);
            setCommentList(updatedComments);
            setComment('');
        } catch (error) {
            console.error('댓글 작성 중 오류 발생:', error);
        }
    };

    const handleReply = (commentId, user) => {
        setReplyingToId(commentId);
        setReplyingToUser(user);
        setReplyingToContent(`@${user} `);
    };

    const handleChangeReplyContent = (e) => {
        const { value } = e.target;
        setReplyingToContent(value);
    };

    const handleSubmitReply = async (e, parentId) => {
        e.preventDefault();
        if (!replyingToContent.trim()) {
            console.error('답글을 입력해주세요.');
            return;
        }
        try {
            const token = getToken();
            if (!token) {
                console.error('로그인이 필요합니다.');
                return;
            }
            const commentData = {
                tripPost_id: postId,
                content: replyingToContent,
                parent_comment_id: parentId,
            };
            await saveComment(commentData, { headers: { Authorization: `Bearer ${token}` } });
            console.log('대댓글 작성 성공');
            const updatedComments = await getComments(postId);
            setCommentList(updatedComments);
            setReplyingToContent('');
            setReplyingToId(null);
            setReplyingToUser('');
        } catch (error) {
            console.error('대댓글 작성 중 오류 발생:', error);
        }
    };

    
  const handleDeleteComment = async (commentId) => {
    try {
      const shouldDelete = window.confirm('정말로 이 댓글을 삭제하시겠습니까?');
      if (shouldDelete) {
        await deleteComment(commentId);
        console.log('댓글이 성공적으로 삭제되었습니다.');
        const updatedComments = await getComments(postId);
        setCommentList(updatedComments);
      }
    } catch (error) {
      console.error('댓글 삭제 중 오류 발생:', error);
    }
  };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const formatCommentDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    const openModal = (imageUrl) => {
        setModalImageUrl(imageUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const renderComments = (comments, isNewComment = false) => {
        let commentGroups = {};

        comments.forEach((comment, index) => {
            const depth = comment.depth || 1;
            if (!commentGroups[depth]) {
                commentGroups[depth] = [];
            }
            commentGroups[depth].push(comment);
        });

        return Object.entries(commentGroups).map(([depth, comments]) => (
            <div key={depth}>
              {comments.map((comment, index) => (
                <div key={index} className={`comment-container depth-${depth} ${isNewComment ? 'new-comment' : ''}`}>
                  <div className="comment-box">
                    <>
                      <div className="info">
                        <span>{comment.user} | {formatCommentDate(comment.date)}</span>
                        <div>
                          <button type="button" onClick={() => handleDeleteComment(comment.id)}>삭제</button>
                          <button type="button" onClick={() => handleReply(comment.id, comment.user)}>답글</button>
                        </div>
                      </div>
                      <div className="content-box">{comment.content}</div>
                    </>
                  </div>
                  {replyingToId === comment.id && (
                    <form onSubmit={(e) => handleSubmitReply(e, comment.id)}>
                      <textarea
                        value={replyingToContent}
                        onChange={handleChangeReplyContent}
                        placeholder={`@${replyingToUser}`}
                      ></textarea>
                      <button type="submit">답글 작성</button>
                    </form>
                  )}
                  {comment.children && renderComments(comment.children)}
                </div>
              ))}
            </div>
          ));
    };

    return (
        <div className="container">
            <div className="trippost-details">
                <div className="trippost-title">{post && post.title}</div>
                <div className="trippost-info">{post && post.user}&nbsp;|&nbsp;{post && formatDate(post.date)}</div>
                <div className="images-container">
                    {post && post.images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={``}
                            className="post-image"
                            onClick={() => openModal(image)}
                        />
                    ))}
                </div>
                <div className="content-box">
                    <div className="trippost-content">{post && post.content}</div>
                </div>
                {post && (
        <div className="action-buttons">
          <button onClick={handleDeletePost}>삭제</button>
        </div>
      )}
            </div>
            <div className="comment-header">댓글</div>
            <div className="comment-section">
                <form onSubmit={handleSubmitComment}>
                    <textarea value={comment} onChange={handleChangeComment}></textarea>
                    <button type="submit">댓글 작성</button>
                </form>
                <div className='comment-list'>
                    <div className='comment-semiheader'>댓글 목록</div>
                    {renderComments(commentList, true)}
                </div>
            </div>
            {isModalOpen && <ImageModal imageUrl={modalImageUrl} onClose={closeModal} />}
        </div>
    );
};

export default TripDetail;
