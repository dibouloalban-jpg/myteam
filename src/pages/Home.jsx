import React from 'react'
import { useNavigate } from '../components/useRouterShim'
import { Home as HomeIcon } from 'lucide-react'

export default function Home() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center font-sans relative overflow-hidden">

      {/* Navbar */}
      <nav className="absolute top-6 right-6 flex gap-4">
        <button
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 bg-white border border-blue-300 text-blue-500 px-4 py-2 rounded-full shadow-sm hover:bg-blue-50 transition-all"
        >
          <HomeIcon size={18} />
        </button>
        <button
          onClick={() => navigate('/About')} 
          className="bg-blue-500 text-white border border-white px-5 py-2 rounded-full shadow-md hover:bg-blue-600 transition-all"
        >
          About
        </button>
      </nav>

      {/* Hero Section */}
      <div className="text-center px-6 mt-20">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          <span className="text-white drop-shadow-md bg-blue-500 px-4 py-1 rounded-xl border-4 border-blue-300">
            MyTeam
          </span>{' '}
          <span className="text-blue-600">– Créez et gérez votre équipe</span>
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-12">
          Publiez des missions, recrutez des membres qualifiés et gérez votre productivité en équipe.
        </p>

        {/* Auth Buttons */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
          <button
            onClick={() => navigate('OwnerAuth')}
            className="bg-blue-400 hover:bg-blue-500 text-white font-semibold text-lg px-8 py-3 rounded-full shadow-md transition-all"
          >
            Connexion / Inscription Owner
          </button>
          <button
            onClick={() => navigate('WorkerAuth')}
            className="bg-white hover:bg-blue-50 text-blue-500 font-semibold text-lg px-8 py-3 border border-blue-300 rounded-full shadow-md transition-all"
          >
            Connexion / Inscription Worker
          </button>
        </div>
      </div>
    </main>
  )
}