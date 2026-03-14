import { useEffect, useRef ,useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import image from '../images/image.png'
import type { ReactFormState } from 'react-dom/client'
import { socket } from '../api/socket'
import api from '../api/axios'
import { jwtDecode } from 'jwt-decode'


type Messages = {
  id?: number
  me: boolean
  content: string
  sendersId: number
  conversationId: number
}

type ListResponseMessages = {
  messages: Messages[]
}

type JwtPayload = {
  sub: number
}

export default function Chat() {

  const { id } = useParams()

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const navigate = useNavigate()
  const bottomRef = useRef<HTMLDivElement | null>(null)
  
  const [message,setMessage] = useState('')

  const [chatMessages, setChatMessages] = useState<Messages[]>([])

  const token = localStorage.getItem("token")

  const decoded = token ? jwtDecode<JwtPayload>(token) : null

  const currentUserId = decoded?.sub

  useEffect(() => {
    socket.connect()
    fetchMessages()


    socket.emit("join_conversation", {conversationId: id})

    socket.on("message_received", (msg) => {
        setChatMessages(prev => [...prev, {id: msg.id , me: msg.sendersId === currentUserId, content: msg.content , sendersId: msg.sendersId , conversationId: msg.conversationId}])
    })
    
    return () => {
      //eliminam listenerul
      socket.off("message_received")
      socket.disconnect()
    }
  }, [])
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' })
  }, [chatMessages])

  async function fetchMessages(){
    setLoading(true)
    console.log(id)
    try{
      const { data } = await api.get(`api/v1/chat/get/messages/${id}`)
      setChatMessages(data)
    } catch(e: any) {
      if(e?.response?.status === 400) navigate("/chatroom", {replace: true})
    } finally {
      setLoading(false)
    }
  }


  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()


    if(message.trim().length === 0) return

    if(!socket.connected) {
      console.log("nu s-a conectat socketul")
      return
    }

    setSubmitting(true)
    setError(null)

 

    try{

      console.log(message)
      setMessage('')
      socket.emit(
        "message_send",
        { message: message , conversationId: id },
        (res: Messages) => {
          console.log("Raspuns: ", res)
          // setChatMessages(prev => [...prev , {id: res.id , me: true , content: message }])
        }
      )
      
    } catch (e: any) {

    } finally {
      setSubmitting(false)
    }
  }



  return (
    <div className="bg-slate-900 text-slate-100 flex items-center justify-center p-6 min-h-screen">
      <div className="w-1/2 h-[80vh] rounded-2xl border border-slate-800 bg-slate-950/60 shadow-lg p-6 flex flex-col">
        
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <img src={image} className="w-12 h-12" />
          <h1 className="text-2xl font-semibold text-slate-100">
            PLACEHOLDER NAME
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-2 border-b border-slate-800">
          {chatMessages.map((w) => (
            <div
              key={w.id}
              className={`flex w-full ${w.me ? "justify-end" : "justify-start"}`}
            >
              <span className="bg-slate-700 px-3 py-2 rounded-lg min-w-0 max-w-[65%] break-all">
                {w.content}
              </span>
            </div>
          ))}
          <div ref={bottomRef}/>
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2 pt-4">
          <input
            type="text"
            className="h-10 w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="h-10 px-4 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 border border-slate-700 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            {submitting ? "Se Trimite..." : "Trimite"}
          </button>
        </form>
      </div>
    </div>
  )
}