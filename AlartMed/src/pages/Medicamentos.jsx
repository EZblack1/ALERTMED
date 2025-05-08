"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { supabase } from "../supabaseClient"
import { Pill, Clock, Plus, Trash2 } from "lucide-react"
import Navbar from "../components/Navbar"

const Medicamentos = () => {
  const { user } = useContext(AuthContext)
  const [medicamentos, setMedicamentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  // Form state
  const [nome, setNome] = useState("")
  const [dosagem, setDosagem] = useState("")
  const [frequencia, setFrequencia] = useState("")
  const [horarios, setHorarios] = useState([""])
  const [dataInicio, setDataInicio] = useState("")
  const [dataFim, setDataFim] = useState("")
  const [observacoes, setObservacoes] = useState("")
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    fetchMedicamentos()
  }, [user])

  const fetchMedicamentos = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("medicamentos")
        .select("*")
        .eq("paciente_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setMedicamentos(data || [])
    } catch (error) {
      console.error("Erro ao buscar medicamentos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddHorario = () => {
    setHorarios([...horarios, ""])
  }

  const handleHorarioChange = (index, value) => {
    const newHorarios = [...horarios]
    newHorarios[index] = value
    setHorarios(newHorarios)
  }

  const handleRemoveHorario = (index) => {
    const newHorarios = [...horarios]
    newHorarios.splice(index, 1)
    setHorarios(newHorarios)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError("")
    setFormSuccess("")
    setFormLoading(true)

    try {
      // Validar horários (remover vazios)
      const horariosValidos = horarios.filter((h) => h.trim() !== "")

      if (horariosValidos.length === 0) {
        setFormError("Adicione pelo menos um horário para o medicamento")
        setFormLoading(false)
        return
      }

      // Inserir medicamento
      const { data, error } = await supabase.from("medicamentos").insert([
        {
          paciente_id: user.id,
          nome,
          dosagem,
          frequencia,
          horarios: horariosValidos,
          data_inicio: dataInicio,
          data_fim: dataFim || null,
          observacoes,
        },
      ])

      if (error) throw error

      // Criar notificações para cada horário
      for (const horario of horariosValidos) {
        await supabase.from("notificacoes").insert([
          {
            usuario_id: user.id,
            tipo: "medicamento",
            referencia_id: data[0].id,
            mensagem: `Lembrete para tomar ${nome} (${dosagem}) às ${horario}`,
            lida: false,
            enviada: false,
          },
        ])
      }

      setFormSuccess("Medicamento adicionado com sucesso!")

      // Limpar formulário
      setNome("")
      setDosagem("")
      setFrequencia("")
      setHorarios([""])
      setDataInicio("")
      setDataFim("")
      setObservacoes("")

      // Atualizar lista
      fetchMedicamentos()

      // Fechar formulário após alguns segundos
      setTimeout(() => {
        setShowForm(false)
        setFormSuccess("")
      }, 3000)
    } catch (error) {
      setFormError("Erro ao adicionar medicamento. Por favor, tente novamente.")
      console.error(error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este medicamento?")) return

    try {
      setLoading(true)

      // Excluir notificações relacionadas
      await supabase.from("notificacoes").delete().eq("tipo", "medicamento").eq("referencia_id", id)

      // Excluir medicamento
      const { error } = await supabase.from("medicamentos").delete().eq("id", id)

      if (error) throw error

      // Atualizar lista
      fetchMedicamentos()
    } catch (error) {
      console.error("Erro ao excluir medicamento:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" }
    return new Date(dateString).toLocaleDateString("pt-BR", options)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Meus Medicamentos</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center"
          >
            {showForm ? (
              "Cancelar"
            ) : (
              <>
                <Plus className="h-5 w-5 mr-1" />
                Adicionar Medicamento
              </>
            )}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Adicionar Novo Medicamento</h2>

              {formError && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{formError}</div>}

              {formSuccess && <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6">{formSuccess}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Medicamento
                    </label>
                    <input
                      type="text"
                      id="nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: Paracetamol"
                    />
                  </div>

                  <div>
                    <label htmlFor="dosagem" className="block text-sm font-medium text-gray-700 mb-1">
                      Dosagem
                    </label>
                    <input
                      type="text"
                      id="dosagem"
                      value={dosagem}
                      onChange={(e) => setDosagem(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: 500mg"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="frequencia" className="block text-sm font-medium text-gray-700 mb-1">
                    Frequência
                  </label>
                  <select
                    id="frequencia"
                    value={frequencia}
                    onChange={(e) => setFrequencia(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione</option>
                    <option value="Diário">Diário</option>
                    <option value="A cada 8 horas">A cada 8 horas</option>
                    <option value="A cada 12 horas">A cada 12 horas</option>
                    <option value="Uma vez ao dia">Uma vez ao dia</option>
                    <option value="Duas vezes ao dia">Duas vezes ao dia</option>
                    <option value="Três vezes ao dia">Três vezes ao dia</option>
                    <option value="Semanal">Semanal</option>
                    <option value="Quinzenal">Quinzenal</option>
                    <option value="Mensal">Mensal</option>
                    <option value="Conforme necessário">Conforme necessário</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horários</label>
                  {horarios.map((horario, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="time"
                        value={horario}
                        onChange={(e) => handleHorarioChange(index, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                      {horarios.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveHorario(index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddHorario}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar Horário
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dataInicio" className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Início
                    </label>
                    <input
                      type="date"
                      id="dataInicio"
                      value={dataInicio}
                      onChange={(e) => setDataInicio(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="dataFim" className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Término (opcional)
                    </label>
                    <input
                      type="date"
                      id="dataFim"
                      value={dataFim}
                      onChange={(e) => setDataFim(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-1">
                    Observações (opcional)
                  </label>
                  <textarea
                    id="observacoes"
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Instruções adicionais ou observações"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                >
                  {formLoading ? <span>Processando...</span> : <span>Salvar Medicamento</span>}
                </button>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicamentos.length > 0 ? (
              medicamentos.map((medicamento) => (
                <div key={medicamento.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <Pill className="h-5 w-5 text-blue-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-800">{medicamento.nome}</h3>
                      </div>
                      <button onClick={() => handleDelete(medicamento.id)} className="text-gray-400 hover:text-red-500">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="mt-4 space-y-2">
                      <p className="text-gray-700">
                        <strong>Dosagem:</strong> {medicamento.dosagem}
                      </p>
                      <p className="text-gray-700">
                        <strong>Frequência:</strong> {medicamento.frequencia}
                      </p>
                      <div>
                        <strong className="text-gray-700">Horários:</strong>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {medicamento.horarios.map((horario, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center"
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              {horario}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">
                        <strong>Período:</strong> {formatDate(medicamento.data_inicio)}
                        {medicamento.data_fim ? ` até ${formatDate(medicamento.data_fim)}` : " (contínuo)"}
                      </p>
                      {medicamento.observacoes && (
                        <p className="text-gray-700">
                          <strong>Observações:</strong> {medicamento.observacoes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-md">
                <Pill className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">Nenhum medicamento cadastrado</h3>
                <p className="text-gray-500 mb-6">
                  Adicione seus medicamentos para receber lembretes nos horários corretos.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 inline-flex items-center"
                >
                  <Plus className="h-5 w-5 mr-1" />
                  Adicionar Medicamento
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Medicamentos
