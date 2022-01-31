
import { ref, onValue} from "firebase/database";
import { useState, useEffect } from 'react'
import { db } from "../services/firebase";
import { useAuth } from "./useAuth";

export function useRoom (roomId) {
    
    const { user } = useAuth()
    const [title, setTitle] = useState('')
    const [questions, setQuestions] = useState([])

    useEffect(()=>{
        const questionsRef = ref(db, `rooms/${roomId}`);
        const unmount = onValue(questionsRef, (res)=>{
            const database = res.val()
            setTitle(database.title)
            if(database?.questions){
                const data = Object.entries(database.questions)
                const parsedQuestions = data.map(([key, info]) => ({
                    key: key,
                    content: info.content,
                    author: info.author.name,
                    avatar: info.author.avatar,
                    isAnswered: info.isAnswered,
                    isHighlighted: info.isHighlighted,
                    likeCount: Object.values(info.likes ?? {}).length,
                    likeId: Object.entries(info.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
                }))
                parsedQuestions.sort((questionA, questionB) => {
                    if(questionA.isAnswered && !questionB.isAnswered){
                        return 1;
                    }else if(questionA.isAnswered && questionB.isAnswered){
                        return 0;
                    }else if(!questionA.isAnswered && questionB.isAnswered){
                        return -1;
                    }else if(questionA.isHighlighted){
                        return -1;
                    }else if(questionB.isHighlighted){
                        return 1;
                    }else{
                        return (questionB.likeCount - questionA.likeCount)
                    }
                })
                setQuestions(parsedQuestions)
            }
        })
        return(()=>{unmount()})
        // const db = getDatabase();
        // const starCountRef = ref(db, 'posts/' + postId + '/starCount');
        // onValue(starCountRef, (snapshot) => {
        //   const data = snapshot.val();
        //   updateStarCount(postElement, data);
        // });
    }, [roomId, user?.id])

    return { questions, title}
}