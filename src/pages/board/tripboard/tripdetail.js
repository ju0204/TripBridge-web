import React, { useState, useEffect } from 'react';
import { getTripPostDetail, saveComment, getComments } from '../../../api/tripboard';
import { useParams } from 'react-router-dom';
import './tripdetail.css';
import ImageModal from './imageModal'; // 이미지 모달 컴포넌트 추가

const getToken = () => {
    return localStorage.getItem('accessToken');
}

const TripDetail = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [commentList, setCommentList] = useState([]);
    const [comment, setComment] = useState('');
    const [replyingCommentId, setReplyingCommentId] = useState(null);
    const [replyingContent, setReplyingContent] = useState('');
    
    const [modalImageUrl, setModalImageUrl] = useState(''); // 모달 이미지 URL 추가
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 여부 상태 추가
    const [isLoading, setIsLoading] = useState(true); // 데이터 로딩 상태 추가

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                const postData = await getTripPostDetail(postId);
                setPost(postData);
            } catch (error) {
                console.error('게시글을 불러오는 중 에러 발생 : ', error);
            }
        };
        fetchPostDetail();
    }, [postId]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const commentsData = await getComments(postId);
                setCommentList(commentsData);
                setIsLoading(false); // 데이터 로딩 완료 시 상태 변경
            } catch (error) {
                console.error('댓글을 불러오는 중 에러 발생:', error);
            }
        };

        fetchComments();
    }, [postId]);

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
                tripPost_id: postId,
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
                tripPost_id: postId,
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const openModal = (imageUrl) => {
        setModalImageUrl(imageUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="container">
            <div className="trippost-details">
                <div className="trippost-title">{post && post.title}</div>
                <div className="trippost-info">{post && post.user}&nbsp;&nbsp;|&nbsp;&nbsp;{post && formatDate(post.date)}</div>
                <div className="content-box">
                    <div className="trippost-content">{post && post.content}</div>
                </div>
                {/* 이미지 표시 코드 */}
                <div className="images-container">
                    {post && post.images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Post ${index}`}
                            className="post-image"
                            onClick={() => openModal(image)} // 이미지 클릭 시 모달 열기
                        />
                    ))}
                </div>
            </div>
            <div className="comment-header">댓글</div>
            <div className="comment-section">
                <form onSubmit={handleSubmitComment}>
                    <textarea value={comment} onChange={handleChangeComment}></textarea>
                    <button type="submit">댓글 남기기</button>
                </form>
                {isLoading ? (
                    <div>Loading...</div>
                ) : (
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
                )}
            </div>
            {/* 이미지 모달 */}
            {isModalOpen && <ImageModal imageUrl={modalImageUrl} onClose={closeModal} />}
        </div>
    );
};

export default TripDetail;
