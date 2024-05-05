import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Account from "./components/Account"; 
import Tasks from "./components/Tasks"
import TaskDetails from "./components/TaskDetails"; // Import the TaskDetails component
import { useAuth } from './context/AuthContext';

function App() {
  const { user, dispatch } = useAuth();

  return (
    <div>
      <h2>Task Management App</h2>
      <Link to="/">Home</Link> |
      {!user.isLoggedIn ? (
        <>
          <Link to="/register">Register</Link> |
          <Link to="/login"> Login </Link> |
        </>
      ) : (
        <>
          <Link to="/tasks">Tasks</Link> |
          <Link to="/account">Account</Link> |
          <Link to="/" onClick={() => {
            localStorage.removeItem('token');
            dispatch('LOGOUT');
          }}> Logout </Link> |
        </>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />} /> 
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/task/:taskId" element={<TaskDetails />} /> {/* Add this route for task details */}
      </Routes>
    </div>
  );
}

export default App;
