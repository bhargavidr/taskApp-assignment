import React from 'react';
import { useAuth } from '../context/AuthContext';

function Account() {
    const {user} = useAuth()
    // console.log(user.account)
  return (
    <div>
      <h3>Account</h3>
      {user.account && <p>Welcome {user.account.username}</p> }
    </div>
  );
}

export default Account;