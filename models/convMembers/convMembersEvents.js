import convMembers from './convMembersMethods.js';
import {
    io
} from '../../index.js';
const foued = new conversationActions
const ioConversationMembersEvents = function () {


    // onConversationMemberRequest : Fired when the join request created.
    socket.on('onConversationMemberRequest', () => {
        console.log('====================================');
        console.log("conversation member request");
        console.log('====================================');
    });
    // onConversationMemberJoined : Fired when the member join a conversation.
    socket.on('onConversationMemberJoined', () => {
        console.log('====================================');
        console.log("conversation member joined");
        console.log('====================================');
    });
    // onConversationMemberLeft : Fired when the member left a conversation.
    socket.on('onConversationMemberLeft', () => {
        console.log('====================================');
        console.log("conversation member left ");
        console.log('====================================');
    });
    // onConversationMemberBanned : Fired when the member is banned.
    socket.on('onConversationMemberBanned', () => {
        console.log('====================================');
        console.log("conversation member left");
        console.log('====================================');
    });
    // onConversationMemberUnbanned : Fired when the member is unbanned
    socket.on('onConversationMemberUnbanned', () => {
        console.log('====================================');
        console.log("conversation member unbanned");
        console.log('====================================');
    });

    // onConversationTransferRequest : Fired when transfer created.
    socket.on('onConversationTransferRequest', () => {
        console.log('====================================');
        console.log("conversation transfer request");
        console.log('====================================');
    });


    // onConversationTransferAccept : Fired when user accept transfer.
    socket.on('onConversationTransferAccept', () => {
        console.log('====================================');
        console.log("conversation transfer accepted");
        console.log('====================================');
    });

    // onConversationTransferReject : Fired when user reject transfer.
    socket.on('onConversationTransferReject', () => {
        console.log('====================================');
        console.log("conversation transfer Reject");
        console.log('====================================');
    });





}

export default ioConversationMembersEvents