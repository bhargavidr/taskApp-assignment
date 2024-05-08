import axios from 'axios';
import {useState} from 'react'
import { useAuth } from '../context/AuthContext';
import MultiSelect from 'multiselect-react-dropdown'



export default function TaskCreate(){
    const {users,user, PORT, dispatchAuth} = useAuth() 

    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        assignedTo: '',
        priority: '',
        dueDate: ''
    });
    const statuses = ['To do','In Progress','Completed']
    const priorities = ['Low','Medium','High']

    const handleCreateTask = async () => {
        try {
            const response = await axios.post(`http://localhost:${PORT}/api/tasks`, newTask, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });

            if (response.data) {
                dispatchAuth({type:'TASK', payload: response.data})
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
                {priorities.map((priority) => (
                            <label key={priority}>
                                <input
                                type="radio"
                                name="priority" // Group the radio buttons with the same name
                                value={priority}
                                checked={newTask.priority === priority} // Set checked based on editingTask.priority
                                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                />
                                {priority}
                            </label>
                ))}
                <br />
                {statuses.map((status) => (
                        <label key={status}>
                            <input
                            type="radio"
                            name="status" // Group the radio buttons with the same name
                            value={status}
                            checked={newTask.status === status} // Set checked based on newTask.status
                            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                            /> {status}
                        </label>
                ))}
                <br />
                <input type="date" placeholder="Due Date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} />
                <MultiSelect
                    showCheckbox
                    options={users.filter(ele => ele?.username !== user.account?.username)
                                    .map(ele => ({ key: ele?._id, value: ele?.username }))}
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