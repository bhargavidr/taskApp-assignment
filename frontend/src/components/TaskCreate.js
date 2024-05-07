import axios from 'axios';
import {useState} from 'react'
import { useAuth } from '../context/AuthContext';
import MultiSelect from 'multiselect-react-dropdown'

// import './assignedToCheckbox.css'


export default function TaskCreate(props){
    const {users, PORT} = useAuth() 
    

    const { newTask, setNewTask, setTasks, tasks} = props


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
                    dueDate: '',
                    status: ''
                });
                
            } else {
                console.log('Error creating task');
            }
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    const handleAssignTask = (usersList) => {
        setNewTask({ ...newTask, assignedTo: usersList });
    };

    
    return(
        <div>
                <h4>Create Task</h4>
                <input type="text" placeholder="Title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
                <br /> 
                <textarea placeholder="Description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}/>
                <br />
                <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}>
                    <option value="">Select Priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
                <br />
                <select value={newTask.status} onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}>
                    <option value="">Select Status</option>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
                <br />
                <input type="date" placeholder="Due Date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} />
                <MultiSelect
                    showCheckbox
                    options={users.map(user => ({ key: user._id, value: user.username }))}
                    onSelect={(selectedList) => handleAssignTask(selectedList.map(item => item.key))}
                    onRemove={(selectedList) => handleAssignTask(selectedList.map(item => item.key))}
                    displayValue="value"
                    placeholder="Assign To"
                    style={{}}
                />

                <button onClick={handleCreateTask}>Create Task</button>
            </div>
    )
}