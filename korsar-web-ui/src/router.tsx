import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './routes/dashboard';
import PrivateRoute from './routes/privateRoute';
import Login from "./routes/login";
import Layout from "./components/layout";
import ParquesEolicos from "./routes/parquesEolicos";
import Inspecciones from "./routes/inspecciones";
import Aerogeneradores from "./routes/aerogeneradores";
import RevisarInspeccion from "./routes/revisarInspeccion";

const router = (
  <Router>
    <Routes>

      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={
        <PrivateRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </PrivateRoute>
      } />

      <Route path="/parquesEolicos/:uuid_parque_eolico" element={
        <PrivateRoute>
          <Layout>
            <ParquesEolicos />
          </Layout>
        </PrivateRoute>
      } />

      <Route path="/aerogeneradores" element={
        <PrivateRoute>
          <Layout>
            <Aerogeneradores />
          </Layout>
        </PrivateRoute>
      } />

      <Route path="/inspecciones" element={
        <PrivateRoute>
          <Layout>
            <Inspecciones />
          </Layout>
        </PrivateRoute>
      } />

      <Route path="/revisar/:uuid_inspeccion/:uuid_parque" element={
        <PrivateRoute>
          <Layout>
            <RevisarInspeccion />
          </Layout>
        </PrivateRoute>
      } />

    </Routes>
  </Router>
);

export default router;
