"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { supabase } from "../supabaseClient"
import { Bell, Calendar, Pill, FileText, Check } from "lucide-react"
import Navbar from "../components/Navbar"

const Notificacoes = () => {
  const { user } = useContext(AuthContext)
  const [notificacoes, setNotificacoes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotificacoes()
  }, [user])

  const fetchNotificacoes = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("notificacoes")
        .select("*")
        .eq("usuario_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setNotificacoes(data || [])
    } catch (error) {
      console.error("Erro ao buscar notificações:", error)
    } finally {
      setLoading(false)
    }
  }

  const marcarComoLida = async (id) => {
    try {
      const { error } = await supabase.from("notificacoes").update({ lida: true }).eq("id", id)

      if (error) throw error

      // Atualizar a lista
      setNotificacoes(notificacoes.map((notif) => (notif.id === id ? { ...notif, lida: true } : notif)))
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error)
    }
  }

  const marcarTodasComoLidas = async () => {
    try {
      const { error } = await supabase
        .from("notificacoes")
        .update({ lida: true })
        .eq("usuario_id", user.id)
        .eq("lida", false)

      if (error) throw error

      // Atualizar a lista
      setNotificacoes(notificacoes.map((notif) => ({ ...notif, lida: true })))
    } catch (error) {
      console.error("Erro ao marcar todas notificações como lidas:", error)
    }
  }

  const getIconForTipo = (tipo) => {
    switch (tipo) {
      case "consulta":
        return <Calendar className="h-5 w-5 text-blue-600" />
      case "medicamento":
        return <Pill className="h-5 w-5 text-green-600" />
      case "exame":
        return <FileText className="h-5 w-5 text-purple-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Notificações</h1>

          {notificacoes.some((n) => !n.lida) && (
            <button
              onClick={marcarTodasComoLidas}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              <Check className="h-4 w-4 mr-1" />
              Marcar todas como lidas
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {notificacoes.length > 0 ? (
              <div className="divide-y">
                {notificacoes.map((notificacao) => (
                  <div key={notificacao.id} className={`p-4 ${notificacao.lida ? "bg-white" : "bg-blue-50"}`}>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">{getIconForTipo(notificacao.tipo)}</div>
                      <div className="ml-3 flex-1">
                        <p className={`text-sm ${notificacao.lida ? "text-gray-700" : "font-medium text-gray-900"}`}>
                          {notificacao.mensagem}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{formatDateTime(notificacao.created_at)}</p>
                      </div>
                      {!notificacao.lida && (
                        <button
                          onClick={() => marcarComoLida(notificacao.id)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">Nenhuma notificação</h3>
                <p className="text-gray-500">Você não tem notificações no momento.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Notificacoes
