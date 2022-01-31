import '../styles/question.scss'

export function Question ({content, author, avatar, isAnswered, isHighlighted, children}) {
    return(
        <div className={`question ${isAnswered ? 'answered' : isHighlighted ? 'highlighted' : ''}`}>
            <p>{content}</p>
            <footer>
                <div className='user-info'>
                    <img src={avatar} alt={author} referrerPolicy='no-referrer' />
                    <span>{author}</span>
                </div>
                <div>
                    {children}
                </div>
            </footer>
        </div>
    )
}