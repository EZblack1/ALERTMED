import { Link } from "react-router-dom"
import { Bell } from "lucide-react"

const PaginaInicial = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Bell className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">AlertMed</h1>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
              Entrar
            </Link>
            <Link to="/cadastro" className="text-gray-700 hover:text-blue-600 transition">
              Cadastro
            </Link>
            <Link to="/sobre" className="text-gray-700 hover:text-blue-600 transition">
              Sobre Nós
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <div className="container mx-auto px-6 py-16 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Agende suas consultas com facilidade</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              AlertMed ajuda você a nunca mais esquecer um compromisso médico, medicamento ou resultado de exame.
            </p>
            <div className="mt-8">
              <Link
                to="/"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 inline-flex items-center"
              >
                Comece Agora
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Agendamento Simplificado</h3>
              <p className="text-gray-600">
                Agende consultas com facilidade e receba lembretes automáticos para nunca mais perder um compromisso.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">💊</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Controle de Medicamentos</h3>
              <p className="text-gray-600">
                Receba alertas nos horários certos para tomar seus medicamentos e mantenha um histórico completo.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🔔</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Notificações de Exames</h3>
              <p className="text-gray-600">
                Seja notificado assim que seus resultados de exames estiverem disponíveis para consulta.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-50 py-6">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-600">© 2025 AlertMed. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

export default PaginaInicial
