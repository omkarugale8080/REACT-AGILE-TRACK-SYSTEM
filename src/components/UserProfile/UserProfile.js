import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';

const UserProfile = () => {
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [newUserRole, setNewUserRole] = useState('employee');
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:4000/users');
                if (user?.role === 'admin') {
                    setUsers(response.data.filter(user => user?.role !== 'admin'));
                } else {
                    setSelectedUser(user);
                    fetchTasks(user?.id);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, [user]);

    const fetchTasks = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:4000/tasks?assignedTo=${userId}`);
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleGetHistory = (userId) => {
        setSelectedUser(users.find(user => user?.id === userId));
        fetchTasks(userId);
    };

    const handleAddUser = async (event) => {
        event.preventDefault();

        try {
            await axios.post('http://localhost:4000/users', {
                name: newUserName,
                email: newUserEmail,
                password: newUserPassword,
                role: newUserRole,
            });

            const updatedUsers = await axios.get('http://localhost:4000/users');
            setUsers(updatedUsers.data.filter(user => user?.role !== 'admin'));
            setShowForm(false); // Hide the form after submission
            setNewUserName('');
            setNewUserEmail('');
            setNewUserPassword('');
            setNewUserRole('employee');
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card" style={{ backgroundColor: '#e3f2fd', borderColor: '#bbdefb' }}>
                <div className="card-header bg-primary text-white text-center">
                    <h2>User Profiles</h2>
                </div>
                <div className="card-body">
                    {user?.role === 'admin' && (
                        <div>
                            <button
                                className="btn btn-primary mb-3"
                                onClick={() => setShowForm(!showForm)}
                            >
                                {showForm ? 'Cancel' : 'Add New User'}
                            </button>
                            {showForm && (
                                <form onSubmit={handleAddUser} className="needs-validation" noValidate>
                                    <div className="mb-3">
                                        <label htmlFor="newUserName" className="form-label" style={{ color: '#1976d2' }}>Name</label>
                                        <input
                                            type="text"
                                            id="newUserName"
                                            className="form-control"
                                            value={newUserName}
                                            onChange={(e) => setNewUserName(e.target.value)}
                                            required
                                            style={{ backgroundColor: '#e1f5fe', borderColor: '#bbdefb', color: '#0d47a1' }}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="newUserEmail" className="form-label" style={{ color: '#1976d2' }}>Email</label>
                                        <input
                                            type="email"
                                            id="newUserEmail"
                                            className="form-control"
                                            value={newUserEmail}
                                            onChange={(e) => setNewUserEmail(e.target.value)}
                                            required
                                            style={{ backgroundColor: '#e1f5fe', borderColor: '#bbdefb', color: '#0d47a1' }}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="newUserPassword" className="form-label" style={{ color: '#1976d2' }}>Password</label>
                                        <input
                                            type="password"
                                            id="newUserPassword"
                                            className="form-control"
                                            value={newUserPassword}
                                            onChange={(e) => setNewUserPassword(e.target.value)}
                                            required
                                            style={{ backgroundColor: '#e1f5fe', borderColor: '#bbdefb', color: '#0d47a1' }}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="newUserRole" className="form-label" style={{ color: '#1976d2' }}>Role</label>
                                        <select
                                            id="newUserRole"
                                            className="form-select"
                                            value={newUserRole}
                                            onChange={(e) => setNewUserRole(e.target.value)}
                                            required
                                            style={{ backgroundColor: '#e1f5fe', borderColor: '#bbdefb', color: '#0d47a1' }}
                                        >
                                            <option value="employee">Employee</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="btn btn-primary">Create User</button>
                                </form>
                            )}
                            <ul className="list-group">
                                {users.map(user => (
                                    <li key={user?.id} className="list-group-item" style={{ backgroundColor: '#e1f5fe', borderColor: '#bbdefb' }}>
                                        <strong style={{ color: '#1976d2' }}>Name:</strong> {user?.name} <br />
                                        <strong style={{ color: '#1976d2' }}>Email:</strong> {user?.email} <br />
                                        <button
                                            className="btn btn-primary btn-sm mt-2"
                                            onClick={() => handleGetHistory(user?.id)}
                                        >
                                            Get History
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {user?.role !== 'admin' && (
                        <div>
                            <h3 className="mt-3" style={{ color: '#1976d2' }}>Tasks Worked By {user?.name}</h3>
                            <ul className="list-group">
                                {tasks.map(task => (
                                    <li key={task.id} className="list-group-item" style={{ backgroundColor: '#e1f5fe', borderColor: '#bbdefb' }}>
                                        <strong style={{ color: '#1976d2' }}>Title:</strong> {task.title} <br />
                                        <strong style={{ color: '#1976d2' }}>Description:</strong> {task.description} <br />
                                        <strong style={{ color: '#1976d2' }}>Status:</strong> {task.status}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {selectedUser && user?.role === 'admin' && (
                        <div>
                            <h3 className="mt-3" style={{ color: '#1976d2' }}>Tasks Worked By {selectedUser.name}</h3>
                            <ul className="list-group">
                                {tasks.map(task => (
                                    <li key={task.id} className="list-group-item" style={{ backgroundColor: '#e1f5fe', borderColor: '#bbdefb' }}>
                                        <strong style={{ color: '#1976d2' }}>Title:</strong> {task.title} <br />
                                        <strong style={{ color: '#1976d2' }}>Description:</strong> {task.description} <br />
                                        <strong style={{ color: '#1976d2' }}>Status:</strong> {task.status}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;