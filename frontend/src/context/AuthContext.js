import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';
import axios from 'axios';

// Create context
const AuthContext = createContext();

const reducer = (state, action) => {
    switch(action.type) {
        case 'LOGIN' : {
            return {...state, isLoggedIn: true, account: action.payload}
        }
        case 'LOGOUT' : {
            return {...state, isLoggedIn: false, account: null, tasks: null } 
        }
        case 'TASK' : {
            return {...state, tasks: action.payload}
        }
        default: {
            return {...state} 
        }
    }
}

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [user, dispatchAuth] = useReducer(reducer, {
        isLoggedIn: false, 
        account: null, 
        tasks:null
    })

    const [users, setUsers] = useState([]);
    const PORT = 5000

    useEffect(()=> {
        //get all users data
        async function getUsers(){
            try {
                const usersResponse = await axios.get(`http://localhost:${PORT}/api/users`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });

                if (usersResponse) {
                    setUsers(usersResponse.data);
                } else {
                    console.log('Error fetching users');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
        getUsers()

    },[users, user.account, user.tasks])

    return (
        <AuthContext.Provider value={{ PORT, user, dispatchAuth, users }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    return useContext(AuthContext);
};
