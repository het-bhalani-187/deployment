import React, { useState } from 'react';
import '../styles/Thread.css';

const Reply = ({ reply, addSubReply, onLike, onPin, onDelete }) => {
    const [subReplyText, setSubReplyText] = useState('');
    // const [showSubReplies, setShowSubReplies] = useState(false);

    const handleSubReplyChange = (e) => setSubReplyText(e.target.value);

    const handleSubReplySubmit = () => {
        if (subReplyText.trim()) {
            addSubReply(subReplyText);
            setSubReplyText('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubReplySubmit();
        }
    };

    return (
        <div className={`reply ${reply.pinned ? 'pinned' : ''}`}>
            <div className="reply-text">
                <strong>{reply.userId === 'Lawyer123' ? 'Lawyer ID' : 'User ID'}:</strong> {reply.userId} <br />
                {reply.text} <small className="reply-timestamp">({reply.timestamp})</small>
            </div>
            <div className="reply-actions">
                <button className="like-button" onClick={onLike}>👍 {reply.likes}</button>
                <button className="pin-button" onClick={onPin}>
                    {reply.pinned ? '📌 Unpin' : '📌 Pin'}
                </button>
                <button className="delete-button" onClick={onDelete}>🗑️ Delete</button>
            </div>
            {reply.userId !== 'Lawyer123' && (
                <div className="reply-input">
                    <input
                        type="text"
                        value={subReplyText}
                        onChange={handleSubReplyChange}
                        onKeyPress={handleKeyPress} // Trigger handleSubReplySubmit on Enter
                        placeholder="Reply to this..."
                    />
                    <button onClick={handleSubReplySubmit}>Reply</button>
                </div>
            )}
           
            {/* {showSubReplies && (
                <div className="replies">
                    {reply.replies.map((subReply, index) => (
                        <Reply
                            key={index}
                            reply={subReply}
                            addSubReply={(text) => addSubReply(text, index)}
                            onLike={() => onLike(index)}
                            onPin={() => onPin(index)}
                            onDelete={() => onDelete(index)}
                        />
                    ))}
                </div>
            )} */}
        </div>
    );
};

const Comment = ({ comment, addReply, likeReply, pinReply, deleteComment, commentIndex, onEdit }) => {
    const [replyText, setReplyText] = useState('');
    const [showReplies, setShowReplies] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const handleReplyChange = (e) => setReplyText(e.target.value);

    const handleReplySubmit = () => {
        if (replyText.trim()) {
            addReply(replyText);
            setReplyText('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleReplySubmit();
        }
    };

    const handleEditSubmit = () => {
        onEdit(commentIndex, replyText);
        setEditMode(false);
    };

    return (
        <div className="comment">
            {editMode ? (
                <div className="edit-comment">
                    <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                    />
                    <button onClick={handleEditSubmit}>Save</button>
                </div>
            ) : (
                <>
                    <div className="comment-text">
                        <strong>User ID:</strong> {comment.userId} <br />
                        {comment.text}
                    </div>
                    <div className="comment-options">
                        <button className="ellipsis-button" onClick={() => setShowOptions(!showOptions)}>⋮</button>
                        {showOptions && (
                            <div className="options-dropdown">
                                <button onClick={() => {
                                    setEditMode(true);
                                    setReplyText(comment.text);
                                }}>Edit</button>
                                <button onClick={() => deleteComment(commentIndex)}>Delete</button>
                            </div>
                        )}
                    </div>
                </>
            )}
            <div className="reply-input">
                <input
                    type="text"
                    value={replyText}
                    onChange={handleReplyChange}
                    onKeyPress={handleKeyPress} // Trigger handleReplySubmit on Enter
                    placeholder="Reply to this comment..."
                />
                <button onClick={handleReplySubmit}>Reply</button>
            </div>
            <button className="toggle-replies" onClick={() => setShowReplies(!showReplies)}>
                {showReplies ? 'Hide Replies' : `View Replies (${comment.replies.length})`}
            </button>
            {showReplies && (
                <div className="replies">
                    {comment.replies.map((reply, replyIndex) => (
                        <Reply
                            key={replyIndex}
                            reply={reply}
                            addSubReply={(replyText) => addReply(replyText, commentIndex, replyIndex)}
                            onLike={() => likeReply(commentIndex, replyIndex)}
                            onPin={() => pinReply(commentIndex, replyIndex)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const Thread = () => {
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [searchText, setSearchText] = useState('');
    const lawyerId = 'Lawyer123';

    const handleCommentSubmit = () => {
        if (commentText.trim()) {
            const newComment = {
                text: commentText,
                userId: 'User123',
                replies: [],
            };
            setComments([...comments, newComment]);

            // Simulate lawyer's response
            setTimeout(() => {
                const lawyerResponse = {
                    text: `This is an automatic response to your question: "${commentText}"`,
                    userId: lawyerId,
                    likes: 0,
                    pinned: false,
                    timestamp: new Date().toLocaleString(),
                    replies: [],
                };
                setComments((prevComments) => {
                    const updatedComments = [...prevComments];
                    updatedComments[updatedComments.length - 1].replies.push(lawyerResponse);
                    return updatedComments;
                });
            }, 1000);

            setCommentText('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleCommentSubmit();
        }
    };

    const addReply = (replyText, commentIndex, parentIndex = null) => {
        const newComments = [...comments];
        const newReply = {
            text: replyText,
            likes: 0,
            pinned: false,
            timestamp: new Date().toLocaleString(),
            userId: parentIndex === null ? lawyerId : 'User123',
            replies: [],
        };
        if (parentIndex !== null) {
            newComments[commentIndex].replies[parentIndex].replies.push(newReply);
        } else {
            newComments[commentIndex].replies.push(newReply);
        }
        setComments(newComments);
    };

    const likeReply = (commentIndex, replyIndex) => {
        const newComments = [...comments];
        newComments[commentIndex].replies[replyIndex].likes += 1;
        setComments(newComments);
    };

    const pinReply = (commentIndex, replyIndex) => {
        const newComments = [...comments];
        const reply = newComments[commentIndex].replies[replyIndex];
        reply.pinned = !reply.pinned;
        setComments(newComments);
    };

    const deleteComment = (commentIndex) => {
        const newComments = comments.filter((_, index) => index !== commentIndex);
        setComments(newComments);
    };

    const editComment = (index, newText) => {
        const newComments = [...comments];
        newComments[index].text = newText;
        setComments(newComments);
    };

    const filteredComments = comments.filter((comment) =>
        comment.text.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className="thread-background gradient-bg">
            <div className="add-thread">
                <h2 className="section-title">CourtRoom Chat</h2>
                <div className="comment-input">
                    <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyPress={handleKeyPress} // Trigger handleCommentSubmit on Enter
                        placeholder="Ask your legal question..."
                    />
                    <button onClick={handleCommentSubmit}>Post</button>
                </div>
                <div className="search-bar">
                    <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search questions..."
                    />
                </div>
            </div>
            <div className="add-thread-container">
                <h2 className="section-title">Threads</h2>
                <div className="thread-grid">
                    {filteredComments.map((comment, index) => (
                        <Comment
                            key={index}
                            comment={comment}
                            addReply={(replyText) => addReply(replyText, index)}
                            likeReply={(replyIndex) => likeReply(index, replyIndex)}
                            pinReply={(replyIndex) => pinReply(index, replyIndex)}
                            deleteComment={() => deleteComment(index)}
                            onEdit={editComment}
                            commentIndex={index}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Thread;
