import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import FileUpload from './FileUpload';

function TaskDetails(props) {
    const { users, user, PORT } = useAuth(); 
    const { taskId } = useParams();
    const [task, setTask] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedComment, setEditedComment] = useState('');

    useEffect(() => {
        async function fetchTaskDetails() {
            try {
                const taskResponse = await axios.get(`http://localhost:${PORT}/api/tasks/${taskId}`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });

                if (taskResponse) {
                    const assignedUserIds = taskResponse.data.assignedTo;
                    const assignedUsernames = users.filter(ele => assignedUserIds.includes(ele._id))
                                                    .map(ele =>  ele.username);
                    taskResponse.data.assignedUsernames = assignedUsernames;
                    setTask(taskResponse.data);
                } else {
                    console.log('error fetching task details');
                }
            } catch (error) {
                console.error("Error fetching task details:", error);
            }
        }

        async function fetchComments() {
            try {
                const commentsResponse = await axios.get(`http://localhost:${PORT}/api/comments/task/${taskId}`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });

                if (commentsResponse) {
                    setComments(commentsResponse.data);
                } else {
                    console.log('error fetching comments');
                }
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        }

        fetchTaskDetails();
        fetchComments();
    }, [PORT, taskId, users]);

    const handleAddComment = async () => {
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
            } else {
                console.log('error adding comment');
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleEditComment = async (commentId) => {
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
            } else {
                console.log('error editing comment');
            }
        } catch (error) {
            console.error("Error editing comment:", error);
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

    return (
        <div>
            <h2>Task Details</h2>
            
                <div>
                    {task && (
                        <div>
                            <p><b>Title:</b> {task.title}</p>
                            <p><b>Description:</b> {task.description}</p>
                            <p><b>Due Date: </b>{task.dueDate}</p>
                            <p><b>Priority: </b>{task.priority}</p>
                            <p><b>Created By: </b>{task.createdBy.username}</p>
                            <p><b>Assigned to: </b></p>
                            <ul>
                                {task.assignedUsernames.length > 0 && task.assignedUsernames.map((ele, i) => {
                                    return <li key={i} value={ele}>{ele}</li>
                                })}
                            </ul>  
                        </div>
                    )}
                </div>

                    <FileUpload taskId={taskId}/>
                    <h3>Comments</h3>
                    {comments.length > 0 ? (
                        <ul>
                            {comments.map((comment) => (
                                <li key={comment._id}>
                                    {editingCommentId === comment._id ? (
                                        <>
                                            <input type="text" value={editedComment} onChange={(e) => setEditedComment(e.target.value)} />
                                            <button onClick={() => handleEditComment(comment._id)}>Save</button>
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
                    </div>
                
            
        </div>
    );
}

export default TaskDetails;
