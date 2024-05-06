import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function TaskCreate(props){
    const {PORT} = useAuth()
    const {users, newTask, setNewTask, setTasks, tasks} = props


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

    const handleAssignTask = (userId) => {
        setNewTask({ ...newTask, assignedTo: [userId] });
    };

    
    return(
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
    )
}