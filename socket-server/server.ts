import express from "express";
import http from "http";
import {Server} from "socket.io";
import { startScheduler } from "./scheduler/matchScheduler";
import { calculateRanking } from "./scheduler/rankingScheduler";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
<<<<<<< HEAD
        origin: ['http://localhost:3000', 'http://192.168.100.22:3000']
=======
        origin: ['http://localhost:3000']
>>>>>>> e20b911618b407610e2432ed7712fac05003b0fa
    }
});

io.on("connect", socket => {
    socket.on("join-match", gameID => {
        console.log("Match ID:",gameID);
        socket.join(`match_${gameID}`);
    });
})

startScheduler(io);
calculateRanking();

server.listen(5000);