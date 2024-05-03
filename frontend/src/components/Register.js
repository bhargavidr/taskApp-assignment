import React, { useState } from 'react';
import axios from 'axios';
import validator from 'validator';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'

export default function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [serverErrors, setServerErrors] = useState(null);
    const [clientErrors, setClientErrors] = useState({});

    const errors = {};

    const {PORT} = useAuth()

    const runValidations = () => {
        if (username.trim().length === 0) {
            errors.username = 'Username is required';
        }

        if (email.trim().length === 0) {
            errors.email = 'Email is required';
        } else if (!validator.isEmail(email)) {
            errors.email = 'Invalid email format';
        }

        if (password.trim().length === 0) {
            errors.password = 'Password is required';
        } else if (password.trim().length < 8 || password.trim().length > 128) {
            errors.password = 'Password should be between 8 - 128 characters';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            username,
            email,
            password
        };

        runValidations();

        if (Object.keys(errors).length === 0) {
            try {
                const response = await axios.post(`http://localhost:${PORT}/api/users/register`, formData);
                navigate('/login');
            } catch (err) {
                setServerErrors(err.response.data.details);
                // console.log(err)
            }
        } else {
            setClientErrors(errors);
        }
    };

    return (
        <div>
            <h2>Register With Us</h2>

            {serverErrors && (
                <div>
                    <h3>These errors prohibited the form from being saved: </h3>
                    <ul>
                        {serverErrors.map((ele, i) => (
                            <li key={i}> {ele.message} </li>
                        ))}
                    </ul>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Enter username</label><br />
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    id="username"
                />
                {clientErrors.username && <span> {clientErrors.username}</span>}
                <br />

                <label htmlFor="email">Enter email</label><br />
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                />
                {clientErrors.email && <span> {clientErrors.email}</span>}
                <br />

                <label htmlFor="password">Enter Password</label><br />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                />
                {clientErrors.password && <span> {clientErrors.password}</span>}
                <br />

                <input type="submit" />
            </form>
        </div>
    );
}

