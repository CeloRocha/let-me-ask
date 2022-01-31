
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContextProvider'

export function useAuth () {
    return(useContext(AuthContext))
} 