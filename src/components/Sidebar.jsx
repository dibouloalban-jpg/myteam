import React from 'react'

export default function Sidebar({ active, setActive }) {
  const items = [
    {key:'overview', label:'Overview'},
    {key:'teams', label:'Équipes'},
    {key:'tasks', label:'Tâches'},
    {key:'profile', label:'Profil'},
  ]
  return (
    <aside className="w-64 bg-white border-r hidden lg:block">
      <div className="p-4">
        <div className="text-sm text-slate-500 mb-4">Dashboard</div>
        <ul className="space-y-2">
          {items.map(i=>(
            <li key={i.key}>
              <button onClick={()=>setActive(i.key)} className={`w-full text-left px-3 py-2 rounded ${active===i.key?'bg-blue-50 text-blue-600':''}`}>{i.label}</button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}