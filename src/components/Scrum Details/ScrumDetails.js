import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import { useHistory } from 'react-router-dom';

const ScrumDetails = ({ scrum }) => {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const { user } = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
        const checkUser = () => {
            const loggedInUser = JSON.parse(localStorage.getItem('user'));
            if (!loggedInUser) {
                history.push('/login');
            }
        };

        checkUser();
    }, [history]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/tasks?scrumId=${scrum.id}`);
                console.log('Fetched tasks:', response.data); // Debug: Log tasks
                setTasks(response.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();
    }, [scrum.id]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:4000/users');
                console.log('Fetched users:', response.data); // Debug: Log users
                const allUsers = response.data;
                if (tasks.length > 0) {
                    const scrumUsers = allUsers.filter(user =>
                        tasks.some(task => task.assignedTo && task.assignedTo.toString() === user.id.toString())
                    ); // Ensure string comparison
                    console.log('Filtered users for tasks:', scrumUsers); // Debug: Log filtered users
                    setUsers(scrumUsers);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        if (tasks.length > 0) {
            fetchUsers();
        }
    }, [tasks]);

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await axios.patch(`http://localhost:4000/tasks/${taskId}`, {
                status: newStatus,
                history: [
                    ...tasks.find(task => task.id === taskId).history,
                    {
                        status: newStatus,
                        date: new Date().toISOString().split('T')[0],
                    },
                ],
            });

            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === taskId ? { ...task, status: newStatus } : task
                )
            );
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card text-dark" style={{ backgroundColor: '#e3f2fd', borderColor: '#bbdefb' }}>
                <div className="card-header bg-primary text-white">
                    <h3 className="mb-0">Scrum Details for {scrum.name}</h3>
                </div>
                <div className="card-body">
                    <h4 className="card-title mt-3" style={{ color: '#1976d2' }}>Tasks</h4>
                    <ul className="list-group">
                        {tasks.length > 0 ? (
                            tasks.map(task => (
                                <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center" style={{ backgroundColor: '#e1f5fe', borderColor: '#bbdefb' }}>
                                    <div>
                                        <strong>{task.title}:</strong> {task.description} - <em className={task.status === 'Done' ? 'text-success' : task.status === 'In Progress' ? 'text-warning' : 'text-secondary'}>{task.status}</em>
                                    </div>
                                    {user?.role === 'admin' && (
                                        <select
                                            value={task.status}
                                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                            className="form-select form-select-sm"
                                            style={{ backgroundColor: '#e1f5fe', borderColor: '#bbdefb', color: '#0d47a1' }}
                                        >
                                            <option value="To Do">To Do</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Done">Done</option>
                                        </select>
                                    )}
                                </li>
                            ))
                        ) : (
                            <div className="alert alert-info">No tasks available</div>
                        )}
                    </ul>

                    <h4 className="card-title mt-3" style={{ color: '#1976d2' }}>Users</h4>
                    <ul className="list-group">
                        {users.length > 0 ? (
                            users.map(user => (
                                <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center" style={{ backgroundColor: '#e1f5fe', borderColor: '#bbdefb' }}>
                                    {user.name} ({user.email})
                                </li>
                            ))
                        ) : (
                            <div className="alert alert-info">No users assigned</div>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ScrumDetails;