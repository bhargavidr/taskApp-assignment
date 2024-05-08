import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import FileUpload from './FileUpload';
import Comments from './Comments';
import TimeTracker from './TimeTracker';

function TaskDetails(props) {
    const { users, user, PORT } = useAuth(); 
    const { taskId } = useParams();
    const [task, setTask] = useState(null);
    const [comments, setComments] = useState([]);
    

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

   

    return (
        <div>    
            <h2>Task Details</h2>                           
                    {task && (
                        <>
                         <div >
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
                        <div >
                        <FileUpload taskId={taskId}/>
                    </div>

                        <Comments taskId={taskId} comments={comments} setComments={setComments}/>
                                     
                        <TimeTracker id={task._id} task={task}/>                    
                    </>
                    )}
        </div>
    );
}

export default TaskDetails;
