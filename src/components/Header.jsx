import React from 'react'
import { Bell, User } from 'lucide-react'
import { useNavigate } from './useRouterShim' // small router shim below or replace with your router

export default function Header({ onOpenCreate, user, onSignOut }) {
  const navigate = useNavigate()
  return (
    <header className="w-full bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold" style={{color:'var(--primary-600)'}}>MyTeam</div>
          <nav className="hidden md:flex gap-4 text-sm text-slate-600">
            <button onClick={()=>navigate('/')} className="hover:text-slate-800">Accueil</button>
            <button onClick={()=>navigate('/dashboard')} className="hover:text-slate-800">Tableau de bord</button>
            <button onClick={()=>navigate('/teams')} className="hover:text-slate-800">Équipes</button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-slate-100"><Bell size={18} /></button>
          {user ? (
            <div className="flex items-center gap-3">
              <img src={user?.avatar_url || 'https://via.placeholder.com/36'} alt="avatar" className="w-9 h-9 rounded-full" />
              <button onClick={onSignOut} className="text-sm text-slate-700">Se déconnecter</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button onClick={()=>navigate('/auth')} className="px-3 py-1 border rounded">Connexion</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}