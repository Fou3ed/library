import {
    getCnvById
} from '../services/conversationsRequests.js'
import {
    postMessage
} from '../services/messageRequests.js'
import {
    filterForms
} from './forms.js'
import { informOperator } from './informOperator.js'

export const offlineForm = async (socket, data) => {
    try {
        const conversationDetails = await getCnvById(data.conversationId)

        let agentId = null;
        let agentFullName = null;

        for (const member of conversationDetails.member_details) {
            if (member.role === 'AGENT') {
                agentId = member._id;
                agentFullName = member.full_name;
                break;
            }
        }

        const formMsg = filterForms("2", conversationDetails.owner_id, data?.gocc_contact_id ? "gocc" : null)
        if (formMsg) {
            formMsg.status = 0
            //add message to data base and emit to the client 
            postMessage({
                app: conversationDetails.owner_id,
                user: agentId,
                action: "message.create",
                from: agentId,
                metaData: {
                    type: "form",
                    conversation_id: data.conversationId,
                    user: agentId,
                    message: JSON.stringify(formMsg),
                    data: "non other data",
                    origin: "web",
                },
                to: data.userId,
            }).then((savedMsg) => {
                socket.emit("onMessageReceived", {
                    messageData: {
                        content: savedMsg.message,
                        id: savedMsg._id,
                        from: agentId,
                        conversation: data.conversationId,
                        date: savedMsg.created_at,
                        uuid: savedMsg.uuid,
                        type: "form"
                    },
                    conversation: data.conversationId,
                    isSender: false,
                    direction: 'out',
                    userId: agentId,
                    senderName: agentFullName
                });
                let eventName = "onMessageReceived"
                let eventData = [{
                    messageData: {
                        content: savedMsg.message,
                        id: savedMsg._id,
                        from: "",
                        conversation: data.conversationId,
                        date: savedMsg.created_at,
                        uuid: savedMsg.uuid,
                        type: "form"
                    },
                    conversation: data.conversationId,
                    isSender: false,
                    direction: 'out',
                    userId: agentId,
                    senderName: agentFullName
                }]
                try {
                    informOperator(io, socket.id, {
                        app: "638dc76312488c6bf67e8fc0",
                        user: agentId,
                        action: "message.create",
                        metaData: {
                            name: agentFullName,
                            channel_url: "foued/test",
                            conversation_type: "1",
                            description: "private chat",
                            owner_id: conversationDetails.owner_id,
                            members: [agentId, data.userId],
                            permissions: {
                                "key": "value"
                            },
                            status: "0",

                            members_count: 2,
                            max_length_message: "256",
                        },
                    }, eventName, eventData);
                } catch (err) {
                    console.log("informOperator err", err)
                    throw err;
                }

            })
        }
    } catch (error) {
        console.error(error);
    }
}