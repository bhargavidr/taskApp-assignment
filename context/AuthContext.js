import React, { createContext, useContext, useState } from 'react';

// Create context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to handle user login
  const handleLogin = (userData) => {
    // Your login logic here
    setUser(userData);
  };

  // Function to handle user logout
  const handleLogout = () => {
    // Your logout logic here
    setUser(null);
  };

  // Value object to be provided by context
  const value = {
    user,
    handleLogin,
    handleLogout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
