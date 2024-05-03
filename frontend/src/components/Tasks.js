import React from 'react';
import { useState, useEffect  } from 'react';
import {useAuth} from '../context/AuthContext'
import axios from 'axios'

function Tasks() {
    
    // const {setTasks} = useTaskAuth()
    const {user, PORT} = useAuth()
    const [tasks,setTasks] = useState(['No tasks found'])
    

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
                    
                    // (async() => {
                    //     const creatorsIDs = tasks.map((ele) => ele.createdBy)
                    //     console.log(creatorsIDs)
                    //     creatorsIDs.forEach(async (ele) => {
                    //             const response = await axios.get(`http://localhost:${PORT}/api/users/${ele}`)
                    //             taskResponse.creatorNames = response.data.usernames
                    //         })
                    // })();
                    setTasks(taskResponse.data);
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        }   

        getTasks();
        
        // function to get task Owner name
        

    },[])
        

  return (
    <div>
      <h3>Tasks</h3>
      <table>
        <thead>
            <th> Title </th>
            <th> Created By </th>
            <th> Status </th>
            <th> Priority </th>
        </thead>
        <tbody>
                {tasks.map((ele) => {
                    return(<tr key = {ele.id} align="center">
                        <td>{ele.title}</td>
                        <td>{ele.createdBy}</td>
                        <td>{ele.status}</td>
                        <td>{ele.priority}</td>

                        <button id={ele.id}>view</button>
                    </tr>)
                })}
        </tbody>
      </table>
    </div>
  )
}

export default Tasks;