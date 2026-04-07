import { WebSocket , WebSocketServer } from "ws";

//Instatiating a WebSocket Server
const wss = new WebSocketServer({port: 8080});

//Connection Event
wss.on('connection' , (socket , request) => {
    const ip = request.socket.remoteAddress;

    //Message Event
    socket.on('message' , (rawData) => {
        const message = rawData.toString();
        console.log({message , ip});

        //Broadcasting the reieved client message
        wss.clients.forEach(client => {
            if(client.readyState === WebSocket.OPEN) client.send(`Server Broadcast: ${message}`);
        })
    })
    socket.on('error', (error) => {
        console.error(`Error from ${ip} : ${error.message}`);
    }) 
    socket.on('close', () => {
        console.log(`Connection closed from ${ip}`);
    })
})

console.log('WebSocket Server is running on ws://localhost:8080');