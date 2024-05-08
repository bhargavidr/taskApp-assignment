import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Comments({taskId, comments, setComments}){

    const { user, PORT } = useAuth();

    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedComment, setEditedComment] = useState('');

    const errors ={}
    const [clientErrors, setClientErrors] = useState({})

    


    const handleAddComment = async () => {
        if(newComment.trim().length == 0  ){
            errors.add = 'Cannot add empty comment'
            setClientErrors(errors)
        }else{
            try {
                const response = await axios.post(`http://localhost:${PORT}/api/comments`, {
                    taskId,
                    text: newComment
                }, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
    
                if (response.data) {
                    // Append the new comment to the existing comments
                    setComments([...comments, response.data]);
                    setNewComment(''); // Clear the input field after adding the comment
                    setClientErrors({})
                } else {
                    console.log('error adding comment');
                }
            } catch (error) {
                console.error("Error adding comment:", error);
            }

        }
        
    };

    const handleEditComment = async (commentId) => {
        if(editedComment.trim().length == 0 ){
            errors.edit = 'Cannot add empty comment'
            setClientErrors(errors)
        }else{
            try {
                const response = await axios.put(`http://localhost:${PORT}/api/comments/${commentId}`, {
                    text: editedComment
                }, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
    
                if (response.data) {
                    const updatedComments = comments.map(comment => {
                        if (comment._id === commentId) {
                            return { ...comment, text: editedComment };
                        }
                        return comment;
                    });
                    setComments(updatedComments);
                    setEditingCommentId(null);
                    setEditedComment('');
                    setClientErrors({})
                } else {
                    console.log('error editing comment');
                }

            } catch (error) {
                console.error("Error editing comment:", error);
            }

        }
        
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const response = await axios.delete(`http://localhost:${PORT}/api/comments/${commentId}`, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });

            if (response.data) {
                const filteredComments = comments.filter(comment => comment._id !== commentId);
                setComments(filteredComments);
            } else {
                console.log('error deleting comment');
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };


    return(
        <>
        <h2>Comments</h2>
                    {comments.length > 0 ? (
                        <ul>
                            {comments.map((comment) => (
                                <li key={comment._id}>
                                    {editingCommentId === comment._id ? (
                                        <>
                                            <input type="text" value={editedComment} onChange={(e) => setEditedComment(e.target.value)} />
                                            <button onClick={() => handleEditComment(comment._id)}>Save</button>
                                            {clientErrors.edit && <span className='error'> {clientErrors.edit}</span>}
                                        </>
                                    ) : (
                                        <>
                                            {comment.text} - {comment.createdBy.username} 
                                            {comment.createdBy && comment.createdBy.id == user.account._id && 
                                            <>
                                                <button onClick={() => { setEditingCommentId(comment._id); setEditedComment(comment.text); }}>Edit</button>
                                                <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                                            </>
                                            }
                                            
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div>
                            <p>No comments found</p>
                        </div>
                    )}
                    <div>
                        <h4>Add Comment</h4>
                        <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                        <button onClick={handleAddComment}>Add Comment</button>
                        {clientErrors.add && <span className='error'> {clientErrors.add}</span>}
                    </div>
        </>
    )
}