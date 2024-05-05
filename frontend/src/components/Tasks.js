import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Tasks() {
    const { PORT } = useAuth();
    const [tasks, setTasks] = useState(null);

    useEffect(() => {
        async function getTasks() {
            try {
                const taskResponse = await axios.get(`http://localhost:${PORT}/api/tasks`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });

                if (taskResponse) {
                    setTasks(taskResponse.data);
                } else {
                    console.log('error fetching tasks');
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        }

        getTasks();
    }, [PORT]);

    return (
        <div>
            <h3>Tasks</h3>
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
