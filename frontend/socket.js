import { io } from "https://cdn.socket.io/4.5.4/socket.io.esm.min.js"

const socket = io()

function sendSocketEvent(event, data=undefined) {
    if (data) socket.emit(event, data)
    else socket.emit(event)   
}

function bindSocketEvent(event, callback) {
    socket.on(event, callback)
}

export {sendSocketEvent, bindSocketEvent}