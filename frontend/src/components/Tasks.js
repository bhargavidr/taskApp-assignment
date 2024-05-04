import React from 'react';
import { useState, useEffect  } from 'react';
import {useAuth} from '../context/AuthContext'
import axios from 'axios'

function Tasks() {
    
    // const {setTasks} = useTaskAuth()
    const {user, PORT} = useAuth()
    const [tasks,setTasks] = useState(null)
    

    useEffect(() => {
        //function to fetch tasks
        async function getTasks() {
            try {
                const taskResponse = await axios.get(`http://localhost:${PORT}/api/tasks`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                        }
                    });

                    if(taskResponse){
                        setTasks(taskResponse.data);
                        console.log('taskResponse',taskResponse)
                    }else{
                        console.log('error fetching tasks')
                    }
                
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        }   

        getTasks();           

    },[])
        

  return (
    <div>
      <h3>Tasks</h3>
      {tasks ? (
        <table>
        <thead>
            <th> Title </th>
            <th> Created By </th>
            <th> Status </th>
            <th> Priority </th>
        </thead>
        <tbody>
                {tasks.map((ele) => {
                    // console.log('tasks',ele)
                    return(<tr key = {ele.id} align="center">
                        <td>{ele.title}</td>
                        <td>{ele.createdBy.username}</td>
                        <td>{ele.status}</td>
                        <td>{ele.priority}</td>

                        <button id={ele.id}>view</button>
                    </tr>)
                })}
        </tbody>
      </table>
      ) : (
        <p>no tasks found</p>
      )}
    </div>
  )
}

export default Tasks;