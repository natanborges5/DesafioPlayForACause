import { api } from '@/services/api'
import Router from 'next/router'
import jwt from 'jsonwebtoken'
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import { ReactNode, createContext, useEffect, useState } from 'react'
import { Flex, Spinner } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { AppError } from '@/utils/AppError'
type User = {
    id: string
    email: string
}
type TokenPayload = {
    email: string
    sub: string
    iat: number
    exp: number
}

type SignInCredentials = {
    email: string
    password: string
}

type AuthContextData = {
    signIn(credentials: SignInCredentials): Promise<void>
    user?: User
    isAuthenticated: boolean
}

type AuthProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData)

export async function SignOut() {
    destroyCookie(undefined, 'PlayChat.token')
    destroyCookie(undefined, 'PlayChat.refreshToken')

    Router.push('/')
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User>()
    const [loading, setLoading] = useState(true)
    const isAuthenticated = !!user
    const toast = useToast()
    const verifyUser = async () => {
        try {
            const { 'PlayChat.token': token } = parseCookies()
            if (token) {
                const { exp, email, sub } = jwt.decode(token) as TokenPayload
                if (exp < Date.now() / 1000) {
                    await SignOut()
                    toast({
                        title: 'Login Expirado.',
                        status: 'error',
                        duration: 4000,
                        isClosable: true,
                    })
                } else {
                    setUser({
                        email,
                        id: sub
                    })
                    api.defaults.headers['Authorization'] = 'Bearer ' + token
                }
            } else {
                await SignOut()
            }
        } catch (error) {
            await SignOut()
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        verifyUser()
    }, [])

    async function signIn({ email, password }: SignInCredentials) {
        try {
            const response = await api.post('/sessions', {
                email,
                password,
            })
            const { access_token } = response.data
            const { sub } = jwt.decode(access_token) as TokenPayload
            setCookie(undefined, 'PlayChat.token', access_token, {
                maxAge: 60 * 60 * 24 * 50,
                path: '/',
            })
            setUser({
                email,
                id: sub
            })

            api.defaults.headers['Authorization'] = 'Bearer ' + access_token
            toast({
                title: 'Login Realizado.',
                status: 'success',
                duration: 4000,
                isClosable: true,
            })
            Router.push('/chat')
        } catch (error) {
            const isAppError = error instanceof AppError
            const title = isAppError
                ? error.message
                : 'Não foi possível entrar. Tente novamente mais tarde.'
            toast({
                title,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }
    }
    if (loading) {
        return (
            <Flex
                alignItems="Center"
                justifyContent="center"
                height="100vh"
                width="100vw"
            >
                <Spinner size="xl" color="yellow"></Spinner>
            </Flex>
        )
    }
    if (!isAuthenticated && Router.pathname !== '/') {
        return null // Não renderizar nada se o usuário não estiver autenticado
    }

    return (
        <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
            {children}
        </AuthContext.Provider>
    )
}
