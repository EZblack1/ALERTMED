"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { supabase } from "../supabaseClient"
import { FileText, Calendar, ExternalLink } from "lucide-react"
import Navbar from "../components/Navbar"

const Exames = () => {
  const { user } = useContext(AuthContext)
  const [exames, setExames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExames()
  }, [user])

  const fetchExames = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("exames")
        .select("*")
        .eq("paciente_id", user.id)
        .order("data_solicitacao", { ascending: false })

      if (error) throw error
      setExames(data || [])
    } catch (error) {
      console.error("Erro ao buscar exames:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Não definido"
    const options = { day: "2-digit", month: "2-digit", year: "numeric" }
    return new Date(dateString).toLocaleDateString("pt-BR", options)
  }

  const marcarComoVisto = async (id) => {
    try {
      // Atualizar notificações relacionadas a este exame
      await supabase.from("notificacoes").update({ lida: true }).eq("tipo", "exame").eq("referencia_id", id)

      // Atualizar a lista
      fetchExames()
    } catch (error) {
      console.error("Erro ao marcar notificações como lidas:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Meus Exames</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exames.length > 0 ? (
              exames.map((exame) => (
                <div
                  key={exame.id}
                  className={`bg-white rounded-xl shadow-md overflow-hidden ${
                    exame.resultado_disponivel ? "border-l-4 border-green-500" : ""
                  }`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-800">{exame.tipo}</h3>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          exame.resultado_disponivel ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {exame.resultado_disponivel ? "Disponível" : "Pendente"}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Solicitado em: {formatDate(exame.data_solicitacao)}</span>
                      </div>

                      {exame.data_realizacao && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Realizado em: {formatDate(exame.data_realizacao)}</span>
                        </div>
                      )}

                      {exame.data_resultado && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Resultado em: {formatDate(exame.data_resultado)}</span>
                        </div>
                      )}

                      {exame.observacoes && (
                        <p className="text-sm text-gray-700 mt-2">
                          <strong>Observações:</strong> {exame.observacoes}
                        </p>
                      )}

                      {exame.resultado_disponivel && exame.resultado_url && (
                        <div className="mt-4">
                          <a
                            href={exame.resultado_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 inline-flex items-center"
                            onClick={() => marcarComoVisto(exame.id)}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Ver Resultado
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-md">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">Nenhum exame encontrado</h3>
                <p className="text-gray-500">Seus exames aparecerão aqui quando forem solicitados pelo seu médico.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Exames
