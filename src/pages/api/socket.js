import { Server } from 'socket.io'
import { io } from 'socket.io-client'

export default function handler(req, res) {
  if(res.socket.server.io){
    console.log('Socket is already running')
  }
  else{
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', socket => {
      socket.on("join-room", async (player, cb) => {
        let roomSockets = await io.in(player.room).fetchSockets();
        console.log("Number of users:", roomSockets.length);
        if (roomSockets.length < 2) {
          socket.join(player.room);
          addUser(player);
          let success = true;
          cb(success);
        } else {
          let success = false;
          cb(success);
        }

      });

      socket.on('input-change', msg => {
        console.log(msg)
        socket.broadcast.emit('update-input', msg)
      })
      socket.on('increment', msg => {
        console.log(msg)
        socket.broadcast.emit('incremented', msg)
      })
    })
  }
  res.end()
}