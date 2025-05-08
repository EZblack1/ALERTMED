"use client"

import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import { Bell, Menu, X, User, Calendar, Pill, FileText, LogOut } from "lucide-react"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, profile, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = async () => {
    const { error } = await logout()
    if (!error) {
      navigate("/")
    }
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              <Bell className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">AlertMed</span>
            </Link>
          </div>

          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <Link
              to="/dashboard"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              Dashboard
            </Link>
            <Link
              to="/agendamento"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              Agendar Consulta
            </Link>
            <Link
              to="/medicamentos"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              Medicamentos
            </Link>
            <Link
              to="/exames"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              Exames
            </Link>
            <Link
              to="/notificacoes"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              Notificações
            </Link>
          </div>

          <div className="hidden md:ml-6 md:flex md:items-center">
            <div className="ml-3 relative">
              <div className="flex items-center">
                <span className="mr-2 text-sm font-medium text-gray-700">{profile?.nome || user?.email}</span>
                <button
                  onClick={handleLogout}
                  className="p-1 rounded-full text-gray-500 hover:text-red-500 focus:outline-none"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <User className="mr-3 h-5 w-5" />
                Dashboard
              </div>
            </Link>
            <Link
              to="/agendamento"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <Calendar className="mr-3 h-5 w-5" />
                Agendar Consulta
              </div>
            </Link>
            <Link
              to="/medicamentos"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <Pill className="mr-3 h-5 w-5" />
                Medicamentos
              </div>
            </Link>
            <Link
              to="/exames"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <FileText className="mr-3 h-5 w-5" />
                Exames
              </div>
            </Link>
            <Link
              to="/notificacoes"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <Bell className="mr-3 h-5 w-5" />
                Notificações
              </div>
            </Link>
            <button
              onClick={() => {
                handleLogout()
                setIsOpen(false)
              }}
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50"
            >
              <div className="flex items-center">
                <LogOut className="mr-3 h-5 w-5" />
                Sair
              </div>
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
