import React from 'react';
import {useAuth} from '../context/AuthContext'
import FullCalendarComponent from './FullCalendarComponent'; 

function Home() {

  const {user} = useAuth()

  return (
    <div>
      <h3>Welcome to Task Management App</h3>

      {user.isLoggedIn ? (<div style={{ maxWidth: '800px'}}>
        <FullCalendarComponent tasks={user.tasks} />
      </div>) : (<p>Login to see your tasks, calendar and more! </p>)}
    </div>
  );
}

export default Home;