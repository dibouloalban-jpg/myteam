import React, {useEffect, useState} from 'react'
import OwnerDashboard from './OwnerDashboard'
import WorkerDashboard from './WorkerDashboard'
import { supabase } from '../lib/supabaseClient'
import Loader from '../components/Loader'

export default function Dashboard(){
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(()=>{
    async function init(){
      const { data } = await supabase.auth.getSession()
      const u = data?.session?.user
      if(u) {
        setUser(u)
        // Here you would fetch role from a users table
        // For demo: default to 'owner' if user's email contains 'owner'
        const r = u?.email?.includes('owner') ? 'owner' : 'worker'
        setRole(r)
      }
      setLoading(false)
    }
    init()
  },[])

  if(loading) return <Loader />
  if(role==='owner') return <OwnerDashboard user={user} />
  return <WorkerDashboard user={user} />
}