import conversation from './conversationModel.js'


const ioEvents = function(io){

    //room namespace
    io.of('/conversation').on('connection',function(socket){

	// Create a new room

    socket.on('createConversation', function(title) {
        conversation.findOne({'title': new RegExp('^' + title + '$', 'i')}, function(err, room){
            if(err) throw err;
            if(room){
                socket.emit('updateConversationList', { error: 'conversation title already exists.' });
            } else {
                conversation.create({ 
                    title: title
                }, function(err, newRoom){
                    if(err) throw err;
                    socket.emit('updateConversationList', newRoom);
                    socket.broadcast.emit('updateConversationList', newRoom);
                });
            }
        });
    });

});
}


export default ioEvents


