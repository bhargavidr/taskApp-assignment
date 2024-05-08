import axios from 'axios';
import {useState} from 'react'
import { useAuth } from '../context/AuthContext';
import MultiSelect from 'multiselect-react-dropdown'
import './styling.css'


export default function TaskCreate(){
    const {users,user, PORT, dispatchAuth} = useAuth() 

    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        assignedTo: '',
        priority: '',
        dueDate: '',
        status:'',
    });
    const errors = {}
    const [serverErrors, setServerErrors] = useState(null);
    const [clientErrors, setClientErrors] = useState({});

    const statuses = ['To Do','In Progress','Completed']
    const priorities = ['Low','Medium','High']

    const runClientValidations = () => {
        
        if (newTask.title.trim().length === 0) {
            errors.title = 'Title is required';
        }
        if (newTask.description.trim().length === 0) {
            errors.description = 'Description is required';
        }
        if (!newTask.dueDate) {
            errors.date = 'Date is required';
        }
        
    }

    const handleCreateTask = async () => {

        runClientValidations()

        if (Object.keys(errors).length === 0){

            setClientErrors({})
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
                setServerErrors(null)      

            } else {
                console.log('Error creating task');
            }
        } catch (error) {
            setServerErrors(error.response.data)
        }
        }else{
            setClientErrors(errors);
        }
    };

    const handleAssignTask = (usersList) => {
        if(usersList.length == 0){
            setNewTask({...newTask, assignedTo: []})
        }else{
            setNewTask({ ...newTask, assignedTo: usersList });
        }
    };

    
    return(
        <> 
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

            <div>
                <h4>Create Task</h4>
                <input type="text" placeholder="Title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
                {clientErrors.title && <span className='error'> {clientErrors.title}</span>}
                <br /> 

                <textarea placeholder="Description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}/>
                {clientErrors.description && <span className='error'> {clientErrors.description}</span>}
                <br />

                {priorities.map((priority) => (
                            <label key={priority}>
                                <input
                                type="radio"
                                name="priority" 
                                value={priority}
                                checked={newTask.priority === priority} 
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
                            checked={newTask.status === status} 
                            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                            /> {status}
                        </label>
                ))}
                <br />

                <input type="date" placeholder="Due Date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} />
                {clientErrors.date && <span className='error'> {clientErrors.date}</span>}
                <br />

                <div className='multi-select-container'>
                <MultiSelect
                    showCheckbox
                    options={users.filter(ele => ele?.username !== user.account?.username)
                                    .map(ele => ({ key: ele?._id, value: ele?.username }))}
                    onSelect={(selectedList) => handleAssignTask(selectedList.map(item => item.key))}
                    onRemove={(selectedList) => handleAssignTask(selectedList.map(item => item.key))}
                    displayValue="value"
                    placeholder="Assign To"
                    style={{}}
                /></div>

                <button onClick={handleCreateTask}>Create Task</button>
            </div>
        </>
    )
}