//Received after performing emit on the part of the server side

import { randomUUID } from "crypto"


/**
 * Connections
 */

export const onConnected = {
    "uuid": randomUUID(),
    "app_id": String,
    "event_type": "connection.start",
    "event_name": "Friendly name (optional)",
    "event_time": "EVENT_TIMESTAMP",
    "payload": {
        "id": "",
        "is_online": true
    },
    "correlation": {
        "user": {
            "id": "",
            "role": "OPERATOR",
            "nickname": "",
            "full_name": "",
            "profile_url": "",
            "permissions": [],
            "is_active": true,
            "created_at": "",
            "last_seen_at": "",
            "metadata": ""
        }
    },
    "recipients": ['ID', 'ID', 'ID', 'ID'],
    "sender": {
        "id": "",
        "type": "SERVER"
    },
    "common": {
        "device": {
            "id": 28883192,
            "ip": "192.168.1.1",
            "timezone": "America/Los Angeles",
            "platform": "desktop",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
        }
    },
    "is_public": "true",
}



export const onDisconnected = {
    "uuid": "",
    "app": "ID",
    "event_type": "connection.end",
    "event_name": "Friendly name (optional)",
    "event_time": "EVENT_TIMESTAMP",
    "payload": {
        "id": "",
        "is_online": false
    },
    "correlation": {
        "user": {
            "id": "",
            "role": "OPERATOR",
            "nickname": "",
            "full_name": "",
            "profile_url": "",
            "permissions": [],
            "is_active": true,
            "created_at": "",
            "last_seen_at": "",
            "metadata": ""
        }
    },
    "recipients": ['ID', 'ID', 'ID', 'ID'],
    "sender": {
        "id": "",
        "type": "SERVER"
    },
    "common": {
        "device": {
            "id": 28883192,
            "ip": "192.168.1.1",
            "timezone": "America/Los Angeles",
            "platform": "desktop",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
        }
    },
    "is_public": "true",
}
export const onServerError = {
    "uuid": "",
    "app": "ID",
    "event_type": "server.error",
    "event_name": "Friendly name (optional)",
    "event_time": "EVENT_TIMESTAMP",
    "payload": {
        "id": "",
        "type": "",
        "reason": ""
    },
    "correlation": {},
    "recipients": ['ID', 'ID', 'ID', 'ID'],
    "sender": {
        "id": "",
        "type": "SERVER"
    },
    "common": {},
    "is_public": "true",
}


export const onConversationCreated = {
    "uuid": "",
    "app": "ID",
    "event_type": "conversation.create",
    "event_name": "Friendly name (optional)",
    "event_time": "EVENT_TIMESTAMP",
    "payload": {
        "id": "",
        "name": "",
        "channel_url": "",
        "conversation_type": "",
        "description": "",
        "members_count": "",
        "owner": "ID",
        "operators": [],
        "members": [],
        "permissions": [],
        "max_length_message": "",
        "created_at": "",
        "metadata": ""
    },
    "correlation": {},
    "recipients": ['ID', 'ID', 'ID', 'ID'],
    "sender": {
        "id": "",
        "type": "USER"
    },
    "common": {
        "device": {
            "id": 28883192,
            "ip": "192.168.1.1",
            "timezone": "America/Los Angeles",
            "platform": "desktop",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
        }
    },
    "is_public": "true",
}

export const onConversationUpdated = {
    "uuid": "",
    "app": "ID",
    "event_type": "conversation.update",
    "event_name": "Friendly name (optional)",
    "event_time": "EVENT_TIMESTAMP",
    "payload": {
        "id": "",
        "fields": []
    },
    "correlation": {
        "conversation": {
            "id": "",
            "name": "",
            "channel_url": "",
            "conversation_type": "",
            "description": "",
            "members_count": "",
            "owner": "ID",
            "operators": [],
            "members": [],
            "permissions": [],
            "max_length_message": "",
            "created_at": "",
            "metadata": ""
        }
    },
    "recipients": ['ID', 'ID', 'ID', 'ID'],
    "sender": {
        "id": "",
        "type": "USER"
    },
    "common": {
        "device": {
            "id": 28883192,
            "ip": "192.168.1.1",
            "timezone": "America/Los Angeles",
            "platform": "desktop",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
        }
    },
    "is_public": "true",
}
export const onConversationDeleted = {
    "uuid": "",
    "app": "ID",
    "event_type": "conversation.delete",
    "event_name": "Friendly name (optional)",
    "event_time": "EVENT_TIMESTAMP",
    "payload": {
        "id": ""
    },
    "correlation": {},
    "recipients": ['ID', 'ID', 'ID', 'ID'],
    "sender": {
        "id": "",
        "type": "USER"
    },
    "common": {
        "device": {
            "id": 28883192,
            "ip": "192.168.1.1",
            "timezone": "America/Los Angeles",
            "platform": "desktop",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
        }
    },
    "is_public": "true",
}
export const onConversationEnded = {
    "uuid": "",
    "app": "ID",
    "event_type": "conversation.end",
    "event_name": "Friendly name (optional)",
    "event_time": "EVENT_TIMESTAMP",
    "payload": {
        "id": "",
        "user": ["ID"],
        "reason": ""
    },
    "correlation": {
        "conversation": {
            "id": "",
            "name": "",
            "channel_url": "",
            "conversation_type": "",
            "description": "",
            "members_count": "",
            "owner_id": "",
            "operators": [],
            "members": [],
            "permissions": [],
            "max_length_message": "",
            "created_at": "",
            "metadata": ""
        }
    },
    "recipients": ['ID', 'ID', 'ID', 'ID'],
    "sender": {
        "id": "",
        "type": "USER"
    },
    "common": {
        "device": {
            "id": 28883192,
            "ip": "192.168.1.1",
            "timezone": "America/Los Angeles",
            "platform": "desktop",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
        }
    },
    "is_public": "true",
}

/**
 * Conversation Members
 */
export const onConversationMemberRequest = {
    "uuid": "",
    "app": "ID",
    "event_type": "conversation.member.request",
    "event_name": "Friendly name (optional)",
    "event_time": "EVENT_TIMESTAMP",
    "payload": {
        "id": "",
        "user": "ID",
        "conversation": "ID",
        "permissions": [],
        "created_at": ""
    },
    "correlation": {
        "conversation": {
            "id": "",
            "name": "",
            "channel_url": "",
            "conversation_type": "",
            "description": "",
            "members_count": "",
            "owner": "ID",
            "operators": [],
            "members": [],
            "permissions": [],
            "max_length_message": "",
            "created_at": "",
            "metadata": ""
        },
        "user": {
            "id": "",
            "role": "CLIENT",
            "nickname": "",
            "full_name": "",
            "profile_url": "",
            "permissions": "",
            "is_active": true,
            "created_at": "",
            "last_seen_at": "",
            "metadata": ""
        }
    },
    "recipients": ['ID', 'ID', 'ID', 'ID'],
    "sender": {
        "id": "",
        "type": "USER"
    },
    "common": {
        "device": {
            "id": 28883192,
            "ip": "192.168.1.1",
            "timezone": "America/Los Angeles",
            "platform": "desktop",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
        }
    },
    "is_public": "true",
}
export const onConversationMemberJoined = {
    "uuid": "",
    "app": "ID",
    "event_type": "conversation.member.join",
    "event_name": "Friendly name (optional)",
    "event_time": "EVENT_TIMESTAMP",
    "payload": {
        "id": "",
        "user": "ID",
        "conversation": "ID",
        "permissions": [],
        "created_at": ""
    },
    "correlation": {
        "conversation": {
            "id": "",
            "name": "",
            "channel_url": "",
            "conversation_type": "",
            "description": "",
            "members_count": "",
            "owner": "ID",
            "operators": [],
            "members": [],
            "permissions": [],
            "max_length_message": "",
            "created_at": "",
            "metadata": ""
        },
        "user": {
            "id": "",
            "role": "CLIENT",
            "nickname": "",
            "full_name": "",
            "profile_url": "",
            "permissions": "",
            "is_active": true,
            "created_at": "",
            "last_seen_at": "",
            "metadata": ""
        }
    },
    "recipients": ['ID', 'ID', 'ID', 'ID'],
    "sender": {
        "id": "",
        "type": "USER"
    },
    "common": {
        "device": {
            "id": 28883192,
            "ip": "192.168.1.1",
            "timezone": "America/Los Angeles",
            "platform": "desktop",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
        }
    },
    "is_public": "true",
}

export const onConversationMemberLeft = {
    "uuid": "",
    "app": "ID",
    "event_type": "conversation.member.left",
    "event_name": "Friendly name (optional)",
    "event_time": "EVENT_TIMESTAMP",
    "payload": {
        "id": "",
        "user": "ID",
        "conversation": "ID",
        "reason": "",
        "created_at": ""
    },
    "correlation": {
        "conversation": {
            "id": "",
            "name": "",
            "channel_url": "",
            "conversation_type": "",
            "description": "",
            "members_count": "",
            "owner": "ID",
            "operators": [],
            "members": [],
            "permissions": [],
            "max_length_message": "",
            "created_at": "",
            "metadata": ""
        },
        "user": {
            "id": "",
            "role": "CLIENT",
            "nickname": "",
            "full_name": "",
            "profile_url": "",
            "permissions": "",
            "is_active": true,
            "created_at": "",
            "last_seen_at": "",
            "metadata": ""
        }
    },
    "recipients": ['ID', 'ID', 'ID', 'ID'],
    "sender": {
        "id": "",
        "type": "USER"
    },
    "common": {
        "device": {
            "id": 28883192,
            "ip": "192.168.1.1",
            "timezone": "America/Los Angeles",
            "platform": "desktop",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
        }
    },
    "is_public": "true",
}
export const onConversationMemberBanned = {
    "uuid": "",
    "app": "ID",
    "event_type": "conversation.member.ban",
    "event_name": "Friendly name (optional)",
    "event_time": "EVENT_TIMESTAMP",
    "payload": {
        "id": "",
        "user": "ID",
        "conversation": "ID",
        "reason": "",
        "created_at": ""
    },
    "correlation": {
        "conversation": {
            "id": "",
            "name": "",
            "channel_url": "",
            "conversation_type": "",
            "description": "",
            "members_count": "",
            "owner": "ID",
            "operators": [],
            "members": [],
            "permissions": [],
            "max_length_message": "",
            "created_at": "",
            "metadata": ""
        },
        "user": {
            "id": "",
            "role": "CLIENT",
            "nickname": "",
            "full_name": "",
            "profile_url": "",
            "permissions": "",
            "is_active": true,
            "created_at": "",
            "last_seen_at": "",
            "metadata": ""
        }
    },
    "recipients": ['ID', 'ID', 'ID', 'ID'],
    "sender": {
        "id": "",
        "type": "USER"
    },
    "common": {
        "device": {
            "id": 28883192,
            "ip": "192.168.1.1",
            "timezone": "America/Los Angeles",
            "platform": "desktop",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
        }
    },
    "is_public": "true",
}

export const onConversationMemberUnbanned = {
    "uuid": "",
    "app": "ID",
    "event_type": "conversation.member.unban",
    "event_name": "Friendly name (optional)",
    "event_time": "EVENT_TIMESTAMP",
    "payload": {
        "id": "",
        "user": "ID",
        "conversation": "ID",
        "reason": "",
        "created_at": ""
    },
    "correlation": {
        "conversation": {
            "id": "",
            "name": "",
            "channel_url": "",
            "conversation_type": "",
            "description": "",
            "members_count": "",
            "owner": "ID",
            "operators": [],
            "members": [],
            "permissions": [],
            "max_length_message": "",
            "created_at": "",
            "metadata": ""
        },
        "user": {
            "id": "",
            "role": "CLIENT",
            "nickname": "",
            "full_name": "",
            "profile_url": "",
            "permissions": "",
            "is_active": true,
            "created_at": "",
            "last_seen_at": "",
            "metadata": ""
        }
    },
    "recipients": ['ID', 'ID', 'ID', 'ID'],
    "sender": {
        "id": "",
        "type": "USER"
    },
    "common": {
        "device": {
            "id": 28883192,
            "ip": "192.168.1.1",
            "timezone": "America/Los Angeles",
            "platform": "desktop",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
        }
    },
    "is_public": "true",
}

/**
 * conversation Transfers
 */

export const onConversationTransferRequest = {
    "uuid": "",
    "app": "ID",
    "event_type": "conversation.transfer.request",
    "event_name": "Friendly name (optional)",
    "event_time": "EVENT_TIMESTAMP",
    "payload": {
        "id": "",
        "user": ["ID"],
        "conversation": "ID",
        "permissions": [],
        "validity": "",
        "created_at": ""
    },
    "correlation": {
        "conversation": {
            "id": "",
            "name": "",
            "channel_url": "",
            "conversation_type": "",
            "description": "",
            "members_count": "",
            "owner": "ID",
            "operators": [],
            "members": [],
            "permissions": [],
            "max_length_message": "",
            "created_at": "",
            "metadata": ""
        },
        "user": {
            "id": "",
            "role": "CLIENT",
            "nickname": "",
            "full_name": "",
            "profile_url": "",
            "permissions": "",
            "is_active": true,
            "created_at": "",
            "last_seen_at": "",
            "metadata": ""
        }
    },
    "recipients": ['ID', 'ID', 'ID', 'ID'],
    "sender": {
        "id": "",
        "type": "USER"
    },
    "common": {
        "device": {
            "id": 28883192,
            "ip": "192.168.1.1",
            "timezone": "America/Los Angeles",
            "platform": "desktop",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
        }
    },
    "is_public": "true",
}
export const onConversationTransferAccepted = {
    "uuid": "",
    "app": "ID",
    "event_type": "conversation.transfer.accept",
    "event_name": "Friendly name (optional)",
    "event_time": "EVENT_TIMESTAMP",
    "payload": {
        "id": "",
        "user": "ID",
        "conversation": "ID",
        "created_at": ""
    },
    "correlation": {
        "conversation": {
            "id": "",
            "name": "",
            "channel_url": "",
            "conversation_type": "",
            "description": "",
            "members_count": "",
            "owner": "ID",
            "operators": [],
            "members": [],
            "permissions": [],
            "max_length_message": "",
            "created_at": "",
            "metadata": ""
        },
        "user": {
            "id": "",
            "role": "CLIENT",
            "nickname": "",
            "full_name": "",
            "profile_url": "",
            "permissions": "",
            "is_active": true,
            "created_at": "",
            "last_seen_at": "",
            "metadata": ""
        }
    },
    "recipients": ['ID', 'ID', 'ID', 'ID'],
    "sender": {
        "id": "",
        "type": "USER"
    },
    "common": {
        "device": {
            "id": 28883192,
            "ip": "192.168.1.1",
            "timezone": "America/Los Angeles",
            "platform": "desktop",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
        }
    },
    "is_public": "true",
}
export const onConversationTransferRejected = {
    "uuid": "",
    "app": "ID",
    "event_type": "conversation.transfer.reject",
    "event_name": "Friendly name (optional)",
    "event_time": "EVENT_TIMESTAMP",
    "payload": {
        "id": "",
        "user": "ID",
        "conversation": "ID",
        "reason": "",
        "created_at": ""
    },
    "correlation": {
        "conversation": {
            "id": "",
            "name": "",
            "channel_url": "",
            "conversation_type": "",
            "description": "",
            "members_count": "",
            "owner": "ID",
            "operators": [],
            "members": [],
            "permissions": [],
            "max_length_message": "",
            "created_at": "",
            "metadata": ""
        },
        "user": {
            "id": "",
            "role": "CLIENT",
            "nickname": "",
            "full_name": "",
            "profile_url": "",
            "permissions": "",
            "is_active": true,
            "created_at": "",
            "last_seen_at": "",
            "metadata": ""
        }
    },
    "recipients": ['ID', 'ID', 'ID', 'ID'],
    "sender": {
        "id": "",
        "type": "USER"
    },
    "common": {
        "device": {
            "id": 28883192,
            "ip": "192.168.1.1",
            "timezone": "America/Los Angeles",
            "platform": "desktop",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
        }
    },
    "is_public": "true",
}

/**
 * Messages
 */
export const onMessageCreated = {
    "uuid": "",
    "app": "ID",
    "event_type": "message.create",
    "event_name": "Friendly name (optional)",
    "event_time": "EVENT_TIMESTAMP",
    "payload": {
        "id": "",
        "type": "MSG",
        "conversation": "ID",
        "content": "",
        "parent": "ID",
        "created_at": "",
        "metadata": ""
    },
    "correlation": {
        "message": {}
    },
    "recipients": ['ID', 'ID', 'ID', 'ID'],
    "sender": {
        "id": "",
        "type": "USER"
    },
    "common": {
        "device": {
            "id": 28883192,
            "ip": "192.168.1.1",
            "timezone": "America/Los Angeles",
            "platform": "desktop",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
        }
    },
    "is_public": "true",
}

export const onMessageUpdated = {
    "uuid": "",
    "app": "ID",
    "event_type": "message.update",
    "event_name": "Friendly name (optional)",
    "event_time": "EVENT_TIMESTAMP",
    "payload": {
        "id": "",
        "type": "MSG",
        "conversation": "ID",
        "content": "",
        "parent": "ID",
        "created_at": "",
        "metadata": ""
    },
    "correlation": {
        "message": {}
    },
    "recipients": ['ID', 'ID', 'ID', 'ID'],
    "sender": {
        "id": "",
        "type": "USER"
    },
    "common": {
        "device": {
            "id": 28883192,
            "ip": "192.168.1.1",
            "timezone": "America/Los Angeles",
            "platform": "desktop",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
        }
    },
    "is_public": "true",
}

export const onMessageDeleted = {
    "uuid": "",
    "app": "ID",
    "event_type": "message.delete",
    "event_name": "Friendly name (optional)",
    "event_time": "EVENT_TIMESTAMP",
    "payload": {
        "id": "",
        "type": "MSG",
        "conversation": "ID",
        "parent": "ID",
        "created_at": "",
        "metadata": ""
    },
    "correlation": {},
    "recipients": ['ID', 'ID', 'ID', 'ID'],
    "sender": {
        "id": "",
        "type": "USER"
    },
    "common": {
        "device": {
            "id": 28883192,
            "ip": "192.168.1.1",
            "timezone": "America/Los Angeles",
            "platform": "desktop",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
        }
    },
    "is_public": "true",
}
export const onMessageDelivered = {
    "uuid": "",
    "app": "ID",
    "event_type": "message.delivered",
    "event_name": "Friendly name (optional)",
    "event_time": "EVENT_TIMESTAMP",
    "payload": {
        "id": "",
        "type": "MSG",
        "conversation": "ID",
        "created_at": "",
        "metadata": ""
    },
    "correlation": {
        "message": {}
    },
    "recipients": ['ID', 'ID', 'ID', 'ID'],
    "sender": {
        "id": "",
        "type": "USER"
    },
    "common": {
        "device": {
            "id": 28883192,
            "ip": "192.168.1.1",
            "timezone": "America/Los Angeles",
            "platform": "desktop",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
        }
    },
    "is_public": "true",
}


/**
 * Media
 */

export const onMediaCreated = {
    "uuid": "",
    "app": "ID",
    "event_type": "media.create",
    "event_name": "Friendly name (optional)",
    "event_time": "EVENT_TIMESTAMP",
    "payload": {
        "id": "",
        "type": "PDF",
        "conversation": "ID",
        "message": "ID",
        "name": "",
        "content": "",
        "content_type": "",
        "size": "",
        "url": "",
        "created_at": "",
        "metadata": ""
    },
    "correlation": {
        "message": {}
    },
    "recipients": ['ID', 'ID', 'ID', 'ID'],
    "sender": {
        "id": "",
        "type": "USER"
    },
    "common": {
        "device": {
            "id": 28883192,
            "ip": "192.168.1.1",
            "timezone": "America/Los Angeles",
            "platform": "desktop",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
        }
    },
    "is_public": "true",
}
export const onMediaDeleted = {
    "uuid": "",
    "app": "ID",
    "event_type": "media.delete",
    "event_name": "Friendly name (optional)",
    "event_time": "EVENT_TIMESTAMP",
    "payload": {
        "id": "",
        "type": "PDF",
        "conversation": "ID",
        "message": "ID",
        "name": "",
        "reason": "",
        "created_at": "",
        "metadata": ""
    },
    "correlation": {},
    "recipients": ['ID', 'ID', 'ID', 'ID'],
    "sender": {
        "id": "",
        "type": "USER"
    },
    "common": {
        "device": {
            "id": 28883192,
            "ip": "192.168.1.1",
            "timezone": "America/Los Angeles",
            "platform": "desktop",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
        }
    },
    "is_public": "true",
}
export const onMediaDelivered = {
    "uuid": "",
    "app": "ID",
    "event_type": "media.delivered",
    "event_name": "Friendly name (optional)",
    "event_time": "EVENT_TIMESTAMP",
    "payload": {
        "id": "",
        "type": "PDF",
        "conversation": "ID",
        "message": "ID",
        "name": "",
        "created_at": "",
        "metadata": ""
    },
    "correlation": {},
    "recipients": ['ID', 'ID', 'ID', 'ID'],
    "sender": {
        "id": "",
        "type": "USER"
    },
    "common": {
        "device": {
            "id": 28883192,
            "ip": "192.168.1.1",
            "timezone": "America/Los Angeles",
            "platform": "desktop",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
        }
    },
    "is_public": "true",
}
/**
 * Actions
 */

export const onMessageRead = {
    "uuid": "",
    "app": "ID",
    "event_type": "message.read",
    "event_name": "Friendly name (optional)",
    "event_time": "EVENT_TIMESTAMP",
    "payload": {
        "id": "",
        "conversation": "ID",
        "message": "ID",
        "user": "ID",
        "created_at": ""
    },
    "correlation": {
        "message": {},
        "user": {}
    },
    "recipients": ['ID', 'ID', 'ID', 'ID'],
    "sender": {
        "id": "",
        "type": "USER"
    },
    "common": {
        "device": {
            "id": 28883192,
            "ip": "192.168.1.1",
            "timezone": "America/Los Angeles",
            "platform": "desktop",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
        }
    },
    "is_public": "true",
}
export const onMessagePinned = {
    "uuid": "",
    "app": "ID",
    "event_type": "message.pin",
    "event_name": "Friendly name (optional)",
    "event_time": "EVENT_TIMESTAMP",
    "payload": {
        "id": "",
        "conversation": "ID",
        "message": "ID",
        "user": "ID",
        "created_at": ""
    },
    "correlation": {
        "message": {},
        "user": {}
    },
    "recipients": ['ID', 'ID', 'ID', 'ID'],
    "sender": {
        "id": "",
        "type": "USER"
    },
    "common": {
        "device": {
            "id": 28883192,
            "ip": "192.168.1.1",
            "timezone": "America/Los Angeles",
            "platform": "desktop",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
        }
    },
    "is_public": "true",
}

export const onMessageUnpinned = {
    "uuid": "",
    "app": "ID",
    "event_type": "message.unpin",
    "event_name": "Friendly name (optional)",
    "event_time": "EVENT_TIMESTAMP",
    "payload": {
        "id": "",
        "conversation": "ID",
        "message": "ID",
        "user": "ID",
        "created_at": ""
    },
    "correlation": {
        "message": {},
        "user": {}
    },
    "recipients": ['ID', 'ID', 'ID', 'ID'],
    "sender": {
        "id": "",
        "type": "USER"
    },
    "common": {
        "device": {
            "id": 28883192,
            "ip": "192.168.1.1",
            "timezone": "America/Los Angeles",
            "platform": "desktop",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
        }
    },
    "is_public": "true",
}

export const onMessageReacted = {
    "uuid": "",
    "app": "ID",
    "event_type": "message.react",
    "event_name": "Friendly name (optional)",
    "event_time": "EVENT_TIMESTAMP",
    "payload": {
        "id": "",
        "conversation": "ID",
        "message": "ID",
        "user": "ID",
        "type": "",
        "created_at": "",
        "metadata": ""
    },
    "correlation": {
        "message": {},
        "user": {}
    },
    "recipients": ['ID', 'ID', 'ID', 'ID'],
    "sender": {
        "id": "",
        "type": "USER"
    },
    "common": {
        "device": {
            "id": 28883192,
            "ip": "192.168.1.1",
            "timezone": "America/Los Angeles",
            "platform": "desktop",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
        }
    },
    "is_public": "true",
}

export const onMessageUnReacted = {
    "uuid": "",
    "app": "ID",
    "event_type": "message.unreact",
    "event_name": "Friendly name (optional)",
    "event_time": "EVENT_TIMESTAMP",
    "payload": {
        "id": "",
        "conversation": "ID",
        "message": "ID",
        "user": "ID",
        "created_at": ""
    },
    "correlation": {
        "message": {},
        "user": {}
    },
    "recipients": ['ID', 'ID', 'ID', 'ID'],
    "sender": {
        "id": "",
        "type": "USER"
    },
    "common": {
        "device": {
            "id": 28883192,
            "ip": "192.168.1.1",
            "timezone": "America/Los Angeles",
            "platform": "desktop",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
        }
    },
    "is_public": "true",
}
export const onMentionRequest = {
    "uuid": "",
    "app": "ID",
    "event_type": "mention.create",
    "event_name": "Friendly name (optional)",
    "event_time": "EVENT_TIMESTAMP",
    "payload": {
        "id": "",
        "conversation": "ID",
        "message": "ID",
        "users": ["ID"],
        "created_at": ""
    },
    "correlation": {
        "message": {},
        "user": {}
    },
    "recipients": ['ID', 'ID', 'ID', 'ID'],
    "sender": {
        "id": "",
        "type": "USER"
    },
    "common": {
        "device": {
            "id": 28883192,
            "ip": "192.168.1.1",
            "timezone": "America/Los Angeles",
            "platform": "desktop",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
        }
    },
    "is_public": "true",
}
export const onMentionDeleted = {
    "uuid": "",
    "app": "ID",
    "event_type": "mention.delete",
    "event_name": "Friendly name (optional)",
    "event_time": "EVENT_TIMESTAMP",
    "payload": {
        "id": "",
        "conversation": "ID",
        "message": "ID",
        "user": ["ID"],
        "created_at": ""
    },
    "correlation": {
        "message": {},
        "user": {}
    },
    "recipients": ['ID', 'ID', 'ID', 'ID'],
    "sender": {
        "id": "",
        "type": "USER"
    },
    "common": {
        "device": {
            "id": 28883192,
            "ip": "192.168.1.1",
            "timezone": "America/Los Angeles",
            "platform": "desktop",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
        }
    },
    "is_public": "true",
}
export const onMentionDelivered = {
    "uuid": "",
    "app": "ID",
    "event_type": "mention.delivered",
    "event_name": "Friendly name (optional)",
    "event_time": "EVENT_TIMESTAMP",
    "payload": {
        "id": "",
        "conversation": "ID",
        "message": "ID",
        "user": ["ID"],
        "created_at": ""
    },
    "correlation": {
        "message": {},
        "user": {}
    },
    "recipients": ['ID', 'ID', 'ID', 'ID'],
    "sender": {
        "id": "",
        "type": "USER"
    },
    "common": {
        "device": {
            "id": 28883192,
            "ip": "192.168.1.1",
            "timezone": "America/Los Angeles",
            "platform": "desktop",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
        }
    },
    "is_public": "true",
}
export const onTypingStarted = {
    "uuid": "",
    "app": "ID",
    "event_type": "typing.start",
    "event_name": "Friendly name (optional)",
    "event_time": "EVENT_TIMESTAMP",
    "payload": {
        "id": "",
        "conversation": "ID",
        "created_at": ""
    },
    "correlation": {},
    "recipients": ['ID', 'ID', 'ID', 'ID'],
    "sender": {
        "id": "",
        "type": "USER"
    },
    "common": {
        "device": {
            "id": 28883192,
            "ip": "192.168.1.1",
            "timezone": "America/Los Angeles",
            "platform": "desktop",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
        }
    },
    "is_public": "true",
}
export const onTypingStopped = {
    "uuid": "",
    "app": "ID",
    "event_type": "typing.stop",
    "event_name": "Friendly name (optional)",
    "event_time": "EVENT_TIMESTAMP",
    "payload": {
        "id": "",
        "conversation": "ID",
        "created_at": ""
    },
    "correlation": {},
    "recipients": ['ID', 'ID', 'ID', 'ID'],
    "sender": {
        "id": "",
        "type": "USER"
    },
    "common": {
        "device": {
            "id": 28883192,
            "ip": "192.168.1.1",
            "timezone": "America/Los Angeles",
            "platform": "desktop",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
        }
    },
    "is_public": "true",
}