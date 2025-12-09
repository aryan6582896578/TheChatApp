import { io } from 'socket.io-client';
import mitt from 'mitt'
const url = `${import.meta.env.VITE_SERVERURL}/${import.meta.env.VITE_VERSION}/@me/chat/`
export const socket = io("http://localhost:8080",{autoConnect: false});
export const emitter = mitt()

// console.log(import.meta.env.VITE_SERVERURL)
export function getJwtCookie(){  
    const cookie = document.cookie.match(/(?:^|;\s*)tokenJwt=([^;]*)/);
    if(cookie){
        return cookie[1]
      }
}
