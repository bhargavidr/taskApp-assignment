import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function TaskEdit(props) {
    const { PORT } = useAuth();
    const {users, setEditingTask, editingTask, setTasks, tasks} = props

    const handleEditTask = async (e) => {

        try {
            const { _id, title, description, priority, dueDate, status, assignedTo } = editingTask; // Extract task ID and other properties

            const newObj = { title, description, priority, dueDate, status, assignedTo}

            const response = await axios.put(`http://localhost:${PORT}/api/tasks/${_id}`, newObj, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
    
            if (response.data) {
                console.log(response.data)
                const updatedTasks = tasks.map((task) => {
                    if (task._id === _id) {
                        return response.data;
                    }
                    return task;
                });
                setTasks(updatedTasks);
                setEditingTask(null);
            } else {
                console.log('Error editing task');
            }
        } catch (error) {
            console.error("Error editing task:", error);
        }

    };
    

    return(
        <div>
                    <h4>Edit Task</h4>
                    
                    <input type="text" placeholder="Title" value={editingTask.title} onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })} />
                    <input type="text" placeholder="Description" value={editingTask.description} onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })} />
                    <select value={editingTask.priority} onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}>
                        <option value="">Select Priority</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                    <input type="date" placeholder="Due Date" value={editingTask.dueDate} onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })} />
                    <select value={editingTask.assignedTo} onChange={(e) => setEditingTask({ ...editingTask, assignedTo: e.target.value })}>
                        <option value="">Assign To</option>
                        {users.map(user => (
                            <option key={user._id} value={user._id}>{user.username}</option>
                        ))}
                    </select>
                    <button onClick={(e) => handleEditTask()}>Save</button>
                    
                </div>
    )
}