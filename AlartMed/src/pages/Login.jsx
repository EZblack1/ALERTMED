"use client"

import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import { Bell } from "lucide-react"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const { data, error } = await login(email, password)

      if (error) {
        setError(error.message || "Erro ao fazer login")
        return
      }

      // Redirecionar para o dashboard após login bem-sucedido
      navigate("/dashboard")
    } catch (err) {
      setError("Ocorreu um erro ao fazer login")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-2">
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">AlertMed</h1>
            <p className="text-gray-600 mt-1">Agendamentos e Notificações de Consultas</p>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="seuemail@exemplo.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="********"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              {loading ? (
                <span>Carregando...</span>
              ) : (
                <>
                  <span className="mr-2">🔓</span> Entrar
                </>
              )}
            </button>

            <div className="mt-4 text-center space-y-2">
              <div className="flex items-center justify-center space-x-1">
                <p className="text-gray-600">Não tem uma conta?</p>
                <Link to="/cadastro" className="text-blue-600 hover:text-blue-800 font-medium">
                  Cadastre-se
                </Link>
              </div>

              <div className="flex items-center justify-center space-x-1">
                <p className="text-gray-600">Esqueceu sua senha?</p>
                <Link to="/recuperar-senha" className="text-blue-600 hover:text-blue-800 font-medium">
                  Recuperar Senha
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
