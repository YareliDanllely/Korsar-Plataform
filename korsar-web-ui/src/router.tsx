import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './routes/dashboard';
import PrivateRoute from './routes/privateRoute';
import Login from "./routes/login";
import Layout from "./components/layout";
import ParquesEolicos from "./routes/parquesEolicos";
import Reportes from "./routes/reportes";

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
        <Route path="/parquesEolicos" element={
          <PrivateRoute>
          <Layout>
            <ParquesEolicos />
          </Layout>
        </PrivateRoute>
        } />
        <Route path="/reportes" element={
          <PrivateRoute>
          <Layout>
            <Reportes />
          </Layout>
        </PrivateRoute>
        } />

    </Routes>
  </Router>
);
export default router;
