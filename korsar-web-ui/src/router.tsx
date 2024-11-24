import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './routes/dashboard';
import PrivateRoute from './routes/privateRoute';
import Login from "./routes/login";
import Layout from "./layout/layout";
import ParquesEolicos from "./routes/parquesEolicos";
import Inspecciones from "./routes/inspecciones";
import Aerogeneradores from "./routes/aerogeneradores";
import RevisarInspeccion from "./routes/revisarInspeccion";
import AdministradorSesion from "./utils/administradorSesion"; // Importa el componente

const router = (
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      {/* Agrupa todas las rutas protegidas dentro de AdministradorSesion */}
      <Route
        path="/*"
        element={
          <AdministradorSesion>
            <PrivateRoute>
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/parquesEolicos/:uuid_parque_eolico" element={<ParquesEolicos />} />
                  <Route path="/aerogeneradores/:uuid_empresa" element={<Aerogeneradores />} />
                  <Route path="/inspecciones" element={<Inspecciones />} />
                  <Route path="/revisar/:uuid_inspeccion/:uuid_parque" element={<RevisarInspeccion />} />
                </Routes>
              </Layout>
            </PrivateRoute>
          </AdministradorSesion>
        }
      />
    </Routes>
  </Router>
);

export default router;
