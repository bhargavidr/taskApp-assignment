import axios from 'axios';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import MultiSelect from 'multiselect-react-dropdown';


export default function TaskEdit(props) {
    const { users, user, PORT, dispatchAuth } = useAuth();
    const { setEditingTask, editingTask} = props

    const errors = {}
    const [serverErrors, setServerErrors] = useState(null);
    const [clientErrors, setClientErrors] = useState({});

    //for radio buttons
    const statuses = ['To do','In Progress','Completed']
    const priorities = ["Low", "Medium", "High"];


    const runClientValidations = () => {
        
        
        if (editingTask.title.trim().length === 0) {
            errors.title = 'Title is required';
        }
        if (editingTask.description.trim().length === 0) {
            errors.description = 'Description is required';
        }        
    }


    const handleEditTask = async (e) => {
        console.log(editingTask.title, 'title')

        runClientValidations()

        if(Object.keys(errors).length === 0){
            setClientErrors({})
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
                const updatedTasks = user.tasks.map((task) => {
                    if (task._id === _id) {
                        return response.data;
                    }
                    return task;
                });
                dispatchAuth({type:'TASK', payload: updatedTasks})
                setEditingTask(null);
                setServerErrors(null)
            } else {
                console.log('Error editing task');
            }
        } catch (error) {
            setServerErrors(error.response.data.details)
        }
        }else{
            setClientErrors(errors)
        }

    };

    const handleAssignTask = (usersList) => {
        setEditingTask({ ...editingTask, assignedTo: usersList });
    };

    const preSelectedUsers = editingTask.assignedTo.map(ele => {
        let user = users.find(user => user._id == ele);
        return user ? { key: ele, value: user.username } : null;
    }).filter(Boolean);
    
    

    return(
        <div>
                    <h4>Edit Task</h4>

            {serverErrors && (
                <div>
                    <h4 className="error">Errors: </h4>
                    <ul>
                        {serverErrors.map((ele, i) => (
                            <li key={i}> {ele.message} </li>
                        ))}
                    </ul>
                </div>
            )}
                    
                    <input type="text" placeholder="Title" value={editingTask.title} onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })} />
                    {clientErrors.title && <span className='error'> {clientErrors.title}</span>}
                    <br />

                    <textarea placeholder="Description" value={editingTask.description} onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })} />
                    {clientErrors.description && <span className='error'> {clientErrors.description}</span>}
                    <br />

                    {priorities.map((priority) => (
                            <label key={priority}>
                                <input
                                type="radio"
                                name="priority" // Group the radio buttons with the same name
                                value={priority}
                                checked={editingTask.priority === priority} // Set checked based on editingTask.priority
                                onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
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
                            checked={editingTask.status === status} // Set checked based on newTask.status
                            onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
                            /> {status}
                        </label>
                ))}
                <br />

                <input type="date" placeholder="Due Date" value={editingTask.dueDate} onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })} />

                {editingTask.createdBy.id == user.account._id && (
                     <div className='multi-select-container'>
                        <MultiSelect
                        showCheckbox
                        options={users.filter(ele => ele?.username !== user.account?.username)
                                    .map(ele => ({ key: ele._id, value: ele.username }))}
                        onSelect={(selectedUsers) => handleAssignTask(selectedUsers.map(item => item.key))}
                        onRemove={(selectedUsers) => handleAssignTask(selectedUsers.map(item => item.key))}
                        displayValue="value"
                        placeholder="Assign To"
                        selectedValues={preSelectedUsers}
                        style={{}}
                    /></div>
                )}

                <button onClick={(e) => handleEditTask()}>Save</button>
                <br /> <br />
                </div>
                
    )
}