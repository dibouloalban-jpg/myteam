import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import toast from 'react-hot-toast'
import { useNavigate } from '../components/useRouterShim'
import { Home as HomeIcon } from 'lucide-react'
import { motion } from 'framer-motion'

export default function WorkerAuth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  async function handleAuth(e) {
    e.preventDefault()
    try {
      // Tentative de connexion
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (!signInError) {
        toast.success('Connexion réussie ! Heureux de vous revoir, Worker.')
        navigate('/Dashboard')
        return
      }

      // Si la connexion échoue, tentative d'inscription
      const { error: signUpError } = await supabase.auth.signUp({ email, password })
      if (signUpError) throw signUpError

      toast.success('Compte Worker créé avec succès ! Vérifiez votre e-mail pour activer votre compte.')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 flex flex-col items-center justify-center font-sans relative overflow-hidden">

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

      {/* Animated Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center px-6 mt-12 max-w-lg"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-6">
          Bienvenue sur l’espace <span className="text-white bg-blue-500 border-4 border-blue-300 rounded-xl px-3 py-1">Worker</span>
        </h1>
        <p className="text-gray-700 text-lg mb-10 leading-relaxed">
          Cet espace est conçu pour les collaborateurs, freelances et membres d’équipe souhaitant rejoindre un projet. 
          Connectez-vous ou inscrivez-vous pour découvrir des missions, collaborer avec des Owners et développer vos compétences. 
          Notre objectif est de vous offrir un environnement de travail simple, fluide et motivant.
        </p>

        {/* Auth Form */}
        <form onSubmit={handleAuth} className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-blue-200">
          <div className="mb-5 text-left">
            <label className="block text-gray-700 font-semibold mb-2">Adresse e-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Entrez votre e-mail"
            />
          </div>

          <div className="mb-8 text-left">
            <label className="block text-gray-700 font-semibold mb-2">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Entrez votre mot de passe"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-400 hover:bg-blue-500 text-white font-semibold text-lg py-3 rounded-full shadow-md transition-all"
          >
            Se connecter / S’inscrire
          </button>
        </form>
      </motion.div>
    </main>
  )
}