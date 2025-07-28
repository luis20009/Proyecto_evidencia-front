import { useState, useEffect, useRef } from 'react'
import Blog from '../components/Blog'
import blogService from '../services/blogs'
import LoginForm from '../components/Login'
import loginService from '../services/login'
import BlogForm from '../components/BlogForm'
import Togglable from '../components/Togglable'
import Notification from '../components/Notification'
import Menu from "../components/Menu"

const Contactanos = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [Rol, setRol] = useState('')
  const blogFormRef = useRef()

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => {
        setBlogs(blogs)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = async (blogObject, title, author) => {
    blogFormRef.current.toggleVisibility()
    try {
      blogService.setToken(user.token)
      const returnData = await blogService.create(blogObject)
      const messageObject = {
        message: `a new Blog: ${title} by ${author}`,
        type: true,
      }
      setMessage(messageObject)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      setBlogs(blogs.concat(returnData))
    }
    catch (error) {
      console.error(error)
      const messageObject = {
        message: `No se pudo crear el blog. Revisa el token o los datos`,
        type: false,
      }
      setMessage(messageObject)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }

  }

  const updatedBlog = async (id, updateFields) => {
    const blog = blogs.find(b => b.id === id)
    try {
      const returnedBlog = await blogService.update(id, updateFields)
      setBlogs(blogs.map(b => b.id !== id ? b : returnedBlog))
    } catch (error) {
      console.error('Error updating likes:', error)
      const messageObject = {
        message: `Blog "${blog.title}" was already removed from server`,
        type: false,
      }
      setMessage(messageObject)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      setBlogs(blogs.filter(b => b.id !== id))
    }
  }

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id)
    } catch (error) {
      console.log('Error: ', error);
    } finally {
      setBlogs(blogs.filter(b => b.id !== id))
    }
  }


  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password, Rol})

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      
      const messageObject = {
        message: `Welcome ${user.name}`,
        type: true
        
      }
      setMessage(messageObject)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      console.log(exception)
      const messageObject = {
        message: `wrong username or password`,
        type: false,
      }
      setMessage(messageObject)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON)
    setUser(user)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const orderBlogs = blogs.sort((a, b) => b.likes - a.likes)

  return (
    <div>
      {user === null ? (
        <LoginForm
          message={message}
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      ) :(
        <>
        <Menu user={user}/>
          <h2>Blogs</h2>
          <Notification message={message} />
          <button type="button" onClick={handleLogout}>logout</button>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          <ol>
            {orderBlogs.map(blog => (
              <li key={blog.id}>
                <Blog blog={blog} updateBlog={updatedBlog} deleteBlog={deleteBlog} user={user} />
              </li>
            ))}
          </ol>

        </>
      )}
    </div>
  )
}

export default Contactanos;