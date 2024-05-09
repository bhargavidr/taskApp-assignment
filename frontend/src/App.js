import { Routes, Route, Link } from 'react-router-dom';
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Account from "./components/Account"; 
import Tasks from "./components/Tasks"
import TaskDetails from './components/TaskDetails'
import { useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';




function App() {
  const { user, dispatchAuth } = useAuth();

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
          <PrivateRoute>
          <Link to="/tasks">Tasks</Link> |
          <Link to="/account">Account</Link> |
          <Link to="/" onClick={() => {
            localStorage.removeItem('token');
            dispatchAuth({type:'LOGOUT'});
          }}> Logout </Link> |
            </PrivateRoute>
        </>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
         
          <Route path="/account" element={<Account />} /> 
          <Route path='/tasks' element={<Tasks />} />
          <Route path="/task/:taskId" element={<TaskDetails />} />  
              
      </Routes>

    </div>
  );
}

export default App;