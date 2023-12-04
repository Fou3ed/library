import message from "../models/messages/messageModel.js";
import conversation from "../models/conversations/conversationModel.js";
import user from "../models/user/userModel.js";
import react from "../models/reactions/reactionModel.js";
import conversationActions from "../models/conversations/conversationMethods.js";
const conversationDb = new conversationActions();
import { debug, process, validator } from "../dependencies.js";
import logs from "../models/logs/logsMethods.js";
const log = new logs();
const element = 6;
const logger = debug("namespace");
import mongoose from "mongoose";

import axios from "axios";
/**
 *  GetMessages :get get messages
 * @route /messages
 * @method Get
 */
export const GetLastMessage = async (req, res) => {
  const conversationId = req.params.id;
  try {
    const lastMessage = await message
      .find({
        conversation_id: conversationId,
      })
      .sort({
        created_at: -1,
      }) // Sort by created_at in descending order
      .limit(1);
    if (lastMessage.length > 0) {
      const userId = lastMessage[0].user;
      const userData = await user.findById(userId);
      res.status(200).json({
        message: "success",
        data: lastMessage[0],
        ...userData,
      });
    } else {
      res.status(200).json({
        message: "success",
        data: "there are no conversation",
      });
    }
  } catch (err) {
    logger(err);
    console.log(err);
    res.status(400).send({
      message: "fail retrieving data ",
    });
  }
};

/**
 * getMessage:get message data
 * @route /message/:id
 * @method Get
 */
export const getMessage = async (id, res) => {
  try {
    const result = await message.findById(id);
    return result;
  } catch (err) {
    logger(err);
  }
};
export const getMessagesUsers = async (req, res) => {
  const conversationId = req.params.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const messageId = req.query.message_id;
  let startMessage;
  try {
    if (messageId) {
      startMessage = await message.findById(messageId);
    }
    // Get the 10 other typed messages
    const messages = await message
      .aggregate([
        {
          $match: {
            conversation_id: mongoose.Types.ObjectId(conversationId),
            ...(typeof startMessage !== "undefined" && startMessage.created_at
              ? {
                  created_at: {
                    $gte: startMessage.created_at,
                  },
                }
              : {}),
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        },
        {
          $lookup: {
            from: "reacts",
            localField: "_id",
            foreignField: "message_id",
            as: "reacts",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user_data",
          },
        },
        {
          $unwind: {
            path: "$user_data",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ])
      .exec();

    const totalMessages = await message.countDocuments({
      conversation_id: conversationId,
    });

    const totalPages = Math.ceil(totalMessages / limit);
    const currentPage = page;
    res.status(200).json({
      message: "success",
      data: {
        messages,
        totalPages,
        currentPage,
      },
    });
  } catch (err) {
    logger(err);
    console.log(err);
    res.status(400).send({
      message: "fail retrieving data ",
    });
  }
};

export const getConversationMessages = async (socket, data) => {
  const conversationId = data.conversationId;
  const page = data.page || 1;
  const limit = data.limit || 10;
  const skip = (page - 1) * limit;
  try {
    const messages = await message
      .aggregate([
        {
          $match: {
            conversation_id: mongoose.Types.ObjectId(conversationId),
            $or: [
              { type: { $ne: "log" } },
              {
                type: "log",
                message: { $regex: /"action":"purchase completed"/ },
              },
            ],
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        },
        {
          $lookup: {
            from: "reacts",
            localField: "_id",
            foreignField: "message_id",
            as: "reacts",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user_data",
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ])
      .exec();

    const totalMessages = await message.countDocuments({
      conversation_id: conversationId,
      type: {
        $ne: "log",
      },
    });

    return {
      message: "success",
      data: {
        messages: messages.map((m) => ({
          ...m,
          user_data: m.user_data[0],
        })),
        totalPages: Math.ceil(totalMessages / limit),
        currentPage: page,
      },
    };
  } catch (err) {
    logger(err);
    console.log(err);
    return {
      message: "fail retrieving data",
    };
  }
};

/**
 * createMessage : create message
 * @route /message
 * @method post
 * @body  type,conversation_id,user,mentioned_users,readBy,is_removed,message,data,attachments,parent_message_id,parent_message_info,location,origin
 */
export const postMessage = async (req, res) => {
  try {
    const result = await message.create(req.metaData);

    if (result) {
      let dataLog = {
        app_id: "63ce8575037d76527a59a655",
        user_id: "6390b2efdfb49a27e7e3c0b9",
        socket_id: "req.body.socket_id",
        action: "Create message ",
        element: element,
        element_id: "1",
        ip_address: "192.168.1.1",
      };
      log.addLog(dataLog);

      try {
        conversationDb.putCnvLM(req.metaData.conversation_id, result);
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          error: "An error occurred while updating lastMsg.",
        });
      }

      return result;
    } else {
      console.log("error adding msg");
    }
  } catch (err) {
    console.log("error adding a message into data base", err);
    logger(err);
  }
};

/**
 * updateMessage : update message data
 * @route /message/:id
 * @method put
 */

export const putMessage = async (
  messageId,
  content,
  updateStatus = true,
  res
) => {
  try {
    const updatedMessage = await message.findByIdAndUpdate(
      messageId,
      {
        $set: {
          message:
            content instanceof Object ? JSON.stringify(content) : content,
          updated_at: Date.now(),
          ...(updateStatus
            ? {
                status: 2,
              }
            : {}),
        },
      },
      {
        new: true,
      }
    );
    if (updatedMessage) {
      let dataLog = {
        app_id: "63ce8575037d76527a59a655",
        user_id: "6390b2efdfb49a27e7e3c0b9",
        socket_id: "req.body.socket_id",
        action: "update message  ",
        element: element,
        element_id: messageId,
        ip_address: "192.168.1.1",
      };
      log.addLog(dataLog);
      const reacts = await react.find({
        message_id: updatedMessage._id,
      });
      const data = {
        ...updatedMessage.toObject(),
        reacts: reacts || [],
      };
      return data;
    } else {
      console.log("error updating message");
    }
  } catch (err) {
    logger(err);
  }
};
export const putPlanMessage = async (messageId, status, res) => {
  try {
    const existingMessage = await message.findById(messageId);
    if (!existingMessage) {
      console.log("Message not found");
      return null;
    }

    const parsedMessage = JSON.parse(existingMessage.message);
    parsedMessage.plans.forEach((plan) => {
      plan.status = status;
    });

    const updatedMessage = await message.findByIdAndUpdate(
      messageId,
      {
        $set: {
          message: JSON.stringify(parsedMessage),
          updated_at: Date.now(),
        },
      },
      {
        new: true,
      }
    );

    if (updatedMessage) {
      let dataLog = {
        app_id: "63ce8575037d76527a59a655",
        user_id: "6390b2efdfb49a27e7e3c0b9",
        socket_id: "req.body.socket_id",
        action: "update message",
        element_id: messageId,
        ip_address: "192.168.1.1",
      };
      log.addLog(dataLog);
      return updatedMessage;
    } else {
      console.log("Error updating message");
    }
  } catch (err) {
    logger(err);
  }
};

/**
 * MarkMessageAsRead : mark a message as read
 * @route /message/read/:id
 * @method put
 */
/**
 * MarkMessageAsRead : mark a message as read
 * @route /message/read/:id
 * @method put
 */
export const MarkMessageAsRead = async (data, res) => {
  const conversationId = data.metaData.conversation;
  const userId = data.user;
  const messageId = data.metaData.message;
  try {
    // Find the conversation by id and check if the user is part of it
    const conversationData = await conversation.findOne({
      _id: mongoose.Types.ObjectId(conversationId),
      members: userId,
    });
    if (!conversationData) {
      if (res) {
        return res.status(404).send({
          error: "User is not a part of this conversation",
        });
      }
    } else {
      // Find all the messages in the conversation where read is empty and the message is created before the given messageId
      const result = await message.updateMany(
        {
          $and: [
            {
              _id: {
                $lte: messageId,
              },
            },
            {
              conversation_id: conversationId,
            },
            {
              read: {
                $exists: false,
              },
            },
          ],
        },
        {
          $set: {
            read: Date.now(),
          },
        },
        {
          new: true,
        } // Return the modified documents instead of the default result object
      );
      return result;
    }
  } catch (err) {
    console.error(err);
    if (res) {
      return res.status(500).send({
        error: "Internal server error",
      });
    }
  }
};

/**
 * MarkMessageAsPinned : mark a message as pinned
 * @route /message/pin/:id
 * @method put
 */

export const MarkMessageAsPinned = async (id, user) => {
  try {
    const result = await message.findByIdAndUpdate(
      id,
      {
        pinned: 1,
      },
      {
        new: true,
      }
    );
    if (result) {
      let dataLog = {
        app_id: "63ce8575037d76527a59a655",
        user_id: "6390b2efdfb49a27e7e3c0b9",
        socket_id: "req.body.socket_id",
        action: "Mark message as pinned ",
        element: element,
        element_id: "1",
        ip_address: "192.168.1.1",
      };
      log.addLog(dataLog);
      return result;
    } else {
      console.log("error");
    }
  } catch (err) {
    logger(err);
  }
};

/**
 * MarkMessageAsUnPinned : mark a message as pinned
 * @route /message/pin/:id
 * @method put
 */
export const MarkMessageAsUnPinned = async (data, res) => {
  const id = data.metaData.message_id;
  if (!validator.isMongoId(id)) {
    res.status(400).send({
      error: "there is no such member (wrong id)",
    });
  } else {
    try {
      const result = await message.findByIdAndUpdate(id, {
        $set: {
          pinned: 0,
        },
      });
      if (result) {
        let dataLog = {
          app_id: "63ce8575037d76527a59a655",
          user_id: "6390b2efdfb49a27e7e3c0b9",
          socket_id: "req.body.socket_id",
          action: "Mark message as unPinned",
          element: element,
          element_id: "1",
          ip_address: "192.168.1.1",
        };
        log.addLog(dataLog);
        return result;
      } else {
        console.log(" error");
      }
    } catch (err) {
      logger(err);
    }
  }
};

/**
 *  GetUnreadMessagesCount :get unread messages count
 * @route /message
 * @method Get
 */
export const GetUnreadMessagesCount = async (req, res) => {
  try {
    const result = await message.find({
      read: null,
    });
    if (result.length > 0) {
      res.status(200).json({
        message: "success",
        data: result.length,
      });
    } else {
      res.status(200).json({
        message: "success",
        data: "there are no  unread messages",
      });
    }
  } catch (err) {
    logger(err);
    res.status(400).send({
      message: "fail retrieving data ",
    });
  }
};

/**
 * markMessageAsDelivered : mark a message as delivered
 * @route /message/delivered/:id
 * @method put
 */
export const markMessageAsDelivered = async (req, res) => {
  const id = req.params.id;
  if (!validator.isMongoId(id)) {
    res.status(400).send({
      error: "there is no such member (wrong id)",
    });
  } else {
    try {
      const result = await message.findByIdAndUpdate(id, {
        $set: {
          delivered: Date.now(),
        },
      });
      if (result) {
        let dataLog = {
          app_id: "63ce8575037d76527a59a655",
          user_id: "6390b2efdfb49a27e7e3c0b9",
          socket_id: "req.body.socket_id",
          action: "mark message as delivered",
          element: element,
          element_id: "1",
          ip_address: "192.168.1.1",
        };
        log.addLog(dataLog);
        return result;
      } else {
        res.status(400).send({
          error: "  wrong values",
        });
      }
    } catch (err) {
      res.status(400).send({
        error: "some error occurred. Try again (verify your params values ) ",
      });
      logger(err);
    }
  }
};
/**
 *  GetUnreadMessages :get unread messages
 * @route /message
 * @method Get
 */
export const GetUnreadMessages = async (req, res) => {
  try {
    const result = await message.find({
      read: null,
    });
    if (result.length > 0) {
      res.status(200).json({
        message: "success",
        data: result,
      });
    } else {
      res.status(200).json({
        message: "success",
        data: "there are no such message ",
      });
    }
  } catch (err) {
    logger(err);
    res.status(400).send({
      message: "fail retrieving data ",
    });
  }
};

/**
 * get pinned messages : with user details (user:sender )
 */
export const getPinnedMessage = async (req, res) => {
  try {
    let conversationId = req.params.id;
    const result = await message
      .find({
        conversation_id: conversationId,
        pinned: 1,
      })
      .sort({
        created_at: -1,
      })
      .populate("user")
      .exec();
    if (result) {
      res.status(200).json({
        message: "success",
        data: result,
      });
    } else {
      res.status(200).send({
        message: "there are no pinned messages",
      });
    }
  } catch (err) {
    logger(err);
    res.status(400).send({
      message: "fail retrieving data ",
    });
  }
};

/**
 * MarkMessageAsPinned : mark a message as pinned
 * @route /message/pin/:id
 * @method put
 */
export const MarkMessageAsForwarded = async (id, user) => {
  try {
    const result = await message.findByIdAndUpdate(
      id,
      {
        status: 3,
      },
      {
        new: true,
      }
    );
    if (result) {
      let dataLog = {
        app_id: "63ce8575037d76527a59a655",
        user_id: "6390b2efdfb49a27e7e3c0b9",
        socket_id: "req.body.socket_id",
        action: "Mark message as forwarded ",
        element: element,
        element_id: "1",
        ip_address: "192.168.1.1",
      };
      log.addLog(dataLog);
      return result;
    } else {
      console.log("error");
    }
  } catch (err) {
    logger(err);
  }
};

/**
 * deleteMessage : delete message
 * @route /message/:id
 * @method delete
 */

export const deleteMessage = async (req, res) => {
  const id = req.metaData.message;

  try {
    const result = await message.findByIdAndUpdate(
      id,
      {
        $set: {
          status: 0,
          updated_at: Date.now(),
        },
      },
      {
        new: true,
      }
    );

    if (result) {
      const userId = result.user;
      const userData = await user.findById(userId);

      let dataLog = {
        app_id: "63ce8575037d76527a59a655",
        user_id: "6390b2efdfb49a27e7e3c0b9",
        socket_id: "req.body.socket_id",
        action: "delete message  ",
        element: element,
        element_id: "1",
        ip_address: "192.168.1.1",
      };
      log.addLog(dataLog);

      return {
        result,
        userData,
      };
    } 
  } catch (err) {
    console.log("error deleting a message", err);
  }
};

export const getMessagesUsersTransferred = async (req, res) => {
  const conversationId = req.params.id;
  const messageId = req.query.message;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const startMessage = await message.findById(messageId);
    const logMessages = await message
      .find({
        conversation_id: conversationId,
        type: "log",
        created_at: {
          $gte: startMessage.created_at,
        },
      })
      .sort({
        created_at: -1,
      })
      .exec();

    const totalMessages = await message.countDocuments({
      conversation_id: conversationId,
      type: {
        $ne: "log",
      },
      created_at: {
        $gte: startMessage.created_at,
      },
    });

    const messages = await message
      .aggregate([
        {
          $match: {
            conversation_id: mongoose.Types.ObjectId(conversationId),
            type: {
              $ne: "log",
            },
            created_at: {
              $gte: startMessage.created_at,
            },
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        },
        {
          $lookup: {
            from: "reacts",
            localField: "_id",
            foreignField: "message_id",
            as: "reacts",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user_data",
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ])
      .exec();

    if (messages.length > 0 || logMessages.length > 0) {
      const totalPages = Math.ceil(totalMessages / limit);
      const currentPage = page;
      const allMessages = [...logMessages, ...messages];
      allMessages.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      res.status(200).json({
        message: "success",
        data: {
          messages: allMessages,
          totalPages,
          currentPage,
        },
      });
    } else {
      res.status(200).json({
        message: "success",
        data: "there are no conversation ",
      });
    }
  } catch (err) {
    logger(err);
    console.log(err);
    res.status(400).send({
      message: "fail retrieving data ",
    });
  }
};

export const putLinkMessage = (messageId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const existingMessage = await message.findById(messageId);
      if (!existingMessage) {
        resolve(null);
      }

      const parsedMessage = JSON.parse(existingMessage.message);
      parsedMessage.userLink.status = "1";

      const updatedMessage = await message.findByIdAndUpdate(
        messageId,
        {
          $set: {
            message: JSON.stringify(parsedMessage),
            updated_at: Date.now(),
          },
        },
        {
          new: true,
        }
      );
      console.log("updatedMessage", updatedMessage);

      if (updatedMessage) {
        let dataLog = {
          app_id: "63ce8575037d76527a59a655",
          user_id: "6390b2efdfb49a27e7e3c0b9",
          socket_id: "req.body.socket_id",
          action: "update message",
          element_id: messageId,
          ip_address: "192.168.1.1",
        };
        log.addLog(dataLog);
        resolve(updatedMessage);
      } else {
        console.log("Error updating message");
        reject(new Error("Error updating message"));
      }
    } catch (err) {
      logger(err);
      reject(err);
    }
  });
};

// export const findMessageWithSiblings = async (messageId, count, user) => {

//     return (await message.aggregate([
//         ...(user && user.role !== 'ADMIN' ? [{
//             $lookup: {
//                 from: "conversations",
//                 as: "conversation",
//                 localField: "conversation_id",
//                 foreignField: "id",
//             }
//         }] : []),
//         {
//             $match: {
//                 _id: mongoose.Types.ObjectId(messageId),
//                 ...(user && user.role !== "ADMIN" ? (["AGENT", "CLIENT"].includes(user.role) ? {
//                     "conversation.members": user.userId
//                 } : {
//                     "conversation.operators": user.userId
//                 }) : {})
//             }
//         },
//         {
//             $lookup: {
//                 from: "messages",
//                 as: "older_siblings",
//                 let: {
//                     "parent_created_at": "$created_at",
//                     "parent_conversation_id": "$conversation_id",
//                 },
//                 pipeline: [{
//                         $match: {
//                             $expr: {
//                                 $lt: ["$created_at", "$$parent_created_at"],
//                             },
//                             $expr: {
//                                 $eq: ["$conversation_id", "$$parent_conversation_id"]
//                             }
//                         }
//                     },
//                     {
//                         $sort: {
//                             created_at: -1
//                         }
//                     },
//                     {
//                         $limit: count
//                     },

//                 ]
//             }
//         },
//         {
//             $lookup: {
//                 from: "messages",
//                 as: "newer_siblings",
//                 let: {
//                     "parent_created_at": "$created_at",
//                     "parent_conversation_id": "$conversation_id",
//                 },
//                 pipeline: [{
//                         $match: {
//                             $expr: {
//                                 $gt: ["$created_at", "$$parent_created_at"],
//                             },
//                             $expr: {
//                                 $eq: ["$conversation_id", "$$parent_conversation_id"]
//                             }
//                         }
//                     },
//                     {
//                         $sort: {
//                             created_at: 1
//                         }
//                     },
//                     {
//                         $limit: count
//                     },

//                 ]
//             },

//         },
//     ]))[0] ?? null
// };

export const findMessageWithSiblings = async (
  messageId,
  count,
  firstMessage,
  user
) => {
  const parentMessage =
    (
      await message.aggregate([
        ...(user && user.role !== "ADMIN"
          ? [
              {
                $lookup: {
                  from: "conversations",
                  localField: "conversation_id",
                  foreignField: "_id",
                  as: "conversation",
                },
              },
            ]
          : []),
        {
          $match: {
            _id: mongoose.Types.ObjectId(messageId),
            ...(user && user.role !== "ADMIN"
              ? ["AGENT", "CLIENT"].includes(user.role)
                ? {
                    "conversation.members": user.userId,
                  }
                : {
                    "conversation.operators": user.userId,
                  }
              : {}),
          },
        },
      ])
    )[0] ?? null;

  if (!parentMessage) {
    return null;
  }

  const { created_at, conversation_id } = parentMessage;

  const startMessage = firstMessage
    ? await message.findById(firstMessage)
    : null;

  return [
    ...(
      await message.aggregate([
        {
          $match: {
            conversation_id: conversation_id,
            created_at: {
              $lt: new Date(created_at),
              ...(startMessage
                ? { $gte: new Date(startMessage.created_at) }
                : {}),
            },
          },
        },
        { $sort: { created_at: -1 } },
        { $limit: count },
      ])
    ).reverse(),

    parentMessage,

    ...(await message.aggregate([
      {
        $match: {
          conversation_id: conversation_id,
          created_at: {
            $gt: new Date(created_at),
            ...(startMessage
              ? { $gte: new Date(startMessage.created_at) }
              : {}),
          },
        },
      },
      { $sort: { created_at: 1 } },
      { $limit: count },
    ])),
  ];
};

export const getSocketConversationMessages = async (req, res) => {
  const conversationId = req.conversation_id;
  const page = parseInt(req.page) || 1;
  const limit = parseInt(req.limit) || 10;
  const skip = (page - 1) * limit;
  const messageId = req.message_id;
  const after = req.after;
  const before = req.before;
  const contactId = req.contact_id;

  let startMessage;
  try {
    let createdAtFilter = { created_at: {} };
    if (messageId) {
      startMessage = await message.findById(messageId);
      if (startMessage && startMessage.created_at) {
        createdAtFilter.created_at.$gte = startMessage.created_at;
      }
    }
    if (after) {
      createdAtFilter.created_at.$gt = new Date(after);
    }
    if (before) {
      createdAtFilter.created_at.$lt = new Date(before);
    }
    const result = await message
      .aggregate([
        {
          $match: {
            conversation_id: mongoose.Types.ObjectId(conversationId),
            ...(Object.values(createdAtFilter.created_at).length > 0
              ? createdAtFilter
              : {}),
            message: { $not: /"action":"focus",/i },
          },
        },
        {
          ...(before
            ? {
                $sort: {
                  created_at: -1,
                },
              }
            : after
            ? {
                $sort: {
                  created_at: 1,
                },
              }
            : {}),
        },
        {
          $lookup: {
            from: "reacts",
            localField: "_id",
            foreignField: "message_id",
            as: "reacts",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user_data",
          },
        },
        {
          $unwind: {
            path: "$user_data",
            preserveNullAndEmptyArrays: true,
          },
        },
        ...(!before && !after ? {} : [{ $skip: skip }]),
        {
          $limit: limit,
        },
      ])
      .exec();
    let totalUnreadMessages = [];
    let contact = null;
    if (page == 1 && contactId) {
      totalUnreadMessages = await message
        .aggregate([
          {
            $match: {
              conversation_id: mongoose.Types.ObjectId(conversationId),
              read: {
                $exists: false,
              },
              "user_data.role": { $ne: "CLIENT" },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "user_data",
            },
          },
          {
            $unwind: {
              path: "$user_data",
              preserveNullAndEmptyArrays: true,
            },
          },
        ])
        .exec();
      try {
        contact = await user.findOne({
          _id: contactId,
        });

        if (contact) {
          const {
            data: { data },
          } = await axios.get(
            `${process.env.API_PATH}/getDataByProfileId/${contact.id}`,
            {
              headers: {
                key: `${process.env.API_KEY}`,
              },
            }
          );
 
          contact = {
            ...JSON.parse(JSON.stringify(contact)),
            contact_details: data[0] ?? data,
          };
        }
      } catch (error) {}
    }
    return { messages: result, totalUnreadMessages, contact };
  } catch (err) {
    console.log(err);
    return [];
  }
};

export async function updateAllMessages(oldCnv, newCnv) {
  try {
    const updatedMessages = await message.updateMany(
      { conversation_id: oldCnv },
      { $set: { conversation_id: newCnv } }
    );


    
    return updatedMessages;
  } catch (error) {
    console.error("Error updating messages:", error);
    throw error;
  }
}
