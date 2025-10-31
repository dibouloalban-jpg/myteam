import React, {useState, useEffect} from 'react'
import TeamCard from '../components/TeamCard'
import { supabase } from '../lib/supabaseClient'
import toast from 'react-hot-toast'

export default function ContentAreaOwner({active}) {
  const [teams, setTeams] = useState([])

  useEffect(()=>{ load() },[])

  async function load(){
    try {
      const { data, error } = await supabase.from('teams').select('*')
      if(error) throw error
      setTeams(data || [])
    } catch(e){
      console.error(e)
      toast.error('Erreur chargement équipes')
    }
  }

  if(active==='teams') {
    return (
      <div>
        <h2 className="text-lg font-semibold mb-4">Équipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map(t=> <TeamCard key={t.id} team={t} onApply={()=>{}} />)}
        </div>
      </div>
    )
  }
  if(active==='tasks'){
    return <div>Gestion des tâches (à implémenter)</div>
  }
  if(active==='profile'){
    return <div>Profil & settings (à implémenter)</div>
  }
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white border rounded shadow-sm">Projets <strong>3</strong></div>
        <div className="p-4 bg-white border rounded shadow-sm">Membres <strong>18</strong></div>
        <div className="p-4 bg-white border rounded shadow-sm">Tâches <strong>12</strong></div>
      </div>
    </div>
  )
}