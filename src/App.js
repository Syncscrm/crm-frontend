import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UsersPage from './components/pages/UsersPage';
import { UserProvider } from './contexts/userContext';
import { ColumnsProvider } from './contexts/columnsContext';
import { CardProvider } from './contexts/cardContext';
import ColumnsPage from './components/pages/ColumnsPage';
import PCP from './components/pages/PCP';
import DashboardPage from './components/pages/DashboardPage';
import LandingPage from './components/pages/LandingPage';
import SignUp from './components/pages/SignUp';


function App() {
  return (
    <UserProvider> {/* Envolver com UserProvider se estiver usando UserContext */}
      <ColumnsProvider>
        <CardProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUp />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/process" element={<ColumnsPage />} />
                <Route path="/pcp" element={<PCP />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                {/* Aqui você pode adicionar mais rotas que deseja proteger */}
              </Route>
              {/* Outras rotas conforme necessário */}
            </Routes>
          </Router>
        </CardProvider>
      </ColumnsProvider>
    </UserProvider>
  );
}

export default App;
