import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {Navigate} from 'react-router-dom'
import axios from 'axios';

function Account() {
    const { user, dispatchAuth, PORT } = useAuth();
    const [editMode, setEditMode] = useState(false);
    const [editedUser, setEditedUser] = useState(user.account);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [profileDeleted, setProfileDeleted] = useState(false);

    // Update editedUser whenever user.account changes
    useEffect(() => {
        setEditedUser(user.account);
    }, [user.account]);

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleDelete = async () => {
        try {
          if(window.confirm("Are you sure?")){
            await axios.delete(`http://localhost:${PORT}/api/users`, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            dispatchAuth({type:'LOGOUT'})
            setProfileDeleted(true);

          }else{
            alert("Deletion cancelled")
          }
        } catch (error) {
            console.error('Error deleting user:', error);            
        }
    };
    

    const handleChange = (e) => {
        setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const editedResponse = await axios.put(`http://localhost:${PORT}/api/users/${user.account._id}`, editedUser, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
    
            // Update user data and exit edit mode
         
            dispatchAuth({ type: 'LOGIN', payload: editedResponse.data.user });
            // console.log(editedResponse.data, 'updatedUserData')
    
            setEditMode(false);
            setSaveSuccess(true); 
            setTimeout(() => setSaveSuccess(false), 2000); 
        } catch (error) {
            console.error('Error updating user:', error);
            // Handle error, such as showing an error message to the user
        }
    };
    

    return (
        <div>
            <h3>Account</h3>
                <>  
                {profileDeleted && <Navigate to="/login" />}
                    {editMode ? (
                        <div>
                            <input type="text" name="username" value={editedUser.username} onChange={handleChange} />
                            <input type="email" name="email" value={editedUser.email} onChange={handleChange} />
                            
                            <button onClick={handleSubmit}>Save</button>
                        </div>
                    ) : (
                        <div>
                            {saveSuccess ? (
                                <p>Profile updated successfully! Redirecting back to account page...</p>
                            ) : (
                                <>
                                    {user.account ? (
                                        <div>
                                          
                                            <p>Welcome {user.account.username}</p>
                                            <p>Email: {user.account.email}</p>
                                            {/* Display other user profile information */}
                                            <button onClick={handleEdit}>Edit</button>
                                            <button onClick={handleDelete}>Delete</button>
                                        </div>
                                    ) : (
                                        <p>Account not found</p>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                
                </>
            
        </div>
    );
}

export default Account;
