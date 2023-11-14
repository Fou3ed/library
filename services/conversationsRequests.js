import conversation from '../models/conversations/conversationModel.js'
import members from '../models/convMembers/convMembersModel.js'
import message from '../models/messages/messageModel.js'
import users from '../models/user/userModel.js'
import axios from 'axios';
import {socketIds} from '../models/connection/connectionEvents.js'
import {
    mongoose
} from '../dependencies.js';
import {
    debug,
    validator
} from '../dependencies.js'
import loggers from '../config/newLogger.js';
import logs from '../models/logs/logsMethods.js'
import { getOperators } from './userRequests.js';
const log = new logs()
const element = 3
const logger = debug('namespace')


/**
 *  GetConversations :get all active conversations
 * @route /conversations
 * @method Get 
 */
export const getConversations = async (req, res) => {
    const accountId = req.params.id;
    const active = req.query.active;
    const page = parseInt(req.query.page) || 1; // Get the requested page number or default to 1
    const limit = 10; // Number of conversations per page
    try {
      const matchQuery = {
        owner_id: accountId,
        ...(active ? { status: 1 } : {}),
      };
    
      // Retrieve total conversation count
      const totalConversations = await conversation.countDocuments(matchQuery);
  
      const totalPages = Math.ceil(totalConversations / limit); 
  
      const activeConversations = await conversation.aggregate([
        {
          $lookup: {
            from: "members",
            localField: "_id",
            foreignField: "conversation_id",
            as: "members",
          },
        },
        {
          $match: matchQuery,
        },
        {
          $sort: {
            updated_at: -1,
          },
        },
        {
          $skip: (page - 1) * limit,
        },
        {
          $limit: limit, 
        },
      ]);
  
      const conversationsWithLastMessage = await Promise.all(
        activeConversations.map(async (conversation) => {
          const lastMsgData = await message.findById(conversation.last_message);
          return { ...conversation, lastMsgData };
        })
      );
  
      if (conversationsWithLastMessage.length > 0) {
        res.status(200).json({
          message: "success",
          data: conversationsWithLastMessage,
          totalConversations,
          totalPages,
        });
      } else {
        res.status(200).json({
          message: "success",
          data: "There are no active conversations.",
        });
      }
    } catch (err) {
      res.status(400).send({
        message: "Failed to retrieve data.",
      });
      console.log(err);
      loggers.err(err);
    }
  };
  
/**
 * get conversation between agent and client 
 */
export const getCnvMessages = async (conversationId,page,limit, res) => {
  const skip = (page - 1) * limit;

  try {
      const messages = await message.aggregate([{
              $match: {
                  conversation_id: mongoose.Types.ObjectId(conversationId),
                  type: {
                      $ne: "log"
                  }
              }
          },
          {
              $sort: {
                  created_at: -1
              }
          },
          {
              $lookup: {
                  from: "reacts",
                  localField: "_id",
                  foreignField: "message_id",
                  as: "reacts"
              }
          },
          {
              $lookup: {
                  from: "users",
                  localField: "user",
                  foreignField: "_id",
                  as: "user_data"
              }
          },
          {
              $skip: skip
          },
          {
              $limit: limit
          }
      ]).exec();

      const totalMessages = await message.countDocuments({
          conversation_id: conversationId,
          type: {
              $ne: "log"
          } 
      });

      const totalPages = Math.ceil(totalMessages / limit);
      const currentPage = page;

    return {
          data: {
              messages: messages.map(m => ({
                  ...m,
                  user_data: m.user_data[0]
              })),
              totalPages,
              currentPage
          }
      }
  } catch (err) {
      logger(err);
      console.log(err);
  
  }
};

export const getConv = async (user1,user2, res) => {
    try {
        const result = await conversation.aggregate([
            {
                $lookup: {
                    from: 'members',
                    localField: '_id',
                    foreignField: 'conversation_id',
                    as: 'members'
                }
            },
            {
                $match: {
                    'members.user_id': {
                        $all: [
                            mongoose.Types.ObjectId(user1),
                            mongoose.Types.ObjectId(user2)
                        ]
                    },
                    $expr: {
                        $eq: [{ $size: "$members" }, 2] 
                    }
                }
            }
        ]);
        if (result.length > 0 && result[0]._id) {
            // const messagesResponse = await axios.get(`http://192.168.1.23:3000/messages/${conversationId}?page=${page}&limit=${limit}`); 
            const messagesResponse = await getCnvMessages(result[0]._id, 1, 10);
                       return({
                message: "success",
                data: {
                    conversation: result,
                    messages: messagesResponse.data
                }
            });
        } else {
            return ({
                message: "success",
                data: null
            });
        }
    } catch (err) {
        console.log(err);
        logger(err);
        return({
            message: "fail retrieving data"
        });
    }
}
export const getConvBetweenUserAndAgent = async (agentId,clientId) => {
  try {
      const result = await conversation.aggregate([
          {
              $lookup: {
                  from: 'members',
                  localField: '_id',
                  foreignField: 'conversation_id',
                  as: 'members'
              }
          },
          {
              $match: {
                  'members.user_id': {
                      $all: [
                          mongoose.Types.ObjectId(agentId),
                          mongoose.Types.ObjectId(clientId)
                      ]
                  },
                  $expr: {
                      $eq: [{ $size: "$members" }, 2] 
                  }
              }
          }
      ]);

      return result
  } catch (err) {
      console.log(err);
      
  }
}
export const getConvBetweenUsers = async (userId1, userId2) => {
    try {
        const result = await conversation.aggregate([{
                $lookup: {
                    from: 'members',
                    localField: '_id',
                    foreignField: 'conversation_id',
                    as: 'members'
                }
            },
            {
                $match: {
                    'members.user_id': {
                        $all: [
                            mongoose.Types.ObjectId(userId1),
                            mongoose.Types.ObjectId(userId2)
                        ]
                    }
                }
            },
            {
                $project: {
                    'members': 0
                }
            },
        ]);

        return result
    } catch (err) {
        console.log(err)
        logger(err)
    }

}

export const getPrivateConvBetweenUsers = async (userId1, userId2) => {
    try {
        const result = await conversation.aggregate([
            {
                $lookup: {
                    from: 'members',
                    localField: '_id',
                    foreignField: 'conversation_id',
                    as: 'members'
                }
            },
            {
                $match: {
                    'members.user_id': {
                        $all: [
                            mongoose.Types.ObjectId(userId1),
                            mongoose.Types.ObjectId(userId2)
                        ]
                    },
                    $expr: {
                        $eq: [{ $size: "$members" }, 2] 
                    }
                }
            },
            {
                $project: {
                    'members': 0
                }
            },
            {
              $limit:1
            }
        ]); 
        return result[0];
    } catch (err) {
        console.log(err);
        logger(err);
    }
}

/**
 * get all conversation user connected have 
 */
export const getUserConversations = async (req, res) => {
    res.status(200).json(await getAllConversations({
      
      id : req.params.id,
      user_id:req.query?.user_id,
      start : parseInt(req.query?.start) ?? null, 
      limit : parseInt(req.query?.limit) || 10, 
      active : req.query?.active ?? -1,
   }));
   
  };


  export const getAllConversations = async (req, res) => {
    const userId=req.user_id
    const start = parseInt(req.start) ??  null; 
    const limit = parseInt(req.limit) || 10; 
    const active = req.active ?? -1;
    let role = null

    if(userId){

      const userDetails= await users.findOne({_id: (Array.isArray(userId) ? { $in: userId.map(user => mongoose.Types.ObjectId(user))} : mongoose.Types.ObjectId(userId)),role: {$ne: "CLIENT"} })
      if (userDetails){
          role=userDetails.role
       }
    }
    const matchQuery = {
      owner_id: req.id,
      ...(active >= 0 ? { status:parseInt(active)  } : {}),
      ...(userId? {"member_details._id": (Array.isArray(userId) ? { $in: userId.map(user => mongoose.Types.ObjectId(user))} : mongoose.Types.ObjectId(userId))}:{} ) 
    };  

    try { 
      // Retrieve total conversation count
      const result = await conversation.aggregate([
        {
          $lookup: {
            from: "members",
            localField: "_id",
            foreignField: "conversation_id",
            as: "members",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "members.user_id",
            foreignField: "_id",
            as: "member_details",
          },
        },
        {
          $match: matchQuery
        },
     
        {
    $lookup: {
      from: "messages",
      let: { conversation_id: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$conversation_id", "$$conversation_id"] },
                {
                  $or: [
                    { $eq: ["$read", null] },
                    { $eq: ["$read", undefined] },
                    { $not: ["$read"] },
                  ],
                },
              ],
            },
          },
        },
        {
          $group: {
            _id: "$user_id", 
            unread_count: { $sum: 1 }, 
          },
        },
      ],
      as: "unread_messages",
    },
  },

        {
          $unwind: {
            path: "$unread_messages",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "messages",
            ...(role === 'CLIENT' ? {
              
            localField: "_id",
            foreignField: "conversation_id",
              pipeline: [
                {
                  $match: {
                type: {$ne: "log"}
                  },
                },
            {    $sort: {
                  created_at: -1,
                },}
                
              ],
             
            }: {
              localField: "last_message",
              foreignField: "_id",}),
            as: "last_message",
          },
        },
        {
          $unwind: {
            path: "$last_message",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          '$facet' : {
          metadata: [ { $count: "total" } ],
          data: [ 
            {
            $group: {
              _id: "$_id",
              name: { $first: "$name" },
              members_count: { $first: "$members_count" },
              operators: { $first: "$operators" },
              status: { $first: "$status" },
              created_at: { $first: "$created_at" },
              updated_at: { $first: "$updated_at" },
              last_message: { $first: "$last_message" },
              unread_messages: { $first: "$unread_messages.unread_count" },
              members: { $first: "$members" },
              member_details: { $first: "$member_details" },
              max_length_message:{$first:"$max_length_message"},
              conversation_type:{$first:"$conversation_type"}
              
            },  
          },
          {
            $sort: {
              updated_at: -1,
            },
          },
           ...(start>=0 ? [{ $skip: start }, { $limit: limit}] :[])] 
          }
        },
        {
          $unwind: {
            path: "$metadata",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);

      return result[0]
     
    } catch (err) {
      console.log(err);
      logger(err);
 return {
       data:[],
      };
    }
  };

  export const getAllTotalConversationsDetails = async (req, res) => {
    const userId = req.user_id;
    const start = parseInt(req.start) ?? null;
    const limit = parseInt(req.limit) || 10;
    const active = req.active ?? -1;
  
    const matchQuery = {
      owner_id: req.id,
      status: {$ne:0} ,
      ...(userId ? { 'member_details.id': userId } : {}),
    };
  
    try {
      // Retrieve total conversation count and messages count
      const result = await conversation.aggregate([
        {
          $lookup: {
            from: 'members',
            localField: '_id',
            foreignField: 'conversation_id',
            as: 'members',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'members.user_id',
            foreignField: '_id',
            as: 'member_details',
          },
        },
        {
          $match: matchQuery,
        },
        {
          $lookup: {
            from: 'messages',
            let: { conversation_id: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$conversation_id', '$$conversation_id'] },
                  type: { $ne: 'log' }, 
                },
              },
              {
                $count: 'total_messages',
              },
            ],
            as: 'total_messages',
          },
        },
        {
          $unwind: {
            path: '$total_messages',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'messages',
            let: { conversation_id: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$conversation_id', '$$conversation_id'] },
                  paid: true,
                  type: { $ne: 'log' },
                },
              },
              {
                $count: 'paid_messages',
              },
            ],
            as: 'paid_messages',
          },
        },
        {
          $unwind: {
            path: '$paid_messages',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'messages',
            let: { conversation_id: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$conversation_id', '$$conversation_id'] },
                  paid: false,
                  type: { $ne: 'log' }, 
                },
              },
              {
                $count: 'unpaid_messages',
              },
            ],
            as: 'unpaid_messages',
          },
        },
        {
          $unwind: {
            path: '$unpaid_messages',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'messages',
            let: { conversation_id: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$conversation_id', '$$conversation_id'] },
                      {
                        $or: [
                          { $eq: ['$read', null] },
                          { $eq: ['$read', undefined] },
                          { $not: ['$read'] },
                        ],
                      },
                    ],
                  },
                  type: { $ne: 'log' }, 
                },
              },
              {
                $count: 'unread_count',
              },
            ],
            as: 'unread_messages',
          },
        },
        {
          $unwind: {
            path: '$unread_messages',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: '$last_message',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'messages',
            localField: '_id',
            foreignField: 'conversation_id',
            as: 'messages',
          },
        },
        {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [
              {
                $group: {
                  _id: '$_id',
                  name: { $first: '$name' },
                  members_count: { $first: '$members_count' },
                  operators: { $first: '$operators' },
                  status: { $first: '$status' },
                  created_at: { $first: '$created_at' },
                  updated_at: { $first: '$updated_at' },
                  unread_messages: { $first: '$unread_messages.unread_count' },
                  total_messages: { $first: { $sum: { $ifNull: ['$total_messages.total_messages', 0] } } },
                  paid_messages: { $first: { $sum: { $ifNull: ['$paid_messages.paid_messages', 0] } } },
                  unpaid_messages: { $first: { $sum: { $ifNull: ['$unpaid_messages.unpaid_messages', 0] } } },
                  members: { $first: '$member_details' },
                  max_length_message: { $first: '$max_length_message' },
                },
              },
              {
                $sort: {
                  updated_at: -1,
                },
              },
              ...(start >= 0 ? [{ $skip: start }, { $limit: limit }] : []),
            ],
          },
        },
        {
          $unwind: {
            path: '$metadata',
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);
      return result[0];
    } catch (err) {
      console.log(err);
      logger(err);
      return {
        data: [],
      };
    }
  };
  
  

  export const getUserLatestConversation=async(userId,res)=>{
    try {
      const conversation = await conversation
        .findOne({ members: userId }) 
        .sort({ updated_at: -1 })     
        .limit(1)                     
        .exec();

      if(conversation){
        return (conversation);
      }
    } catch (error) {
      console.error('Error retrieving latest conversation:', error);
      return res.status(500).json({ message: 'An error occurred.' });
    }
  };
  
  

  export const getUserConversationsCounts = async (req, res) => {
    const id = req.id
    const userId = req.user_id;
    const matchQuery = {
      owner_id: id,
      ...(userId ? { "member_details._id": (Array.isArray(userId) ? { $in: userId.map(user => mongoose.Types.ObjectId(user))} : mongoose.Types.ObjectId(userId)) } : {}),
    };

    try {
      const result = await conversation.aggregate([
        ...(userId?[{
          $lookup: {
            from: "members",
            localField: "_id",
            foreignField: "conversation_id",
            as: "members",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "members.user_id",
            foreignField: "_id",
            as: "member_details",
          },
        },]:[]),
        {$match:matchQuery},
        {
          '$facet' : {
          total: [ { $count: "total" } ],
        groups: [{
          $unwind: "$member_details"
          },{$match:{ "member_details._id": (Array.isArray(userId) ? { $in: userId.map(user => mongoose.Types.ObjectId(user))} : mongoose.Types.ObjectId(userId)) }},{$group: {
          _id: "$member_details._id",
          count: { $sum: 1 }
          }}]
        }},
      ]
        );

        let data = {
          total: result[0]?.total[0]?.total,
        };

        for(let group of (result[0]?.groups ?? [])) {
          data[group._id] = group.count
        }
        
return data;
    
    } catch (err) {
      console.log(err);
      logger(err);
        return err
    }
  };
  export const getUserConversationsCount = async (req, res) => {
    const id = req.params.id;
    const userId = req.query.user_id;
    
    const matchQuery = {
      owner_id: id,
      ...(userId ? { "member_details.id": (userId) } : {}),
    };
    try {
      const result = await conversation.aggregate([ 
        ...(userId?[{
          $lookup: {
            from: "members",
            localField: "_id",
            foreignField: "conversation_id",
            as: "members",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "members.user_id",
            foreignField: "_id",
            as: "member_details",
          },
        },]:[]),
        {$match:matchQuery},
        {
          '$facet' : {
          total: [ { $count: "total" } ],
          active: [{$match:{status:1}}, { $count: "total" }],
          inactive: [ {$match:{status:0}} ,{ $count: "total" }],
        }},
      ]
        );
        let formattedItem={}            
        Object.keys(result[0]).forEach((key) => {
          formattedItem[key] = result[0][key][0]?.total??0;
        });
      res.status(200).json({
        message: "success",
        data: formattedItem,
      });
    
    } catch (err) {
      console.log(err);
      logger(err);
      res.status(400).send({
        message: "fail retrieving data",
      });
    }
  };
  
//   export const getAccountConversations = async (req, res) => {
//     const accountId = req.params.id;
//     const active = req.query.active;
//     try {
//       const result = await conversation.aggregate([
//         {
//           $lookup: {
//             from: "members",
//             localField: "_id",
//             foreignField: "conversation_id",
//             as: "members",
//           },
//         },
//         {
//           $match: {
//             owner_id: accountId,
//             ...(active ? { status: 1 } : {}),
//           },
//         },
//         {
//             $project:{}
//         },
//         {
//           $lookup: {
//             from: "messages",
//             let: { conversation_id: "$_id" },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: {
//                     $and: [
//                       { $eq: ["$conversation_id", "$$conversation_id"] },
//                       {
//                         $or: [
//                           { $eq: ["$read", null] },
//                           { $eq: ["$read", undefined] },
//                           { $not: ["$read"] },
//                         ],
//                       },
//                     ],
//                   },
//                 },
//               },
//               {
//                 $count: "unread_count",
//               },
//             ],
//             as: "unread_messages",
//           },
//         },
//         {
//           $unwind: {
//             path: "$unread_messages",
//             preserveNullAndEmptyArrays: true,
//           },
//         },
//         {
//           $lookup: {
//             from: "messages",
//             localField: "last_message",
//             foreignField: "_id",
//             as: "last_message",
//           },
//         },
//         {
//           $unwind: {
//             path: "$last_message",
//             preserveNullAndEmptyArrays: true,
//           },
//         },
//         {
//           $lookup: {
//             from: "users", // Update the collection name to "users" or the correct collection name where user data is stored
//             localField: "members.user_id", // Specify the field containing the user_id in the members array
//             foreignField: "_id", // Specify the field in the "users" collection representing the user ID
//             as: "member_details", // Provide a new field name to store the user details
//           },
//         },
//         {
//           $sort: {
//             updated_at: -1,
//           },
//         },
//       ]);
  
//       res.status(200).json({
//         message: "success",
//         data: result,
//       });
//     } catch (err) {
//       console.log(err);
//       logger(err);
//       res.status(400).send({
//         message: "fail retrieving data",
//       });
//     }
//   };
  export const getAccountConversations = async (req, res) => {
    const accountId = req.params.id;
    const active = req.query.active;
    try {
      const result = await conversation.aggregate([
        {
          $lookup: {
            from: "members",
            localField: "_id",
            foreignField: "conversation_id",
            as: "members",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "members.user_id",
            foreignField: "_id",
            as: "member_details",
          },
        },
        {
          $unwind: "$member_details",
        },
        {
          $match: {
            owner_id: accountId,
            ...(active ? { status: 1 } : {}),
          },
        },
        {
            $lookup: {
              from: "messages",
              let: { conversation_id: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$conversation_id", "$$conversation_id"] },
                        {
                          $or: [
                            { $eq: ["$read", null] },
                            { $eq: ["$read", undefined] },
                            { $not: ["$read"] },
                          ],
                        },
                      ],
                    },
                  },
                },
                {
                  $count: "unread_count",
                },
              ],
              as: "unread_messages",
            },
          },
          {
            $unwind: {
              path: "$unread_messages",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "messages",
              localField: "last_message",
              foreignField: "_id",
              as: "last_message",
            },
          },
          {
            $unwind: {
              path: "$last_message",
              preserveNullAndEmptyArrays: true,
            },
          },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            members_count: { $first: "$members_count" },
            operators: { $first: "$operators" },
            status: { $first: "$status" },
            created_at: { $first: "$created_at" },
            updated_at: { $first: "$updated_at" },
            last_message: { $first: "$last_message" },
            unread_messages: { $first: "$unread_messages.unread_count" },
            members: {
              $push: {
                _id: "$member_details._id",
                full_name:"$member_details.full_name",
                role:"$member_details.role",
                id: "$member_details.id",
                // Include any other desired fields from the user document
                // e.g., name, email, etc.
                // name: "$member_details.name",
                // email: "$member_details.email",
                // ...
              },
            },
          },
        },
        
        {
          $sort: {
            updated_at: -1,
          },
        },
      ]);
  
      res.status(200).json({
        message: "success",
        data: result,
      });
    } catch (err) {
      console.log(err);
      logger(err);
      res.status(400).send({
        message: "fail retrieving data",
      });
    }
  };
  
/**
 * getConversation : get conversation data
 * @route /conversation/:id
 * @method Get
 */
export const getConversation = async (id, res) => {
        try {
            const result = await conversation.findById(id);
            return result
        } catch (err) {
            console.log(err)
            logger(err)

        }
    }

export const getConversationMemberIds=async(id,res)=>{
  try {
    const result = await conversation.findById(id);

    const memberData = await Promise.all(result.members.map(async (memberId) => {
        const userData = await users.findById(memberId);
        return userData;
    }));


    return memberData
} catch (err) {
    console.log(err);
    logger(err);
}
}


export const getConversationById = async (id, res) => {
    try {
        const conversationData = await conversation.findById(id)
        const membersData = await members.find({
            conversation_id: id
        })
        return {
            ...conversationData,
            members: membersData
        }
    } catch (err) {
        console.log(err)
        logger(err)
    }
}

export const getConversationStatus = async (req, res) => {
  try {
      const conversationData = await conversation.findById(req.params.id)
     if (conversationData){
      res.status(200).json({
        message: "success",
        data: conversationData
    });
     }else {
      res.status(400).json({
        message: "fail",
            });
     }

  } catch (err) {
      console.log(err)
      logger(err)

  }
}

/**
 * createConversation: create conversation
 * @route /conversation
 * @method post
 * @body name:,channel_url: , conversation_type : , description:,members_count:,max_length_message:,operators:[],owner_id:,last_msg:,unread_messages_count:,permission:{key:value} ,metadata:{"key":"value"}
 */
export const postConversation = async (req, res) => {
   req.metaData.operators=await getOperators(req.metaData.owner_id)
        try {
            const result = await conversation.create(req.metaData);
            if (result) {
                let dataLog = {
                    "app_id": "63ce8575037d76527a59a655",
                    "user_id": "6390b2efdfb49a27e7e3c0b9",
                    "socket_id": "req.body.socket_id",
                    "action": "Create conversation",
                    "element": element,
                    "element_id": "1",
                    "ip_address": "192.168.1.1"
                }
                log.addLog(dataLog)
                for(let member of result.members){
                  await  members.create({
                    conversation_id: result._id.toString(),
                    user_id: member,
                    conversation_name: result.name
                  })
                }
               

                 return result
            } else {
                console.log("can't add new conversation")
            }
        } catch (err) {
            console.log(err)
            loggers.error(err)


        }
    }

/**
 * updateConversation : update conversation
 * @route /conversation/:id
 * @method put
 */
export const putConversationLastMessage = async (id, message, error) => {
 
    try {
        const result = await conversation.findByIdAndUpdate(
            id, {
                $set: {
                    last_message: message._id,
                    updated_at: Date.now(),
                }
            }, {
                new: true
            } // to return the updated document
        );
        if (result) {
          
            let dataLog = {
                "app_id": "63ce8575037d76527a59a655",
                "user_id": "6390b2efdfb49a27e7e3c0b9",
                "socket_id": "req.body.socket_id",
                "action": "Update conversation last message ",
                "element": element,
                "element_id": "1",
                "ip_address": "192.168.1.1"
            }
            log.addLog(dataLog)
            return result
        }
    } catch (err) {
        console.log(err)
        logger.error(err)
    }
}


export const deleteRobot = async (conversationId, memberIdToDelete, error) => {
  try {
    const result = await conversation.findByIdAndUpdate(
      conversationId,
      {
        $pull: {
          members: memberIdToDelete,
        },
        $set: {
          updated_at: Date.now(),
        },
      },
      { new: true } 
    );
   await members.deleteOne({user_id: mongoose.Types.ObjectId(memberIdToDelete),
      conversation_id:mongoose.Types.ObjectId(conversationId)

    })
    if (result) {
      let dataLog = {
        app_id: "63ce8575037d76527a59a655",
        user_id: "6390b2efdfb49a27e7e3c0b9",
        socket_id: "req.body.socket_id",
        action: "Update conversation last message",
        element: "element", // You might want to replace this with the actual element value you want to log.
        element_id: "1",
        ip_address: "192.168.1.1",
      };
      log.addLog(dataLog);
      return result;
    } else {
      console.log("Conversation not found");
    }
  } catch (err) {
    console.log(err);
    logger.error(err);
  }
};


/**
 * deleteConversation : delete conversation
 * @route /conversation/:id
 * @method delete
 */
export const deleteConversation = async (req, res) => {
    try {
        const result = await conversation.findByIdAndDelete(req)
        if (result) {
            let dataLog = {
                "app_id": "63ce8575037d76527a59a655",
                "user_id": "6390b2efdfb49a27e7e3c0b9",
                "socket_id": "req.body.socket_id",
                "action": "Delete conversation ",
                "element": element,
                "element_id": "1",
                "ip_address": "192.168.1.1"
            }
            log.addLog(dataLog)
     
            return result
        } 
    } catch (err) {
        loggers.error(err)

    }


}

export const getCnvById = async (id, res) => {
    try {
        return  (await conversation.aggregate([
          {
            $lookup: {
              from: "members",
              localField: "_id",
              foreignField: "conversation_id",
              as: "members",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "members.user_id",
              foreignField: "_id",
              as: "member_details",
            },
          },
          {
            $match: {_id:mongoose.Types.ObjectId(id) },
          }]))[0] ?? null
    } catch (err) {
        console.log(err);
        loggers.err(err);
        return null

    }
};

export const getActiveCnvs = async (req, res) => {
    const userId = req.params.id;
    try {
        const activeConversations = await conversation.aggregate([
            {
                $lookup: {
                    from: "members",
                    localField: "_id",
                    foreignField: "conversation_id",
                    as: "members"
                }
            },
            {
                $match: {
                    "members.user_id": mongoose.Types.ObjectId(userId),
                    status: 1
                }
            },
            {
                $sort: {
                    updated_at: -1
                }
            }
        ]);

        // Fetch the last message data for each conversation
        const conversationsWithLastMessage = await Promise.all(
            activeConversations.map(async (conversation) => {
                const lastMsgData = await message.findById(conversation.last_message);
                return { ...conversation, lastMsgData };
            })
        );
        if (conversationsWithLastMessage.length > 0) {
            res.status(200).json({
                message: "success",
                data: conversationsWithLastMessage
            });
        } else {
            res.status(200).json({
                message: "success",
                data: "There are no active conversations."
            });
        }
    } catch (err) {
        res.status(400).send({
            message: "Failed to retrieve data."
        });
        console.log(err);
        loggers.err(err);
    }
};

export const getActiveConversations = async (userId, res) => {
    try {
      const activeConversations = await conversation.aggregate([
        {
          $lookup: {
            from: "members",
            localField: "_id",
            foreignField: "conversation_id",
            as: "members"
          }
        },
        {
          $match: {
            "members.user_id": mongoose.Types.ObjectId(userId),
            status: 1
          }
        },
        {
          $sort: {
            updated_at: -1
          }
        }
      ]);
  
      // Extract only the _id values as strings from activeConversations array
      const conversationIds = activeConversations.map(conversation => conversation._id.toString());
      return conversationIds;
    } catch (err) {
      console.log(err);
      loggers.err(err);
    }
  };
  
  export const getActiveConversationsOwner = async (accountId, res) => {
    try {
      const activeConversations = await conversation.aggregate([
        {
          $match: {
            owner_id:accountId,
            status: 1
          }
        },
        {
          $sort: {
            updated_at: -1
          }
        }
      ]);
  
      // Extract only the _id values as strings from activeConversations array
      const conversationIds = activeConversations.map(conversation => conversation._id.toString());
      return conversationIds;
    } catch (err) {
      console.log(err);
      loggers.err(err);
    }
  };
  
export const getAllActiveCnvs = async (req, res) => {
    const accountId = req.params.id;
    try {
        const activeConversations = await conversation.aggregate([
            {
                $lookup: {
                    from: "members",
                    localField: "_id",
                    foreignField: "conversation_id",
                    as: "members"
                }
            },
            {
                $match: {
                    status: 1,
                    owner_id:accountId
                }
            },
            {
                $sort: {
                    updated_at: -1
                }
            }
        ]);

        // Fetch the last message data for each conversation
        const conversationsWithLastMessage = await Promise.all(
            activeConversations.map(async (conversation) => {
                const lastMsgData = await message.findById(conversation.last_message);
                return { ...conversation, lastMsgData };
            })
        );
        if (conversationsWithLastMessage.length > 0) {
            res.status(200).json({
                message: "success",
                data: conversationsWithLastMessage
            });
        } else {
            res.status(200).json({
                message: "success",
                data: "There are no active conversations."
            });
        }
    } catch (err) {
        res.status(400).send({
            message: "Failed to retrieve data."
        });
        console.log(err);
        loggers.err(err);
    }
};


export const putActiveCnvs = async (userId,accountIds, res) => {
  try {
    let result = await conversation.aggregate([    
      {
        $lookup: {
          from: "members",
          localField: "_id",
          foreignField: "conversation_id",
          as: "members",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "members.user_id",
          foreignField: "_id",
          as: "member_details",
        },
      },
      {
        $match:  {$or:[{"member_details._id":mongoose.Types.ObjectId(userId), conversation_type: "4" },{$and : [{"members.user_id":mongoose.Types.ObjectId(userId)} , {"member_details._id":{$in :accountIds.map(accId => mongoose.Types.ObjectId(accId)) }} ]}]},
      },{
        $lookup: {
          from: "messages",
          localField: "last_message",
          foreignField: "_id",
          as: "last_message",
        },
      },
      {
        $unwind: {
          path: "$last_message",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]
    )
    if(result.length>0){
      accountIds.push(userId)
      result=result.filter(conversation => {
        let client = conversation.member_details.find(member=>member.role==="CLIENT" || member.role==="BOT");
        if(client){
          return accountIds.includes(client._id.toString())&& conversation.member_details.filter(member=>member._id.toString() !== client._id.toString() && accountIds.includes(member._id.toString())).length> 0 || conversation.conversation_type==4
        } else {
          return conversation.member_details.filter(member=>accountIds.includes(member._id.toString())).length> 1  || conversation.conversation_type==4
        }
      })
      const updatedCnv = await conversation.updateMany(
        { "_id": {$in:result.map(conversation=>conversation._id )}},
        { $set: { "status": 1 } }
      );
    }
    return result 
  } catch (error) {
    console.error("Error in putActiveCnvs:", error);
    return[]
  }
};

export const putCnvStatus = async (conversationId, status, res) => {
  try {
    console.log("Updating conversation status. Conversation ID:", conversationId, "Status:", status);

    // Validate status
    if (![0, 1].includes(status)) {
      throw new Error("Invalid status. Status should be 0 or 1.");
    }

    const updateFields = {
      status: status === 1 ? 2 : 3,
      updated_at: Date.now(),
    };

    // Update conversation by ID and retrieve the updated document
    const updatedConversation = await conversation.findByIdAndUpdate(
      conversationId,
      { $set: updateFields },
      { new: true } 
    );

    if (!updatedConversation) {
      throw new Error("Conversation not found.");
    }

    console.log("Conversation updated successfully. Updated Conversation:", updatedConversation);
    
    return updatedConversation;
  } catch (error) {
    console.error("Error updating conversation status:", error.message);
    throw error; 
  }
};





// export const putInactiveCnvs = async (userId,rooms, res) => {
//   try {

//     // Step 1: Find conversations with the given userId
//       let conversationIds=[]
//       const conversations = await conversation.aggregate([
//         {
//           $match: {
//             $or: [
//               { _id: { $in: rooms }, members: userId },
//               { members: userId, conversation_type: "4" }
//             ]
//           }
//         }
//       ]);
//        // Step 2: Iterate through the conversations and update the status
//     for (const cnv of conversations) {
//         // Step 3: Find the other member's ID in the conversation
//       const otherMemberIds = cnv.members.filter(memberId => Object.values(socketIds).find(user => user.userId === memberId) && memberId !==userId );
//       // Step 5: Check if the user is found
//       if (otherMemberIds.length < 2) {
//         // Step 6: Update the conversation status to 0 
//         conversationIds.push(cnv)
//    await conversation.findByIdAndUpdate(
//           cnv._id,
//           { $set: { "status": 0 } },
//           { new: true }
//         );
//     }}
//     return conversationIds
//   } catch (error) {
//     console.error("Error in putInactiveCnvs:", error);
//     return []
//     // Handle the error or return an appropriate response
//   }
// };



export const putInactiveCnvs = async (userId,accountIds, res) => {
  try {

    let result = await conversation.aggregate([    
      {
        $lookup: {
          from: "members",
          localField: "_id",
          foreignField: "conversation_id",
          as: "members",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "members.user_id",
          foreignField: "_id",
          as: "member_details",
        },
      },
      {
        $match:  {$or:[{"member_details._id":mongoose.Types.ObjectId(userId), conversation_type: "4" },{$and : [{"members.user_id":mongoose.Types.ObjectId(userId)} , {"member_details._id":{$in :accountIds.map(accId => mongoose.Types.ObjectId(accId)) }} ]}]},
      },{
        $lookup: {
          from: "messages",
          localField: "last_message",
          foreignField: "_id",
          as: "last_message",
        },
      },
      {
        $unwind: {
          path: "$last_message",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]
    )
    if(result.length>0){
      accountIds.push(userId)
      result=result.filter(conversation => {
        let client = conversation.member_details.find(member=>member.role==="CLIENT" || member.role==="BOT");
        if(client){
          return accountIds.includes(client._id.toString())&& conversation.member_details.filter(member=>member._id.toString() !== client._id.toString() && accountIds.includes(member._id.toString())).length> 0 || conversation.conversation_type==4
        } else {
          return conversation.member_details.filter(member=>accountIds.includes(member._id.toString())).length> 1  || conversation.conversation_type==4
        }
      })
      const updatedCnv = await conversation.updateMany(
        { "_id": {$in:result.map(conversation=>conversation._id )}},
        { $set: { "status": 0 } }
      );
    }
    return result 
  } catch (error) {
    console.error("Error in putActiveCnvs:", error);
    return[]
  }
};


export const putConvType = async (id, status, type, res) => {

    try {
        const result = await conversation.findByIdAndUpdate(
            id, {
                $set: {
                    conversation_type: status,
                    updated_at: Date.now(),
                    
                }
            },
        );

        return result

    } catch (err) {

        console.log(err)
        loggers.err(err)
        return null
    }
}

export const updateActivities = async () => {

  try {
    const updateConversation = await conversation.updateMany({ 
      conversation_type: { $ne: 4 } 
    }, {
      $set: { status: 0 }
    });
    const updateUser = await users.updateMany({ is_active: false });
    return { updateConversation, updateUser };
  } catch (error) {
    console.error("Error updating activities:", error);
    throw error; 
  }
}


export const searchConversationMessages = async (conversationId, term, user = null,messageId=null) => {
  const matchQuery = {
    _id: mongoose.Types.ObjectId(conversationId),
    ...(user?{ ...(user.role === 'AGENT' ? {"member_details._id": mongoose.Types.ObjectId(user.userId)} : {}),
    }:{} )
  };  
  try { 
    // Retrieve total conversation count
    const result =( await conversation.aggregate([
      {
        $lookup: {
          from: "members",
          localField: "_id",
          foreignField: "conversation_id",
          as: "members",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "members.user_id",
          foreignField: "_id",
          as: "member_details",
        },
      },
      {
        $match: matchQuery
      },
      {
        $limit: 1
      }
    ]))[0] ?? null;
    if(result) {
      let startMessage;
      if(messageId){
        startMessage = await message.findById(messageId);
      }

      return await message.aggregate([
        {
          $match: {
            type: 'MSG',
            conversation_id: mongoose.Types.ObjectId(conversationId),
            message: {$regex: new RegExp(term,"i")},
            status:{$ne:0},
            ...(typeof startMessage !== "undefined" && startMessage.created_at ? {
              created_at: {
                  $gte: startMessage.created_at
              }
          } : {}),
          },
          
        },
  
        {
          $sort: {
            created_at: -1,
          },
        }
      ])
    } else {
      return [];
    }
  } catch (err) {
    console.log(err);
    return []
  }
}

export const updateAllConversationsActivities = async () => {
  try {
   await conversation.updateMany({}, { $set: { status: 0 } });
  } catch (error) {
    console.error('Error updating users:', error);
  }
};
