import React, { useState } from 'react';
import { useStopwatch } from 'final-countdown-js';
import { useAuth } from '../context/AuthContext';
import axios from 'axios'

const TimeTracker = ({task, id}) => {
  const { current,currentHours, currentMinutes, currentSeconds, pause, play, reset } = useStopwatch({startPaused: true});
    const {PORT,user, dispatchAuth} = useAuth()
  const [savedTime, setSavedTime] = useState(task.timeSpent);


function padZero(num) {
    return num < 10 ? `0${num}` : num;
}

const saveTime = () => {
    // Calculate total elapsed seconds
    const totalElapsedSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;

    // Convert total saved time to seconds
    const [savedHours, savedMinutes, savedSeconds] = savedTime.split(':').map(Number);
    const totalSavedSeconds = savedHours * 3600 + savedMinutes * 60 + savedSeconds;

    // Add current time to total saved time
    const newTotalSeconds = totalElapsedSeconds + totalSavedSeconds;

    // Convert total seconds back to hh:mm:ss format
    const hours = Math.floor(newTotalSeconds / 3600);
    const minutes = Math.floor((newTotalSeconds % 3600) / 60);
    const seconds = newTotalSeconds % 60;

    const updatedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
    setSavedTime(updatedTime);
    editTaskInfo(updatedTime)

    // Reset and pause the stopwatch
    reset();
    pause();
    
}; 

const editTaskInfo = async(updatedTime) =>{
    try{
        const { title, description, priority, dueDate, status, assignedTo} = task
        const newObj = {title, description, priority, dueDate, status, assignedTo, timeSpent: updatedTime}
        // console.log(newObj, 'newObj')
        const response = await axios.put(`http://localhost:${PORT}/api/tasks/${id}`, newObj, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
    
            if (response.data) {
                // console.log(response.data)
                const updatedTasks = user.tasks.map((task) => {
                    if (task._id === id) {
                        return response.data;
                    }
                    return task;
                });
                dispatchAuth({type:'TASK', payload: updatedTasks})
            } else {
                console.log('Error editing task');
            }

    }catch(error){
        console.log('Time feature error', error)
    }
}




  return (
    <div>
        <br />
      <h2>Time Tracker</h2>
      <p><b>Click on Play to start tracking with the timer and save when you're done!</b></p>
      <p>Stopwatch: {current.withLeadingZero}</p>
      <p>Total Time spent: {savedTime}</p>
      <button onClick={pause}>Pause</button>
      <button onClick={play}>Play</button>
      <button onClick={reset}>Reset</button>
      <button onClick={saveTime}>Save</button>
    </div>
  );
};

export default TimeTracker;

