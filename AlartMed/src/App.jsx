"use client"

import React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

// Páginas
import Login from "./pages/Login"
import Cadastro from "./pages/Cadastro"
import RecuperarSenha from "./pages/RecuperarSenha"
import PaginaInicial from "./pages/PaginaInicial"
import Agendamento from "./pages/Agendamento"
import Sobre from "./pages/Sobre"
import Dashboard from "./pages/Dashboard"
import Medicamentos from "./pages/Medicamentos"
import Exames from "./pages/Exames"
import Notificacoes from "./pages/Notificacoes"

// Contexto de autenticação
import { AuthProvider, AuthContext } from "./contexts/AuthContext"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/inicio" element={<PaginaInicial />} />
          <Route path="/sobre" element={<Sobre />} />

          {/* Rotas protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agendamento"
            element={
              <ProtectedRoute>
                <Agendamento />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medicamentos"
            element={
              <ProtectedRoute>
                <Medicamentos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exames"
            element={
              <ProtectedRoute>
                <Exames />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notificacoes"
            element={
              <ProtectedRoute>
                <Notificacoes />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

// Componente para proteger rotas
function ProtectedRoute({ children }) {
  const { user, loading } = React.useContext(AuthContext)

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  return children
}

export default App
