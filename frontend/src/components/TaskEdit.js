import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import MultiSelect from 'multiselect-react-dropdown';

export default function TaskEdit(props) {
    const { users, user, PORT } = useAuth();
    const { setEditingTask, editingTask, setTasks, tasks} = props

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
                // console.log(response.data)
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

    const handleAssignTask = (usersList) => {
        setEditingTask({ ...editingTask, assignedTo: usersList });
    };

    const preSelectedUsers = editingTask.assignedTo.map(ele => {
        let user = users.find(user => user._id == ele)
        return {key: ele, value: user.username}
    })
    

    return(
        <div>
                    <h4>Edit Task</h4>
                    
                    <input type="text" placeholder="Title" value={editingTask.title} onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })} />
                    <br />
                    <textarea placeholder="Description" value={editingTask.description} onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })} />
                    <br />
                    <select value={editingTask.priority} onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}>
                        <option value="">Select Priority</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                    <br />
                    <select value={editingTask.status} onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}>
                    <option value="">Select Status</option>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Complete</option>
                </select>
                <br />
                <input type="date" placeholder="Due Date" value={editingTask.dueDate} onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })} />
                {editingTask.createdBy.id == user.account._id && (
                        <MultiSelect
                        showCheckbox
                        options={users.map(ele => ({ key: ele._id, value: ele.username }))}
                        onSelect={(selectedUsers) => handleAssignTask(selectedUsers.map(item => item.key))}
                        onRemove={(selectedUsers) => handleAssignTask(selectedUsers.map(item => item.key))}
                        displayValue="value"
                        placeholder="Assign To"
                        selectedValues={preSelectedUsers}
                        style={{}}
                    />
                )}
                <button onClick={(e) => handleEditTask()}>Save</button>
                <br /> <br />
                </div>
                
    )
}