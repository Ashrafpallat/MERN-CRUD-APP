import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
import { FaTrash } from 'react-icons/fa';
import image from "../../assets/image.png";
import { useSelector } from 'react-redux';



const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", profilePic: null });
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { userInfo } = useSelector((state) => state.auth);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/admin/loadUser', {
          withCredentials: true, // Ensure cookies or auth tokens are sent with the request
        });
        setUsers(response.data);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchUsers();
  }, []);

  const addUser = async () => {
    if (!/^[A-Za-z]+(?:[-' ][A-Za-z]+)*$/.test(newUser.name)) {
      toast.error("Pleae enter propper name");
      return;
    }
    const userData = {
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      // image: imageUrl,
    };

    axios
      .post("http://localhost:8000/api/users", userData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((res) => {
        setUsers([...users, res.data]);
        setShowAddUserModal(false);
        setNewUser({ name: "", email: "", password: "", profilePic: null });
        Swal.fire("Added!", "New user has been added.", "success");
      })
      .catch((err) => console.error(err));
  };

  const deleteUser = (userId) => {
    axios
      .delete(`http://localhost:8000/api/admin/deleteUser/${userId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((res) => {
        setUsers(users.filter((user) => user._id !== userId));
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteClick = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(userId);
        Swal.fire("Deleted!", "User has been deleted.", "success");
      }
    });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <>
      <div className="container mt-5">
        <h2 className="mb-4">Admin Dashboard</h2>
        <div className="row mb-3">
          <div className="col-md-10 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="col-md-2 d-flex justify-content-end">
            <Button variant="secondary" onClick={() => setShowAddUserModal(true)}>
              Add New User
            </Button>
          </div>
        </div>
        <table className="table table-striped text-center">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img
                    src={user.image || image}
                    alt="Profile Pic"
                    className="img-thumbnail rounded-circle"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Button variant="" onClick={() => handleDeleteClick(user._id)}>
                    <FaTrash className="text-danger" /> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      <Modal show={showAddUserModal} onHide={() => setShowAddUserModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant=""
            onClick={() => setShowAddUserModal(false)}
          >
            Close
          </Button>
          <Button variant="secondary" onClick={addUser}>
            Add User
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
};

export default AdminDashboard
