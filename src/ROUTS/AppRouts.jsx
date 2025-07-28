import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Servicios from "../Pages/Servicios";
import Contactanos from "../Pages/Contactanos";
import SobreNosotros from "../Pages/SobreNosotros";
import Crear from "../Pages/Crear-usuarios";

const AppRoutes = () => (
  <Router>
    <Routes>
        <Route path="/" element={<Servicios/>} />
        <Route path="/contactanos" element={<Contactanos/>} />
        <Route path="/sobre-nosotros" element={<SobreNosotros/>} />
        <Route path="/Tareas-ver">Tareas</Route>
        <Route path="/Crear" element={<Crear/>} />
    </Routes>
  </Router>
);

export default AppRoutes;
