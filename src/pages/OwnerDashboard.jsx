import React, {useState, useEffect} from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import ContentAreaOwner from './OwnerContentArea'
import { supabase } from '../lib/supabaseClient'

export default function OwnerDashboard({user}) {
  const [active, setActive] = useState('overview')
  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={user} onSignOut={()=>supabase.auth.signOut()} />
      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        <Sidebar active={active} setActive={setActive} />
        <main className="flex-1">
          <ContentAreaOwner active={active} />
        </main>
      </div>
    </div>
  )
}