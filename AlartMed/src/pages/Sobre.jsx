import { Link } from "react-router-dom"
import { Bell, ArrowLeft } from "lucide-react"

const Sobre = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-xl p-8">
        <div className="flex items-center justify-center mb-6">
          <Bell className="h-8 w-8 text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">Sobre Nós</h1>
        </div>

        <div className="prose prose-blue max-w-none">
          <p className="text-gray-700 mb-4">
            O <strong>AlertMed</strong> surgiu como uma solução inovadora para combater a alta taxa de faltas em
            consultas e exames médicos. Utilizando notificações automáticas via{" "}
            <strong>SMS, e-mail e aplicativo</strong>, conectamos pacientes às unidades médicas de forma simples, rápida
            e personalizada com o uso de <strong>inteligência artificial</strong>.
          </p>

          <p className="text-gray-700 mb-4">
            Nosso sistema envia lembretes personalizados, reduzindo em até <strong>30% o absenteísmo</strong> e
            melhorando a organização das instituições de saúde. Além disso, oferecemos uma{" "}
            <strong>plataforma de gestão de medicamentos</strong> com acesso a <strong>bulas digitais</strong>,
            facilitando o entendimento e uso correto das medicações.
          </p>

          <p className="text-gray-700 mb-4">
            Mais do que um sistema de lembretes, o AlertMed é uma ponte direta entre pacientes e profissionais da saúde,
            proporcionando
            <strong> eficiência, cuidado e informação acessível</strong> na palma da mão.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Funcionalidades Principais</h2>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Agendamento e confirmação de consultas</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Central de mensagens entre médico e paciente</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Lembretes personalizados com IA</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Bula digital com linguagem acessível</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Alertas para uso correto de medicamentos</span>
            </li>
          </ul>

          <p className="text-gray-700 mb-6">
            Nosso compromisso é com a <strong>melhoria do atendimento médico</strong> e com o{" "}
            <strong>bem-estar dos pacientes</strong>, reduzindo falhas de comunicação e facilitando o acesso à
            informação de qualidade.
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar para Início
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Sobre
