import Notification from "./Notification"
import PropTypes from 'prop-types'
import './css/login.css'

const LoginForm = (props) => {
    return (
        <div>
        
            <h2>Login</h2>
            <Notification message={props.message}/>
            <form onSubmit={props.handleLogin}>
                <div>
                    <label htmlFor="username">username </label>
                    <input
                        id="username"
                        type="text"
                        value={props.username}
                        name="Username"
                        onChange={({ target }) => props.setUsername(target.value)}
                        autoComplete="username"
                    />
                </div>
                <div>
                    <label htmlFor="password">password </label>
                    <input
                        id="password"
                        type="password"
                        value={props.password}
                        name="Password"
                        onChange={({ target }) => props.setPassword(target.value)}
                        autoComplete="current-password"
                    />
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm