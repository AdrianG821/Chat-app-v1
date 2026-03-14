import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()


  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950/60 shadow-lg p-6 space-y-5">
        <h1 className="text-2xl font-semibold text-slate-100">Chat</h1>

      </div>
    </div>
  )
}