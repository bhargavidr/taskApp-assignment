import { useState } from 'react';
import validator from 'validator';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const { handleLogin } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: '',
        password: '',
        serverErrors: null,
        clientErrors: {}
    });

    const errors = {};

    const runValidations = () => {
        if (form.email.trim().length === 0) {
            errors.email = 'Email is required';
        } else if (!validator.isEmail(form.email)) {
            errors.email = 'Invalid email format';
        }

        if (form.password.trim().length === 0) {
            errors.password = 'Password is required';
        } else if (form.password.trim().length < 8 || form.password.trim().length > 128) {
            errors.password = 'Invalid password length';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = _.pick(form, ['email', 'password']);

        runValidations();

        if (Object.keys(errors).length === 0) {
            try {
                const response = await axios.post('YOUR_LOGIN_ENDPOINT', formData); // Replace 'YOUR_LOGIN_ENDPOINT' with your actual login endpoint
                localStorage.setItem('token', response.data.token);
                const userResponse = await axios.get('YOUR_ACCOUNT_ENDPOINT', {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                handleLogin(userResponse.data);
                navigate('/');
            } catch (err) {
                setForm({ ...form, serverErrors: err.response.data.errors, clientErrors: {} });
            }
        } else {
            setForm({ ...form, clientErrors: errors });
        }
    };

    const handleChange = (e) => {
        const { value, name } = e.target;
        setForm({ ...form, [name]: value });
    };

    const displayErrors = () => {
        let result;
        if (typeof form.serverErrors === 'string') {
            result = <p> {form.serverErrors} </p>;
        } else {
            result = (
                <div>
                    <h3>These errors prohibited the form from being saved: </h3>
                    <ul>
                        {form.serverErrors.map((ele, i) => {
                            return <li key={i}> {ele.msg} </li>;
                        })}
                    </ul>
                </div>
            );
        }
        return result;
    };

    return (
        <div>
            <h2>Login</h2>
            {form.serverErrors && displayErrors()}
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Enter email</label><br />
                <input
                    type="text"
                    value={form.email}
                    onChange={handleChange}
                    name="email"
                    id="email"
                />
                {form.clientErrors.email && <span> {form.clientErrors.email} </span>}
                <br />

                <label htmlFor="password">Enter password</label><br />
                <input
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    name="password"
                    id="password"
                />
                {form.clientErrors.password && <span> {form.clientErrors.password} </span>}
                <br />

                <input type="submit" />
            </form>
        </div>
    );
}

