import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

import TaskEdit from './TaskEdit';
import TaskCreate from './TaskCreate';

function Tasks() {
    const { users, user, PORT, dispatchAuth } = useAuth();
    
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        async function fetchTasks() {
            try {
                // Fetch tasks
                const taskResponse = await axios.get(`http://localhost:${PORT}/api/tasks`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });

                if (taskResponse && taskResponse.data) {
                    // setTasks(taskResponse.data);
                    dispatchAuth({type:'TASK', payload: taskResponse.data})
                } else {
                    console.log('No tasks found');
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchTasks();
    }, [PORT, user, users]);

    const handleDeleteTask = async (taskId) => {
            try {
                if ((window.confirm('Task will be deleted permanently!'))) {
                    const response = await axios.delete(`http://localhost:${PORT}/api/tasks/${taskId}`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
    
                if (response.data) {
                    const updatedTasks = user.tasks.filter(task => task._id !== taskId);
                    // setTasks(updatedTasks);
                    dispatchAuth({ type: 'TASK', payload: updatedTasks });
                } else {
                    console.log('Error deleting task');
                }

                }else{
                    alert('Deletion cancelled')
                }                
            } catch (error) {
                console.error("Error deleting task:", error);
            }
        
    };
    

    return (
        <div>
            <h3>Tasks</h3>
            
            {editingTask ? (
                <TaskEdit  
                    editingTask={editingTask} 
                    setEditingTask={setEditingTask}
                    tasks={user.tasks} 
                />
            ) : null}
            
            {user.tasks && user.tasks.length > 0 ? (
                <>
                    <table cellSpacing="14">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Created By</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user.tasks && user.tasks.map((task) => (
                                <tr key={task._id} align="center">
                                    <td>{task.title}</td>
                                    <td>{task.createdBy && task.createdBy.username}</td>
                                    <td>{task.status}</td>
                                    <td>{task.priority}</td>
                                    <td>
                                        <Link to={`/task/${task._id}`} users={users}>View</Link>
                                        <button onClick={() => setEditingTask(task)}>Edit</button>
                                        {task.createdBy && task.createdBy.id === user.account._id && 
                                            <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <br /><br />
                </>
            ) : (
                <p>No tasks found</p>
            )}
            <TaskCreate   />
        </div>
    );
}

export default Tasks;
