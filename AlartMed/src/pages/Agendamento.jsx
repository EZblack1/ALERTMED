"use client"

import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import { supabase } from "../supabaseClient"
import { Calendar, Clock, User, Mail, Phone, Stethoscope } from "lucide-react"
import Navbar from "../components/Navbar"

const Agendamento = () => {
  const { user, profile } = useContext(AuthContext)
  const navigate = useNavigate()

  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [telefone, setTelefone] = useState("")
  const [data, setData] = useState("")
  const [horario, setHorario] = useState("")
  const [especialidade, setEspecialidade] = useState("")
  const [especialidades, setEspecialidades] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  // Carregar especialidades do banco de dados
  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const { data, error } = await supabase.from("especialidades").select("*").order("nome")

        if (error) throw error
        setEspecialidades(data || [])
      } catch (err) {
        console.error("Erro ao carregar especialidades:", err)
      }
    }

    fetchEspecialidades()
  }, [])

  // Preencher dados do usuário logado
  useEffect(() => {
    if (profile) {
      setNome(profile.nome || "")
      setEmail(user?.email || "")
      setTelefone(profile.telefone || "")
    }
  }, [profile, user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    try {
      // Validar data (não pode ser no passado)
      const selectedDate = new Date(data)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (selectedDate < today) {
        setError("A data da consulta não pode ser no passado")
        setLoading(false)
        return
      }

      // Inserir consulta no banco de dados
      const { data: consulta, error } = await supabase
        .from("consultas")
        .insert([
          {
            paciente_id: user.id,
            especialidade_id: especialidade,
            data,
            horario,
            status: "agendada",
            observacoes: "",
          },
        ])
        .select()

      if (error) throw error

      // Criar notificação para o agendamento
      await supabase.from("notificacoes").insert([
        {
          usuario_id: user.id,
          tipo: "consulta",
          referencia_id: consulta[0].id,
          mensagem: `Consulta agendada para ${new Date(data).toLocaleDateString()} às ${horario}`,
          lida: false,
          enviada: false,
        },
      ])

      setMessage("Consulta agendada com sucesso!")

      // Limpar campos do formulário
      setData("")
      setHorario("")
      setEspecialidade("")

      // Redirecionar para o dashboard após alguns segundos
      setTimeout(() => {
        navigate("/dashboard")
      }, 3000)
    } catch (err) {
      setError("Erro ao agendar consulta. Por favor, tente novamente.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Agendar Consulta</h1>
              <p className="text-gray-600 mt-1">Preencha os dados para marcar sua consulta</p>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}

            {message && <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6">{message}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Seu nome completo"
                    disabled={!!profile?.nome}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="seuemail@exemplo.com"
                    disabled={!!user?.email}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="telefone"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    required
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="(99) 99999-9999"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-1">
                  Data da Consulta
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="data"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    required
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="horario" className="block text-sm font-medium text-gray-700 mb-1">
                  Horário
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="time"
                    id="horario"
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                    required
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="especialidade" className="block text-sm font-medium text-gray-700 mb-1">
                  Especialidade
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Stethoscope className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="especialidade"
                    value={especialidade}
                    onChange={(e) => setEspecialidade(e.target.value)}
                    required
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione</option>
                    {especialidades.map((esp) => (
                      <option key={esp.id} value={esp.id}>
                        {esp.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <span>Processando...</span>
                ) : (
                  <>
                    <span className="mr-2">📅</span> Confirmar Agendamento
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Agendamento
