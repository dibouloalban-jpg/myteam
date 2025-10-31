import React from 'react'

export default function TeamCard({team, onApply}) {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg text-slate-800">{team.name}</h3>
          <p className="text-sm text-slate-500 mt-1">{team.description || 'Pas de description'}</p>
        </div>
        <div className="text-sm text-slate-500">{(team.members?.length||0)}/{team.size || 1}</div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-slate-600">Niveau: {team.level || 1}</div>
        <button onClick={()=>onApply(team)} className="px-3 py-1 bg-blue-500 text-white rounded">Postuler</button>
      </div>
    </div>
  )
}