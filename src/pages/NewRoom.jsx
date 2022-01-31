import { Link, useNavigate } from 'react-router-dom'

import ilustrationImg from './../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import '../styles/auth.scss'
import { Button } from '../components/Button'
import { useState } from 'react'
import { db } from '../services/firebase'
import { ref, push} from "firebase/database";
import { useAuth } from '../hooks/useAuth'

export function NewRoom () {

    const navigate = useNavigate()

    const {user} = useAuth()

    const [newRoom, setNewRoom] = useState('');

    async function handleSubmit (event){
        event.preventDefault()
        if(newRoom.trim() === '') {return}
        const { key } = await push(ref(db, '/rooms'),{
            title:  newRoom,
            authorID: user.id
        })
        navigate(`/admin/rooms/${key}`)
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
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type='text'
                            placeholder='Nome da Sala'
                            onChange={(event) => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button type='submit'>Criar sala</Button>
                    </form>
                    <p>Quer entrar em uma sala existente? <Link to='/'>Clique Aqui</Link></p>
                </div>

            </main>
        </div>
    )
}