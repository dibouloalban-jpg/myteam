import React, {useState} from 'react'
import { supabase } from '../lib/supabaseClient'
import toast from 'react-hot-toast'
import { useNavigate } from '../components/useRouterShim'

export default function Auth(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const navigate = useNavigate()

  async function signUp(e){
    e.preventDefault()
    const {  error } = await supabase.auth.signUp({ email, password })
    if (error) toast.error(error.message)
    else {
      toast.success('Compte créé — vérifie ton e-mail (si activé)')
      navigate('/dashboard')
    }
  }
  async function signIn(e){
    e.preventDefault()
    const {  error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) toast.error(error.message)
    else {
      toast.success('Connecté')
      navigate('/dashboard')
    }
  }

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-blue-600">Connexion / Inscription</h2>
      <form className="space-y-3">
        <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full border px-3 py-2 rounded" placeholder="Email" />
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="w-full border px-3 py-2 rounded" placeholder="Mot de passe" />
        <div className="flex gap-2">
          <button onClick={signIn} className="px-4 py-2 bg-blue-600 text-white rounded">Se connecter</button>
          <button onClick={signUp} className="px-4 py-2 border rounded">S'inscrire</button>
        </div>
      </form>
    </div>
  )
}