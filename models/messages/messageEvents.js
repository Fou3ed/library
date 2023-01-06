class messageEvents{

async sendMsg(){
   
    sockets = (socket, sockets) => {
        socket.on('chat:message', () => {
          sockets.emit('chat:receivedMessage');
        });
      };
}


}
export default messageEvents