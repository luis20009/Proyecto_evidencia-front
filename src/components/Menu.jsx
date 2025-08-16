import { Link, useLocation} from "react-router-dom";

const Menu = ({user}) => {
  const location = useLocation();
const textoLink = location.pathname === "/contactanos" ? "Contáctanos" : "Atrás";
  return (
  <nav>
    <ul>
      <li><Link to="/">Servicios</Link></li>
      {user?.Rol === "admin" && <li><Link to="/Crear">Crear Usuario</Link></li>}
       {user?.Rol === "user" && <li><Link to="/Tareas-ver">Tareas</Link></li> }
       {user?.Rol === "maker" && <li><Link to="/Tareas">Tareas</Link></li> }
      <li><Link to="/contactanos">{textoLink}</Link></li>
      <li><Link to="/sobre-nosotros">Sobre Nosotros</Link></li>
    </ul>
  </nav>
  );

};

export default Menu