import '../styles/button.scss'

export function Button ({isOutlined = false, ...props}) {
    return(
        <button className={`button ${isOutlined ? 'outlined' : ''}`} {...props} />
    )
}