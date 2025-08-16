import axios from 'axios'
const baseUrl = '/api/tareas'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

// Crear tarea (con token de autorización)
export const crearTarea = async (tarea) => {
  if (!token) {
    throw new Error('Token no disponible - Usuario no autenticado')
  }

  // Validar fecha límite
  if (!tarea.fechaLimite) {
    throw new Error('La fecha límite es obligatoria')
  }

  if (new Date(tarea.fechaLimite) <= new Date()) {
    throw new Error('La fecha límite debe ser posterior a la fecha actual')
  }

  const config = {
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': token
    }
  }

  try {
    const response = await axios.post(baseUrl, {
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      fechaLimite: tarea.fechaLimite
    }, config)
    return response.data
  } catch (error) {
    throw error.response?.data?.error || error.message
  }
}

// Obtener tareas por usuario (con token)
export const obtenerTareasPorUsuario = async (userId) => {
  if (!token) {
    throw new Error('Token no disponible')
  }

  const config = {
    headers: { Authorization: token }
  }

  try {
    const response = await axios.get(`${baseUrl}/${userId}`, config)
    return response.data
  } catch (error) {
    throw error.response?.data?.error || error.message
  }
}

export { setToken }