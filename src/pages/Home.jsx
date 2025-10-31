import React from 'react'
import { useNavigate } from '../components/useRouterShim'

export default function Home(){
  const navigate = useNavigate()
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">MyTeam — Créez et gérez votre équipe</h1>
        <p className="text-slate-600 mb-6">Publiez des missions, recrutez des membres qualifiés et gérez votre production en équipe.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={()=>navigate('/Auth')} className="px-6 py-3 rounded bg-blue-600 text-white">Se connecter / S'inscrire</button>
          <button onClick={()=>navigate('/Dashboard')} className="px-6 py-3 rounded border border-blue-200 text-blue-600">Voir le tableau de bord</button>
        </div>
      </div>
    </main>
  )
}