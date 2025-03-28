import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({ first_name: "", last_name: "", email: "" });

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = storedUsers.find((u) => u.id === parseInt(id));
    
    if (foundUser) {
      setUser(foundUser);
    } else {
      axios.get(`https://reqres.in/api/users/${id}`)
        .then(response => {
          setUser(response.data.data);
        })
        .catch(err => console.error("Error fetching user", err));
    }
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://reqres.in/api/users/${id}`, user);

      // Update local storage since Reqres API doesn't save data
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      const updatedUsers = storedUsers.map((u) => (u.id === parseInt(id) ? user : u));
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      alert("User updated successfully!");
      navigate("/users");
    } catch (err) {
      console.error("Error updating user", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit User</h2>
      <form onSubmit={handleUpdate}>
        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input type="text" className="form-control" value={user.first_name} onChange={(e) => setUser({ ...user, first_name: e.target.value })} />
        </div>
        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input type="text" className="form-control" value={user.last_name} onChange={(e) => setUser({ ...user, last_name: e.target.value })} />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
        </div>
        <button type="submit" className="btn btn-primary">Update</button>
      </form>
    </div>
  );
};

export default EditUserPage;
