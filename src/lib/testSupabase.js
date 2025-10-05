import { supabase } from './supabaseClient'

async function testConnection() {
  const { data, error } = await supabase.from('tasks').select('*')
  if (error) {
    console.error('❌ Erreur de connexion à Supabase:', error.message)
  } else {
    console.log('✅ Connexion Supabase réussie ! Données :', data)
  }
}

testConnection()