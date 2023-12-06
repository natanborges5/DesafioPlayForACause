import { SignOut } from '@/contexts/AuthContext'
import { AppError } from '@/utils/AppError'
import axios, { AxiosError } from 'axios'

import { Router } from 'next/router'
import { destroyCookie, parseCookies, setCookie } from 'nookies'

let cookies = parseCookies()
export const ApiBaseUrl = "https://desafioplayforacause-production.up.railway.app/"
export const api = axios.create({
    baseURL: ApiBaseUrl,
    headers: {
        Authorization: `${cookies['PlayChat.token']}`,
    },
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.data) {
            if (error.response?.status === 401) {
                SignOut()
            }
            return Promise.reject(new AppError(error.response.data.message))
        } else {
            return Promise.reject(error)
        }
    },
)
