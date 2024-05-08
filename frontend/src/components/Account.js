import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {Navigate} from 'react-router-dom'
import axios from 'axios';
import validator from 'validator';

function Account() {
    const { user, dispatchAuth, PORT } = useAuth();
    const [editMode, setEditMode] = useState(false);
    const [editedUser, setEditedUser] = useState(user.account);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [profileDeleted, setProfileDeleted] = useState(false);
    const[clientErrors,setClientErrors] = useState({})

    const errors = {};

    const runValidations = () => {

        if (editedUser.username.trim().length === 0) {
            errors.username = 'Username cannot be empty';
        }else if(editedUser.username.trim() == user.account.username){
            errors.username = 'Username is the same';
        }

        if (editedUser.email.trim().length === 0) {
            errors.email = 'Email is required';
        } else if(editedUser.email.trim() == user.account.email){
            errors.email = 'Email is the same';
        }else if (!validator.isEmail(editedUser.email)) {
            errors.email = 'Invalid email format';
        }

    };

    // Update editedUser whenever user.account changes
    useEffect(() => {
        setEditedUser(user.account);
    }, [user.account]);

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleBack = () => {
        setEditMode(false); 
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
        runValidations()

        if(Object.keys(errors).length == 0){
            try {
                const editedResponse = await axios.put(`http://localhost:${PORT}/api/users/${user.account._id}`, editedUser, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                 
                dispatchAuth({ type: 'LOGIN', payload: editedResponse.data.user });
                // console.log(editedResponse.data, 'updatedUserData')    
                setEditMode(false);
                setSaveSuccess(true); 
                setClientErrors({})
                setTimeout(() => setSaveSuccess(false), 2000); 
            } catch (error) {
                console.error('Error updating user:', error);
            }
        }else{
            setClientErrors(errors)
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
                            {clientErrors.username && <span className='error'> {clientErrors.username}</span>}
                            <br />
                            <input type="email" name="email" value={editedUser.email} onChange={handleChange} />
                            {clientErrors.email && <span className='error'> {clientErrors.email}</span>}
                            <br />
                            
                            <button onClick={handleSubmit}>Save</button>
                            <button onClick={handleBack}> Back</button>
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
