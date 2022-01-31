import { useNavigate } from 'react-router-dom'
import ilustrationImg from './../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'

import '../styles/auth.scss'
import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import { db } from '../services/firebase'
import { ref, child, get } from "firebase/database";

export function Home () {
    let navigate = useNavigate()
    const { user, signInWithGoogle } = useAuth()
    const [roomCode, setRoomCode] = useState('')

    async function handleCreateRoom () {
        if(!user){
            await signInWithGoogle()
        }
        navigate('/rooms/new')
    }

    async function handleJoinRoom(event){
        event.preventDefault()
        if(roomCode.trim() === ''){ return }

        const dbRef = ref(db)
        const roomRef = await get(child(dbRef, `rooms/${roomCode}`))
        if(!roomRef.exists()) {
            alert('Room does not exist')
            return
        }
        if(roomRef.val().endedAt){
            alert('Room already closed')
            return
        }
        navigate(`/rooms/${roomCode}`)
    }

    return(
        <div className='page-auth'>
            <aside>
                <img src={ilustrationImg} alt='Ilustração simbolizando perguntas e respostas' />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo real</p>
            </aside>
            <main>
                <div className='main-content'>
                    <img src={logoImg} alt='Logo LetMeAsk' />
                    <button className='create-room' onClick={handleCreateRoom}>
                        <img src={googleIconImg} alt='Logo do Google' />
                        Crie sua sala com o Google
                    </button>
                    <div className='separator'>ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input
                            type='text'
                            placeholder='Digite o código da sala'
                            onChange={(event)=>setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type='submit'>Entrar na sala</Button>
                    </form>
                </div>

            </main>
        </div>
    )
}