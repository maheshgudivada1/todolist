import React, {useEffect, useState} from 'react'
import {v4 as uuidv4} from 'uuid'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../AuthContext'
import './index.css'

const StatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const TodoApp = () => {
  const initialTodos = [
    {id: uuidv4(), text: 'Learn React', status: 'pending'},
    {id: uuidv4(), text: 'Build a Todo App', status: 'pending'},
    {id: uuidv4(), text: 'Explore JavaScript ES6', status: 'pending'},
  ]

  const [todos, setTodos] = useState([])
  const [userInput, setUserInput] = useState('')
  const [status, setStatus] = useState(StatusConstants.initial)
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [editing, setEditing] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)
  const navigate = useNavigate()
  const {logout} = useAuth()

  useEffect(() => {
    const loadTodos = () => {
      const storedTodos = localStorage.getItem('todos')
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos))
      } else {
        setTodos(initialTodos)
        localStorage.setItem('todos', JSON.stringify(initialTodos))
      }
      setStatus(StatusConstants.success)
    }

    loadTodos()
  }, [])

  const handleAddTodo = () => {
    if (userInput.trim() === '') {
      alert('Enter valid text')
      return
    }

    const newTodo = {
      id: uuidv4(),
      text: userInput,
      status: 'pending',
    }

    const updatedTodos = [...todos, newTodo]
    setTodos(updatedTodos)
    localStorage.setItem('todos', JSON.stringify(updatedTodos))
    setUserInput('')
  }

  const updateTodoStatus = (id, newStatus) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? {...todo, status: newStatus} : todo,
    )
    setTodos(updatedTodos)
    localStorage.setItem('todos', JSON.stringify(updatedTodos))
  }

  const handleDeleteTodo = id => {
    const updatedTodos = todos.filter(todo => todo.id !== id)
    setTodos(updatedTodos)
    localStorage.setItem('todos', JSON.stringify(updatedTodos))
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleEditUserDetails = () => {
    setEditing(!editing)
  }

  const handleEditProfile = () => {
    setEditingProfile(!editingProfile)
  }

  const handleUpdateUserDetails = e => {
    e.preventDefault()

    setEditing(false)
  }

  const handleUpdateProfile = e => {
    e.preventDefault()

    alert('Profile updated successfully!')
    setEditingProfile(false)
  }

  return (
    <div className="todo-app">
      <h1>Todo List</h1>
      <div className="todo-header">
        <button onClick={handleEditUserDetails}>
          {editing ? 'Cancel' : 'User Details'}
        </button>
        {editing && (
          <form
            onSubmit={handleUpdateUserDetails}
            className="user-details-form"
          >
            <input
              type="text"
              value={userDetails.username}
              onChange={e =>
                setUserDetails({...userDetails, username: e.target.value})
              }
              placeholder="Username"
              required
            />
            <input
              type="email"
              value={userDetails.email}
              onChange={e =>
                setUserDetails({...userDetails, email: e.target.value})
              }
              placeholder="Email"
              required
            />
            <button type="submit">Update</button>
          </form>
        )}
      </div>

      <div className="todo-input-container">
        <input
          type="text"
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          placeholder="Add new todo"
        />
        <button onClick={handleAddTodo}>Add Todo</button>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      {status === StatusConstants.inProgress && <p>Loading...</p>}
      {status === StatusConstants.failure && (
        <p>Failed to load todos. Please try again.</p>
      )}
      <ul>
        {todos.length === 0 && <li>No todos available.</li>}
        {todos.map(todo => (
          <li key={todo.id} className="todo-item-container">
            <span>{todo.text}</span>
            <select
              value={todo.status}
              onChange={e => {
                updateTodoStatus(todo.id, e.target.value)
                alert(`Status updated to "${e.target.value}"`)
              }}
            >
              <option value="" disabled>
                Select status
              </option>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="done">Done</option>
            </select>
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div className="profile-management">
        <h2>User Profile Management</h2>
        <button onClick={handleEditProfile}>
          {editingProfile ? 'Cancel' : 'Edit Profile'}
        </button>
        {editingProfile && (
          <form onSubmit={handleUpdateProfile} className="profile-form">
            <input
              type="text"
              value={userDetails.username}
              onChange={e =>
                setUserDetails({...userDetails, username: e.target.value})
              }
              placeholder="Username"
              required
            />
            <input
              type="email"
              value={userDetails.email}
              onChange={e =>
                setUserDetails({...userDetails, email: e.target.value})
              }
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={userDetails.password}
              onChange={e =>
                setUserDetails({...userDetails, password: e.target.value})
              }
              placeholder="New Password"
              required
            />
            <button type="submit">Update Profile</button>
          </form>
        )}
      </div>
    </div>
  )
}

export default TodoApp
