import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const fetchUsers = async (currentPage) => {
        try {
            const response = await axios.get(`https://reqres.in/api/users?page=${currentPage}`);
            setUsers(response.data.data);
            setTotalPages(response.data.total_pages);
            localStorage.setItem("users", JSON.stringify(response.data.data)); // Save new users to localStorage
        } catch (err) {
            console.error("Error fetching users", err);
        }
    };    

    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem("users"));

        if (storedUsers && storedUsers.length > 0) {
            setUsers(storedUsers);
        } else {
            fetchUsers(page); // If local storage is empty, refetch users
        }
    }, [page]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleDelete = (id) => {
        const updatedUsers = users.filter(user => user.id !== id);
        setUsers(updatedUsers);
        localStorage.setItem("users", JSON.stringify(updatedUsers));
    };

    const handleResetUsers = () => {
        fetchUsers();
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center">Users List</h2>
            <button className="btn btn-danger mb-3" onClick={handleLogout}>
                Logout
            </button>
            <button className="btn btn-primary mb-3 ms-3" onClick={handleResetUsers}>
                Reset Users
            </button>
            <div className="row">
                {users.map((user) => (
                    <div className="col-md-4" key={user.id}>
                        <div className="card mb-3">
                            <img src={user.avatar} className="card-img-top" alt="Avatar" />
                            <div className="card-body">
                                <h5 className="card-title">{user.first_name} {user.last_name}</h5>
                                <p className="card-text">{user.email}</p>
                                <button className="btn btn-warning me-2" onClick={() => navigate(`/edit/${user.id}`)}>
                                    Edit
                                </button>
                                <button className="btn btn-danger" onClick={() => handleDelete(user.id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="d-flex justify-content-between mt-2">
                <button
                    className="btn btn-secondary "
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Previous
                </button>
                <button
                    className="btn btn-secondary"
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default UsersPage;