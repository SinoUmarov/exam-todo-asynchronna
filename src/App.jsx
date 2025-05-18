import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function App() {
  const API = "https://6829be436075e87073a75a47.mockapi.io/users";
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  async function get() {
    try {
      const response = await axios.get(API);
      setTodos(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    get();
  }, []);

  async function handleDelete(id) {
    try {
      await axios.delete(`${API}/${id}`);
      setTodos((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.error(error);
    }
  }

  function handleEdit(user) {
    setCurrentUser({ ...user });
    setOpen(true);
  }

  function handleAdd() {
    setCurrentUser({
      name: "",
      email: "",
      phone: "",
      country: "",
      completed: false,
      photo: "",
    });
    setOpen(true);
  }

  async function handleSave() {
    const { name, email, phone, country } = currentUser;
    if (!name || !email || !phone || !country) {
      return;
    }

    try {
      if (currentUser.id) {
        await axios.put(`${API}/${currentUser.id}`, currentUser);
        setTodos((elem) =>
          elem.map((el) => (el.id === currentUser.id ? currentUser : el))
        );
      } else {
        const response = await axios.post(API, currentUser);
        setTodos((prev) => [...prev, response.data]);
      }
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleComplete(id) {
    const updatedUser = todos.find((user) => user.id === id);
    if (!updatedUser) return;

    const updated = { ...updatedUser, completed: !updatedUser.completed };

    try {
      await axios.put(`${API}/${id}`, updated);
      setTodos((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (error) {
      console.error(error);
    }
  }

  const filteredTodos = todos.filter((todo) => {
    return (
      (statusFilter === "All" ||
        (statusFilter === "Active" ? todo.completed : !todo.completed)) &&
      (cityFilter === "All" || todo.country === cityFilter) &&
      JSON.stringify(todo).toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="container">
      <div className="header">
        <h1>User List</h1>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Add User
        </Button>
        <div className="filters">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option>All</option>
            <option>Dushanbe</option>
            <option>Khujand</option>
            <option>Bokhtar</option>
            <option>Hisar</option>
            <option>Kulob</option>
          </select>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
          />
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>City</th>
            <th>Status</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTodos.map((element) => (
            <tr key={element.id}>
              <td className="user-info">
                <img src={element.photo} alt="" />
                <div>
                  <div className="user-name">{element.name}</div>
                  <div className="user-email">{element.email}</div>
                </div>
              </td>
              <td>{element.country}</td>
              <td>
                <span
                  className={`status ${
                    element.completed ? "active" : "inactive"
                  }`}
                >
                  {element.completed ? "ACTIVE" : "INACTIVE"}
                </span>
              </td>
              <td>{element.phone}</td>
              <td>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(element.id)}
                >
                  Delete
                </Button>{" "}
                <Button
                  variant="outlined"
                  color="success"
                  onClick={() => handleComplete(element.id)}
                >
                  Completed
                </Button>{" "}
                <Button variant="contained" onClick={() => handleEdit(element)}>
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog onClose={() => setOpen(false)} open={open}>
        <DialogTitle>{currentUser?.id ? "Edit User" : "Add User"}</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setOpen(false)}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          {currentUser && (
            <div className="edit-form">
              <TextField
                fullWidth
                label="Name"
                margin="dense"
                value={currentUser.name}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, name: e.target.value })
                }
              />
              <TextField
                fullWidth
                label="Email"
                margin="dense"
                value={currentUser.email}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, email: e.target.value })
                }
              />
              <TextField
                fullWidth
                label="Phone"
                margin="dense"
                value={currentUser.phone}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, phone: e.target.value })
                }
              />
              <TextField
                fullWidth
                label="City"
                margin="dense"
                value={currentUser.country}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, country: e.target.value })
                }
              />
              <TextField
                fullWidth
                label="Photo URL"
                margin="dense"
                value={currentUser.photo}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, photo: e.target.value })
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={currentUser.completed}
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser,
                        completed: e.target.checked,
                      })
                    }
                  />
                }
                label="Completed (Active)"
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
