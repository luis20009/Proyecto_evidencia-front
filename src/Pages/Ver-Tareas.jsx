import { useState, useEffect } from "react"
import { obtenerMisTareas, setToken, responderTarea } from "../services/tareasService"
import Menu from '../components/Menu'


const VerTareas = ({ user }) => {
  const [tareas, setTareas] = useState([])
  const [mensaje, setMensaje] = useState(null)

  useEffect(() => {
    if (user?.token) {
      setToken(user.token)
    }
  }, [user])

  useEffect(() => {
    const cargarTareas = async () => {
      if (user?.token && user?.Rol === 'user') {
        try {
          const misTareas = await obtenerMisTareas()
          setTareas(misTareas)
        } catch (error) {
          console.error('Error al cargar tareas:', error)
          setMensaje("Error al cargar las tareas")
        }
      }
    }
    cargarTareas()
  }, [user?.token])

  const handleResponderPregunta = async (tareaId, preguntaIndex, respuestaIndex) => {
    try {
      const tareaActualizada = await responderTarea(tareaId, preguntaIndex, respuestaIndex)
      setTareas(tareas.map(tarea => 
        tarea.id === tareaId ? tareaActualizada : tarea
      ))
      setMensaje("Respuesta enviada correctamente")
    } catch (error) {
      setMensaje(error?.response?.data?.error || "Error al enviar la respuesta")
    }
    setTimeout(() => setMensaje(null), 3000)
  }

  return (
    <div className="tareas-container">
      <Menu user={user} />
      <h2>Mis Tareas Asignadas</h2>
      {mensaje && (
        <p className={`mensaje ${mensaje.includes("Error") ? "error" : "success"}`}>
          {mensaje}
        </p>
      )}
      
      {user?.Rol === 'user' ? (
        <ul className="tareas-lista">
          {tareas.map(tarea => (
            <li key={tarea.id} className="tarea-item">
              <div className="tarea-header">
                <h3>{tarea.titulo}</h3>
                <span className={`estado ${tarea.completada ? 'completada' : 'pendiente'}`}>
                  {tarea.completada ? 'Completada' : 'Pendiente'}
                </span>
              </div>
              <p className="descripcion">{tarea.descripcion}</p>
              <p className="fecha">Fecha límite: {new Date(tarea.fechaLimite).toLocaleDateString()}</p>
              <p className="profesor">Asignado por: {tarea.nombreCreador}</p>
              
              <div className="preguntas-container">
                {tarea.preguntas?.map((pregunta, preguntaIndex) => (
                  <div key={preguntaIndex} className="pregunta-item">
                    <h4>Pregunta {preguntaIndex + 1}: {pregunta.pregunta}</h4>
                    <div className="opciones-lista">
                      {pregunta.opciones.map((opcion, opcionIndex) => (
                        <button
                          key={opcionIndex}
                          onClick={() => handleResponderPregunta(tarea.id, preguntaIndex, opcionIndex)}
                          disabled={tarea.completada || pregunta.respuestaSeleccionada !== -1}
                          className={`opcion-btn ${
                            pregunta.respuestaSeleccionada === opcionIndex ? 'respondida' : ''
                          }`}
                        >
                          {opcion.texto}
                        </button>
                      ))}
                    </div>
                    {pregunta.respuestaSeleccionada !== -1 && (
                      <p className="respuesta-info">
                        Tu respuesta: {pregunta.opciones[pregunta.respuestaSeleccionada].texto}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-permisos">No tienes permisos para ver las tareas</p>
      )}
    </div>
  )
}

export default VerTareas
