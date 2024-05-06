import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

import TaskEdit from './TaskEdit';

function Tasks() {
    const { user, PORT } = useAuth();
    const [tasks, setTasks] = useState(null);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        assignedTo: '',
        priority: '',
        dueDate: ''
    });
    const [editingTask, setEditingTask] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch tasks
                const taskResponse = await axios.get(`http://localhost:${PORT}/api/tasks`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });

                if (taskResponse) {
                    setTasks(taskResponse.data);
                } else {
                    console.log('Error fetching tasks');
                }

                // Fetch users for assignment
                const usersResponse = await axios.get(`http://localhost:${PORT}/api/users`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });

                if (usersResponse) {
                    setUsers(usersResponse.data);
                } else {
                    console.log('Error fetching users');
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, [PORT]);

    const handleCreateTask = async () => {
        try {
            const response = await axios.post(`http://localhost:${PORT}/api/tasks`, newTask, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });

            if (response.data) {
                setTasks([...tasks, response.data]);
                setNewTask({
                    title: '',
                    description: '',
                    assignedTo: [],
                    priority: '',
                    dueDate: ''
                });
                
            } else {
                console.log('Error creating task');
            }
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    

    const handleDeleteTask = async (taskId) => {
        try {
            const response = await axios.delete(`http://localhost:${PORT}/api/tasks/${taskId}`, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });

            if (response.data) {
                const updatedTasks = tasks.filter(task => task._id !== taskId);
                setTasks(updatedTasks);
            } else {
                console.log('Error deleting task');
            }
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const handleAssignTask = (userId) => {
        setNewTask({ ...newTask, assignedTo: [userId] });
    };

    return (
        <div>
            <h3>Tasks</h3>
            <div>
                <h4>Create Task</h4>
                <input type="text" placeholder="Title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
                <input type="text" placeholder="Description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
                <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}>
                    <option value="">Select Priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
                <input type="date" placeholder="Due Date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} />
                <select value={newTask.assignedTo} onChange={(e) => handleAssignTask(e.target.value)}>
                    <option value="">Assign To</option>
                    {users.map(user => (
                        <option key={user._id} value={user._id}>{user.username}</option>
                    ))}
                </select>

                <button onClick={handleCreateTask}>Create Task</button>
            </div>
            {editingTask ? (
                <TaskEdit users = {users} 
                        editingTask = {editingTask} setEditingTask={setEditingTask}
                        tasks = {tasks} setTasks= {setTasks}/>
            ) : null}
            {tasks ? (
                <table>
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
                        {tasks.map((task) => (
                            <tr key={task._id}>
                                <td>{task.title}</td>
                                <td>{task.createdBy.username}</td>
                                <td>{task.status}</td>
                                <td>{task.priority}</td>
                                <td>
                                    <Link to={`/task/${task._id}`}>View</Link>

                                    <button onClick={() => setEditingTask(task)}>Edit</button>

                                    {task.createdBy.id == user.account._id && 
                                    <button onClick={() => handleDeleteTask(task._id)}>Delete</button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No tasks found</p>
            )}
        </div>
    );
}

export default Tasks;