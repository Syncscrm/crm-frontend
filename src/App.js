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


function App() {
  return (
    <UserProvider> {/* Envolver com UserProvider se estiver usando UserContext */}
      <ColumnsProvider>
        <CardProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/process" element={<ColumnsPage />} />
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
