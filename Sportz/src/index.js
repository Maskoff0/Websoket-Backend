import express from 'express';
import { matchRouter } from './routes/matches.js';
import http from 'http';
import { attachWebsocketServer } from './ws/server.js';
import { commentaryRouter } from './routes/commentary.js'

const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || '0.0.0.0'

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.get('/' , (req, res) => {
    res.send('Hello World');
})

app.use('/matches' , matchRouter)
app.use('/matches/:id/commentary' , commentaryRouter)

const {broadcast , broadcastComment} = attachWebsocketServer(server);
app.locals.broadcast = broadcast ;
app.locals.broadcastComment = broadcastComment ;;

app.listen(PORT , HOST , () => {
    const baseurl = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;

    console.log(`Websocket server is running on ${baseurl}`);
    console.log(`Server is running on ${baseurl.replace('http','ws')}/ws`);
});