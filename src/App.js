import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'
import Auth from './components/Login'
import TodoApp from './components/TodoApp'
import {AuthProvider, useAuth} from './components/AuthContext'

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<AuthWrapper />} />
          <Route path="/todo" element={<TodoWrapper />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

const AuthWrapper = () => {
  const {isAuthenticated} = useAuth()
  return !isAuthenticated ? <Auth /> : <Navigate to="/todo" />
}

const TodoWrapper = () => {
  const {isAuthenticated} = useAuth()
  return isAuthenticated ? <TodoApp /> : <Navigate to="/login" />
}

export default App
