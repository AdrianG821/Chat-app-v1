import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import image from "../images/image.png"
import { Link } from 'react-router-dom'
import api from '../api/axios'

type ConversationList = {
  id: number,
  participants: {user: {name: string[]}}[],
  messages: { content: string }[]
}

type UsersList = {
  id: number,
  name: string
}



export default function ChatRoom() {

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [searchUsers,setSearchUsers] = useState(false)
  const [convStarter,setConvStarter] = useState(false)


  const [message,setMessage] = useState('')

  const [searchInput,setSearchInput] = useState('')

  const [conv, setConv] = useState<ConversationList[]>([])
  const [newUsers,setNewUsers] = useState<UsersList[]>([])

  const [userS,setUserS] = useState('')

  const [convId,setConvId] = useState(0)


  const navigate = useNavigate()

  useEffect(() => {
    fetchConversations()
  }, [])

  // *************************************************************FETCH****************************************************************************

  async function fetchConversations() {
    setLoading(true)
    try{
      const {data} = await api.get("api/v1/chatroom/conversations")
      setConv(data)
      console.log(data)
    } catch (e: any) {
      setError(e.message ?? "Eroare la listare")

    } finally {

      setLoading(false)
    }
  }
  // *************************************************************search new users****************************************************************************
  
  async function searchNewUser() {
    setLoading(true)


    try{

      const {data} = await api.get('api/v1/chatroom/get/all/users')
      setNewUsers(data)      

    } catch(e: any) {
      if(e?.response?.status === 404) return alert("Nu au fost gasiti utilizatori")
    } finally {
      setLoading(false)
      setSearchUsers(true)

    }
  }

  async function searchForUser() {
    setLoading(true)

    try{

      const {data} = await api.get('api/v1/chatroom/get/one/user', {params: userS})

    } catch(e: any) {
      if(e?.response?.status === 404) return alert("Nu a fost gasit utilizatorul")
    } finally {
      setLoading(false)
    }
  }

  // *************************************************************PopUP****************************************************************************

  async function closePopUp() {
    setSearchUsers(false)
    setConvStarter(false)
    setConvId(0)
  }

  async function conversationStarter(id: number) {
    setSearchUsers(false)
    setConvStarter(true)
    setConvId(id)
  }




  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()

    const payload = { 
      id: convId,
      message: message
    }

    if(message.trim().length === 0) return

    setLoading(true)
    setError(null)


    try{

      const { data } = await api.post('api/v1/chat/first/message', payload)
      console.log(data)
      navigate(`/chat/${data.id}`,{ replace: true })

    } catch (e: any) {

      if(e?.response?.status === 409) alert("Nu iti poti trimite singur mesaj")
    } finally {
      setLoading(false)
    }
  }




  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 items-center justify-center p-6">
      <div className="w-full max-w-dvh rounded-2xl border border-slate-800 bg-slate-950/60 shadow-lg p-6 space-y-5">
        <div className='flex'>
          <h1 className="w-3xl text-2xl font-semibold text-slate-100">Chat room</h1> 
          <button
          disabled={loading} 
          onClick={() => searchNewUser()}
          className=" h-10 w-full rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 border border-slate-700 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >New Chat
          </button>  
        </div>       
        {conv.map(w => (
          <Link to={`/chat/${w.id}`} key={w.id}>
          <div key={w.id} className='flex justify-baseline border-1 border-b-blue-200'> 
            
              <img src={image} className='w-12 h-12' />
              <span className='p-3 min-w-64'>{w.participants[0].user.name}</span>
              <span className='p-3 m-left border-l-2  truncate'>{w.messages[0].content}</span>
           
          </div>
           </Link>
        ))}




        {searchUsers && (
            <div onClick={() => closePopUp()}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            >

                <div
                onClick={(e) => e.stopPropagation()} 
                className="w-[min(1200px,95vw)] h-[min(700px,90vh)] rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl p-6 overflow-auto flex flex-col gap-4"
                >

                  <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-100">Search for users</h3>
                      <button className="h-9 px-3 rounded-xl border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30" type="submit"  onClick={closePopUp}>
                      Inchide X
                      </button>
                  </div>


                  <div className='flex items-center '>

                      <input
                          type="text"
                          value={searchInput}
                          onChange={(e) => setSearchInput(e.target.value)}
                          placeholder="Name of the user"
                          className="h-10 w-full max-w-md rounded-xl border border-slate-800 bg-slate-900/60 px-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"

                      />

                      <button className="h-9 px-3 rounded-2xl bg-blue-600 text-white font-medium hover:bg-blue-500 border border-slate-700 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/30" type="submit"  onClick={closePopUp}>
                      Search
                      </button>
                    
                  </div>


                  <div className='grid items-center'>
                    
                    {newUsers.map(w => (
                      
                      <div key={w.id} className='flex' onClick={(e) => conversationStarter(w.id)}>
                        <img src={image} className='w-6 h-6' />
                        <span className='p-1'>{w.name}</span>
                        </div>
                    ))}

                  </div>
                </div>
              </div>
              
                    )}




        {convStarter && (
            <div onClick={() => closePopUp()}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            >

                <div
                onClick={(e) => e.stopPropagation()} 
                className="w-[min(1200px,95vw)] h-[min(700px,90vh)] rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl p-6 overflow-auto flex flex-col gap-4"
                >

                  <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-100"></h3>
                      <button className="h-9 px-3 rounded-xl border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30" type="submit"  onClick={closePopUp}>
                      Inchide X
                      </button>
                  </div>

                  <div className='grid'>
                  <div className='flex'>
                    <img src={image} className='w-12 h-12' />
                    <h1 className="text-2xl font-semibold text-slate-100 p-3">{'PLACEHOLDER NAME'}</h1>
                  </div>
                
                
                  <form onSubmit={handleSendMessage} className='flex'>
                    <input
                      type="text"
                      className="h-10 w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      />
                    <button type='submit' disabled={loading} className="h-10 w-3xs rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 border border-slate-700 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/30">{loading ? "Se Trimite..." : 'Trimite'}</button>
                  </form>
                  </div>
               </div>
              </div>
              
                    )}
      </div>
    </div>



  )
}