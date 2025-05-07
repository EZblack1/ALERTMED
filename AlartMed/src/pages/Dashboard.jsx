"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import { supabase } from "../supabaseClient"
import { Calendar, Clock, Pill, FileText, Bell, Plus } from "lucide-react"
import Navbar from "../components/Navbar"

const Dashboard = () => {
  const { user, profile } = useContext(AuthContext)
  const [consultas, setConsultas] = useState([])
  const [medicamentos, setMedicamentos] = useState([])
  const [exames, setExames] = useState([])
  const [notificacoes, setNotificacoes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        // Buscar consultas
        const { data: consultasData } = await supabase
          .from("consultas")
          .select(`
            *,
            especialidades(nome)
          `)
          .eq("paciente_id", user.id)
          .eq("status", "agendada")
          .order("data", { ascending: true })
          .limit(3)

        setConsultas(consultasData || [])

        // Buscar medicamentos
        const { data: medicamentosData } = await supabase
          .from("medicamentos")
          .select("*")
          .eq("paciente_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3)

        setMedicamentos(medicamentosData || [])

        // Buscar exames
        const { data: examesData } = await supabase
          .from("exames")
          .select("*")
          .eq("paciente_id", user.id)
          .order("data_solicitacao", { ascending: false })
          .limit(3)

        setExames(examesData || [])

        // Buscar notificações
        const { data: notificacoesData } = await supabase
          .from("notificacoes")
          .select("*")
          .eq("usuario_id", user.id)
          .eq("lida", false)
          .order("created_at", { ascending: false })
          .limit(5)

        setNotificacoes(notificacoesData || [])
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" }
    return new Date(dateString).toLocaleDateString("pt-BR", options)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Olá, {profile?.nome || "Paciente"}!</h1>
          <p className="text-gray-600">Bem-vindo ao seu painel de controle do AlertMed.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Próximas Consultas */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                    Próximas Consultas
                  </h2>
                  <Link
                    to="/agendamento"
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agendar
                  </Link>
                </div>

                {consultas.length > 0 ? (
                  <div className="space-y-4">
                    {consultas.map((consulta) => (
                      <div key={consulta.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">{consulta.especialidades?.nome}</p>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(consulta.data)}
                            </div>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <Clock className="h-4 w-4 mr-1" />
                              {consulta.horario}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {consulta.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>Nenhuma consulta agendada. Clique em "Agendar" para marcar uma consulta.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Medicamentos */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <Pill className="h-5 w-5 mr-2 text-blue-600" />
                    Medicamentos
                  </h2>
                  <Link
                    to="/medicamentos"
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </Link>
                </div>

                {medicamentos.length > 0 ? (
                  <div className="space-y-4">
                    {medicamentos.map((medicamento) => (
                      <div key={medicamento.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <p className="font-medium">{medicamento.nome}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {medicamento.dosagem} - {medicamento.frequencia}
                        </p>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(medicamento.data_inicio)} até{" "}
                          {medicamento.data_fim ? formatDate(medicamento.data_fim) : "Contínuo"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>Nenhum medicamento cadastrado. Clique em "Adicionar" para registrar um medicamento.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Exames */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    Exames
                  </h2>
                  <Link
                    to="/exames"
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
                  >
                    Ver todos
                  </Link>
                </div>

                {exames.length > 0 ? (
                  <div className="space-y-4">
                    {exames.map((exame) => (
                      <div key={exame.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">{exame.tipo}</p>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              Solicitado em: {formatDate(exame.data_solicitacao)}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                exame.resultado_disponivel
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {exame.resultado_disponivel ? "Disponível" : "Pendente"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>Nenhum exame registrado.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Notificações */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-blue-600" />
                    Notificações
                  </h2>
                  <Link
                    to="/notificacoes"
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
                  >
                    Ver todas
                  </Link>
                </div>

                {notificacoes.length > 0 ? (
                  <div className="space-y-4">
                    {notificacoes.map((notificacao) => (
                      <div key={notificacao.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <p className="font-medium">{notificacao.mensagem}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notificacao.created_at).toLocaleString("pt-BR")}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>Nenhuma notificação não lida.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
