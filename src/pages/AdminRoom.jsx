import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import '../styles/room.scss'
import { useNavigate, useParams } from 'react-router'
import { db } from '../services/firebase'
import { ref, remove, update} from "firebase/database";
import { Question } from '../components/Question'
import { useRoom } from '../hooks/useRoom'

import deleteImg from '../assets/images/delete.svg'
import answerImg from '../assets/images/answer.svg'
import checkImg from '../assets/images/check.svg'
import emptyImg from '../assets/images/empty-questions.svg'

export function AdminRoom () {

    const params = useParams()
    const roomId = params.id
    const { questions, title} = useRoom(roomId)
    const navigate = useNavigate()


    async function handleCheckIsHighlighted(questionId){
        await update(ref(db, `/rooms/${roomId}/questions/${questionId}`), ({ isHighlighted: true}))
    }

    async function handleCheckIsAnswered(questionId){
        await update(ref(db, `/rooms/${roomId}/questions/${questionId}`), ({ isAnswered: true}))

    }

    async function handleEndRoom () {
        await update(ref(db, `/rooms/${roomId}`), ({ endedAt: new Date()}))
        navigate('/')

    }

    async function handleDeleteQuestion(questionId) {
        if(window.confirm('Tem certeza que deseja excluir essa pergunta?')){
            await remove(ref(db, `/rooms/${roomId}/questions/${questionId}`))
        }
    }


    
    const questionsComponent = questions.map( question => {
        return (
            <Question
                key={question.key}
                content = {question.content}
                author={question.author}
                avatar={question.avatar}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
            >   
                {!question.isAnswered &&
                <>
                    <button
                        type='button'
                        onClick={()=>handleCheckIsAnswered(question.key)}
                    >
                        <img src={checkImg} alt='Answered Button' />
                    </button>
                    <button
                        type='button'
                        onClick={()=>handleCheckIsHighlighted(question.key)}
                    >
                        <img src={answerImg} alt='Highlight button' />
                    </button>
                </>}
                <button
                    type='button'
                    onClick={()=>handleDeleteQuestion(question.key)}
                >
                    <img src={deleteImg} alt='Delete button' />
                </button>
            </Question>
        )
    })
    console.log(questionsComponent)
    return(
        <div id="page-room">
            <header>
                <div className='content'>
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId}/>
                        <Button onClick={handleEndRoom} isOutlined>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main className='content'>
                <div className='room-title'>
                    <h1>{title}</h1>
                    {questions.length > 0 && <span>{questions.length} Pergunta(s)</span>}
                </div>
                { questionsComponent.length > 0
                ?
                <section className='questions'>
                    { questionsComponent }
                </section>
                :
                <div className='sem-perguntas'>
                    <img src={emptyImg} alt='Não existem questões'/>
                    <h2> Ainda não há perguntas</h2>
                </div>
                }
            </main>
        </div>
    )
}