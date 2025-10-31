import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import ContentAreaWorker from './WorkerContentArea'
import { supabase } from '../lib/supabaseClient'

export default function WorkerDashboard({user}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={user} onSignOut={()=>supabase.auth.signOut()} />
      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        <Sidebar active={'tasks'} setActive={()=>{}} />
        <main className="flex-1">
          <ContentAreaWorker />
        </main>
      </div>
    </div>
  )
}