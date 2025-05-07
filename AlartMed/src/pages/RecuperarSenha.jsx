"use client"

import { useState, useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import { Bell } from "lucide-react"

const RecuperarSenha = () => {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { resetPassword } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    try {
      const { error } = await resetPassword(email)

      if (error) {
        setError(error.message || "Erro ao enviar email de recuperação")
        return
      }

      setMessage("Email de recuperação enviado! Verifique sua caixa de entrada.")
    } catch (err) {
      setError("Ocorreu um erro ao processar sua solicitação")
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
            <h1 className="text-3xl font-bold text-gray-800">Recuperar Senha</h1>
            <p className="text-gray-600 mt-1">Insira seu e-mail para redefinir sua senha</p>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

          {message && <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">{message}</div>}

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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              {loading ? (
                <span>Carregando...</span>
              ) : (
                <>
                  <span className="mr-2">📨</span> Enviar Link de Recuperação
                </>
              )}
            </button>

            <div className="mt-4 text-center">
              <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
                Voltar para o Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RecuperarSenha
