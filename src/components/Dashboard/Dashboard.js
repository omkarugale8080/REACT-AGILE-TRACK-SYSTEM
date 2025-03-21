import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ScrumDetails from '../Scrum Details/ScrumDetails';
import { UserContext } from '../../context/UserContext';
// Make sure to include Bootstrap in your project
// Add this to your index.html: 
// <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

const Dashboard = () => {
    const [scrums, setScrums] = useState([]);
    const [selectedScrum, setSelectedScrum] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [users, setUsers] = useState([]);
    const [newScrumName, setNewScrumName] = useState('');
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskStatus, setNewTaskStatus] = useState('To Do');
    const [newTaskAssignedTo, setNewTaskAssignedTo] = useState('');
    const { user } = useContext(UserContext);

    // useEffect remains the same
    useEffect(() => {
        const fetchScrums = async () => {
            try {
                const response = await axios.get('http://localhost:4000/scrums');
                setScrums(response.data);
            } catch (error) {
                console.error('Error fetching scrums:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:4000/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchScrums();
        fetchUsers();
    }, []);

    // Event handlers remain the same
    const handleGetDetails = async (scrumId) => {
        try {
            const response = await axios.get(`http://localhost:4000/scrums/${scrumId}`);
            setSelectedScrum(response.data);
        } catch (error) {
            console.error('Error fetching scrum details:', error);
        }
    };

    const handleAddScrum = async (event) => {
        event.preventDefault();
        try {
            const newScrumResponse = await axios.post('http://localhost:4000/scrums', {
                name: newScrumName,
            });

            const newScrum = newScrumResponse.data;

            const newTaskResponse = await axios.post('http://localhost:4000/tasks', {
                title: newTaskTitle,
                description: newTaskDescription,
                status: newTaskStatus,
                scrumId: newScrum.id,
                assignedTo: newTaskAssignedTo,
                history: [
                    {
                        status: newTaskStatus,
                        date: new Date().toISOString().split('T')[0],
                    },
                ],
            });

            const updatedScrums = await axios.get('http://localhost:4000/scrums');
            setScrums(updatedScrums.data);
            setShowForm(false);
            setNewScrumName('');
            setNewTaskTitle('');
            setNewTaskDescription('');
            setNewTaskStatus('To Do');
            setNewTaskAssignedTo('');
        } catch (error) {
            console.error('Error adding scrum:', error);
        }
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4 text-primary">Scrum Teams</h2>
            
            {user?.role === 'admin' && (
                <div className="mb-4">
                    <button 
                        className={`btn ${showForm ? 'btn-danger' : 'btn-primary'} mb-3`}
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? 'Cancel' : 'Add New Scrum'}
                    </button>

                    {showForm && (
                        <form onSubmit={handleAddScrum} className="card p-4 shadow">
                            <div className="mb-3">
                                <label className="form-label">Scrum Name:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newScrumName}
                                    onChange={(e) => setNewScrumName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Task Title:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Task Description:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newTaskDescription}
                                    onChange={(e) => setNewTaskDescription(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Task Status:</label>
                                <select
                                    className="form-select"
                                    value={newTaskStatus}
                                    onChange={(e) => setNewTaskStatus(e.target.value)}
                                    required
                                >
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Assign To:</label>
                                <select
                                    className="form-select"
                                    value={newTaskAssignedTo}
                                    onChange={(e) => setNewTaskAssignedTo(e.target.value)}
                                    required
                                >
                                    <option value="">Select a user</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="btn btn-success">
                                Create Scrum
                            </button>
                        </form>
                    )}
                </div>
            )}

            <div className="card shadow">
                <ul className="list-group list-group-flush">
                    {scrums.map((scrum) => (
                        <li 
                            key={scrum.id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                        >
                            <span>{scrum.name}</span>
                            <button 
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => handleGetDetails(scrum.id)}
                            >
                                Get Details
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {selectedScrum && (
                <div className="mt-4">
                    <ScrumDetails scrum={selectedScrum} />
                </div>
            )}
        </div>
    );
};

export default Dashboard;