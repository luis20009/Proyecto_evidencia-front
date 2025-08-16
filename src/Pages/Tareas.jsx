import { useState, useEffect } from "react"
import { crearTarea, obtenerTareasPorUsuario, setToken } from "../services/tareasService"
import Menu from "../components/Menu"

const Tareas = ({ user }) => {
  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [fechaLimite, setFechaLimite] = useState("")
  const [mensaje, setMensaje] = useState(null)
  const [tareas, setTareas] = useState([])

  useEffect(() => {
    if (user?.token) {
      setToken(user.token)
    }
  }, [user])

  useEffect(() => {
    const cargarTareas = async () => {
      if (user?.id && user?.Rol === 'maker') {
        try {
          const tareasUsuario = await obtenerTareasPorUsuario(user.id)
          setTareas(tareasUsuario)
        } catch (error) {
          console.error('Error al cargar tareas:', error)
          setMensaje("Error al cargar las tareas")
        }
      }
    }
    cargarTareas()
  }, [user?.id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user?.id) {
      setMensaje("Debes iniciar sesión para crear tareas")
      return
    }
    if (user?.Rol !== 'maker') {
      setMensaje("Solo los profesores pueden crear tareas")
      return
    }

    try {
      const nuevaTarea = {
        titulo,
        descripcion,
        fechaLimite
      }
      const tareaCreada = await crearTarea(nuevaTarea)
      setTareas([...tareas, tareaCreada])
      setMensaje("Tarea creada correctamente")
      setTitulo("")
      setDescripcion("")
      setFechaLimite("")
    } catch (error) {
      setMensaje(error.message || "Error al crear la tarea")
    }
    setTimeout(() => setMensaje(null), 4000)
  }

  return (
    <div>
      <Menu user={user} />
      <h2>Gestión de Tareas</h2>
      {mensaje && <p className="mensaje">{mensaje}</p>}
      
      {user?.Rol === 'maker' ? (
        <>
          <h3>Crear Nueva Tarea</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Título: </label>
              <input
                type="text"
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Descripción: </label>
              <textarea
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
              />
            </div>
            <div>
              <label>Fecha Límite: </label>
              <input
                type="date"
                value={fechaLimite}
                onChange={e => setFechaLimite(e.target.value)}
                required
              />
            </div>
            <button type="submit">Crear Tarea</button>
          </form>

          <h3>Mis Tareas</h3>
          <ul>
            {tareas.map(tarea => (
              <li key={tarea.id}>
                <h4>{tarea.titulo}</h4>
                <p>{tarea.descripcion}</p>
                <p>Fecha límite: {new Date(tarea.fechaLimite).toLocaleDateString()}</p>
                <p>Estado: {tarea.completada ? 'Completada' : 'Pendiente'}</p>
                <p>Creado por: {tarea.nombreCreador}</p>
                {tarea.respuesta && <p>Respuesta: {tarea.respuesta}</p>}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No tienes permisos para crear tareas</p>
      )}
    </div>
  )
}

export default Tareas
