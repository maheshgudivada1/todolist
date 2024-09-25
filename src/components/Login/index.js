import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../AuthContext'
import './index.css'

const Auth = () => {
  const {login} = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showSubmitError, setShowSubmitError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  const onSubmitSuccess = jwtToken => {
    localStorage.setItem('jwt_token', jwtToken)
    login()
    navigate('/todo')
  }

  // Renamed 'errorMsg' parameter to 'errorMessage' to avoid shadowing
  const onSubmitFailure = errorMessage => {
    setShowSubmitError(true)
    setErrorMsg(errorMessage)
  }

  const onSubmitForm = event => {
    event.preventDefault()

    if (!isLogin && password !== confirmPassword) {
      onSubmitFailure('Passwords do not match')
      return
    }

    if (isLogin) {
      const storedUsername = localStorage.getItem('username')
      const storedPassword = localStorage.getItem('password')

      if (storedUsername === username && storedPassword === password) {
        const jwtToken = 'dummy-jwt-token'
        onSubmitSuccess(jwtToken)
      } else {
        onSubmitFailure('Invalid login credentials')
      }
    } else {
      localStorage.setItem('username', username)
      localStorage.setItem('password', password)
      setIsLogin(true)
      const jwtToken = 'dummy-jwt-token'
      onSubmitSuccess(jwtToken)
    }
  }

  return (
    <div className="bg-container">
      <form className="form-container" onSubmit={onSubmitForm}>
        <img
          src="https://logowik.com/content/uploads/images/todo-group3144.logowik.com.webp"
          className="logo"
          alt="website logo"
        />
        <label htmlFor="USERNAME" className="name">
          Username
        </label>
        <input
          type="text"
          id="USERNAME"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="username"
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="password"
        />
        {!isLogin && (
          <>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="confirm password"
            />
          </>
        )}
        <button className="button" type="submit">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
        {showSubmitError && <p className="paragraph">{errorMsg}</p>}
        <p className="toggle-form" onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "Don't have an account? Sign up"
            : 'Already have an account? Log in'}
        </p>
      </form>
    </div>
  )
}

export default Auth
