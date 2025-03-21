import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:4000/users', {
                name,
                email,
                password,
                role: 'employee'
            });
            history.push('/login');
        } catch (error) {
            console.error('Error signing up:', error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card mx-auto" style={{ maxWidth: '400px', backgroundColor: '#e3f2fd', borderColor: '#bbdefb' }}>
                <div className="card-header text-center bg-primary text-white">
                    <h2>Sign Up</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSignUp}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label" style={{ color: '#1976d2' }}>Name</label>
                            <input
                                type="text"
                                id="name"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                style={{ backgroundColor: '#e1f5fe', borderColor: '#bbdefb', color: '#0d47a1' }}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label" style={{ color: '#1976d2' }}>Email</label>
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ backgroundColor: '#e1f5fe', borderColor: '#bbdefb', color: '#0d47a1' }}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label" style={{ color: '#1976d2' }}>Password</label>
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ backgroundColor: '#e1f5fe', borderColor: '#bbdefb', color: '#0d47a1' }}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;