import user from '../models/user/userModel.js'
import conversation from '../models/conversations/conversationModel.js'
import {
    debug,
    Joi,
    validator
} from '../dependencies.js'

import logs from '../models/logs/logsMethods.js'
import { clientBalance } from '../models/connection/connectionEvents.js'
import mongoose from 'mongoose'
import axios from 'axios'
const log = new logs()
const element = 9
const logger = debug('namespace')


/**
 *  GetUsers :get users data
 * @route /users
 * @method Get 
 */
export const getUsers = async (req, res) => {
    try {
        const result = await user.find({
            role:"AGENT"
        });
        if (result.length > 0) {
            res.status(200).json({
                message: "success",
                data: result
            })
        } else {
            res.status(200).json({
                message: "success",
                data: "there are no such user "
            })
        }
    } catch (err) {
        logger(err)
        res.status(400).send({
            message: "fail retrieving data ",
        })
    }
}
export const getClient = async (req, res) => {
    try {
      const result = await user.findOne({
        _id: req.params.id,
      });
    
      if (result) {
        const {data: {data}}=await axios.get(`${process.env.API_PATH}/getDataByProfileId/${result.id}`,{
            headers:{
              key: `${process.env.API_KEY}`,
    
            }
          })
         
        res.status(200).json({
          message: "success",
          data: {...(JSON.parse(JSON.stringify(result))),contact_details: data },
      
        });
      } else {
        res.status(404).json({
          message: "User not found"
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Error retrieving data"
      });
    }
  };
  

export const getUserById = async (req, res) => {
    try {
        const result = await user.find({
            id:req.params.id
        });
        if (result.length > 0) {
            res.status(200).json({
                message: "success",
                data: result
            })
        } else {
            res.status(200).json({
                message: "success",
                data: "there are no such user "
            })
        }
    } catch (err) {
        logger(err)
        res.status(400).send({
            message: "fail retrieving data ",
        })
    }
}

export const getUsersById = async (userIds) => {
    try {
        const result = await user.find({
            _id:{$in: userIds.map(userId => mongoose.Types.ObjectId(userId))}
        });
    
        return result;
    } catch (err) {
        logger(err)
        return [];
    }
}

export const getAgentsByAccountId = async (accountId) => {
    try {
        const result = await user.find({role:"AGENT",accountId:accountId});
    
        return result;
    } catch (err) {
        logger(err)
        return [];
    }
}

/**
 * get users connected 
 */
export const getUserConnected = async (req, res) => {

    try {
        const result = await user.find({
            role: "AGENT",
            is_active: true,
            accountId:req.query.accountId
          });
        if (result.length > 0) {
            res.status(200).json({
                message: "success",
                data: result
            })
        } else {
            res.status(200).json({
                message: "success",
                data: []
            })
        }
    } catch (err) {
        logger(err)
        res.status(400).send({
            message: "fail retrieving data"
        })
    }
}

export const getAgentConnected = async (req, res) => {

    try {
        const result = await user.findOne({
            id:req.params.id})

        if (result) {
            res.status(200).json({
                message: "success",
                data: result
            })
        } else {
            res.status(404).json({
                message: "success",
                data: []
            })
        }
    } catch (err) {
        logger(err)
        res.status(400).send({
            message: "fail retrieving data"
        })
    }
}


export const getAllUserConnected = async (req, res) => {
    const accountId=req.params.id
    try {
        const result = await user.find({
            accountId:accountId,
            is_active: true,
          });
        if (result.length > 0) {
            res.status(200).json({
                message: "success",
                data: result
            })
        } else {
            res.status(200).json({
                message: "success",
                data: []
            })
        }
    } catch (err) {
        logger(err)
        res.status(400).send({
            message: "fail retrieving data"
        })
    }
}


/**
 * get user by socket.id
 */
export const getUserBySocket = async (req, res) => {

    try {
        const result = await user.findOne({
            socket_id: req
        })
        return result
    } catch (err) {
        console.log(err, "error getting user by socket id ")
    }
}
/**
 *getUserName : get user by y name 
 @route /userName/:name
 *  */
export const getUserName = async (id, res) => {
    
    try {
        const result = await user.findById(id)
        
     return result.full_name
    } catch (err) {
        console.log(err)
        logger(err)
        res.status(400).end({
            message: "fail retrieving data"
        })
    }
}


/**
 * getUser : get user data
 * @route /user/:id
 * @method Get
 */
export const getUser = async (id, res) => {
    try {

        return  id instanceof Array ? user.find({ _id: { $in: id } }) : await user.findById(id);
       
    } catch (err) {
        console.log(err)
        logger(err)
        res.status(400).send({
            message: "fail retrieving data"
        })
    }
}


export const getConversationMembers = async (id, res) => {
    try {
        const result = await user.findById(id);
        return result
    } catch (err) {
        console.log(err)
        logger(err)
        res.status(400).send({
            message: "fail retrieving data"
        })
    }
}
export const getUserByP=async (id,type,res)=>{
  
    try {
        const result = await user.findOne({id:id,...(type ? {role: {$ne: "CLIENT"} }: {role:"CLIENT"}) });
        if (result) {
          return result
        } 
    } catch (err) {
        console.log(err)
        logger(err)
       
    }
}
export const getAgentBy_Id=async (id,type,res)=>{
  
    try {
        const result = await user.findOne({_id:id});
        if (result) {
          return result
        } 
    } catch (err) {
        console.log(err)
        logger(err)
       
    }
}
export const getAgent=async (id,res)=>{
  
    try {
        const result = await user.findOne({_id:id });
        if (result) {
          return result
        }
    } catch (err) {
        console.log(err)
        logger(err)
       
    }
}
export const getAgentByAccountId=async (id,res)=>{
  
    try {
        const result = await user.find({accountId:id,role:"AGENT" });
        if (result) {
          return result
        }
    } catch (err) {
        console.log(err)
        logger(err)
       
    }
}
export const getAgentDetails=async (id,res)=>{
  
    try {
        const result = await user.findOne({_id:id });
        if (result) {
          return result
        }
    } catch (err) {
        console.log(err)
        logger(err)
       
    }
}



export const getUsersByP=async (id,type,res)=>{
  
    try {
        const result = await user.find({id:id,...(type ? {role: {$ne: "CLIENT"} }: {role:"CLIENT"}) });
        if (result) {
          return result
        } else {
            console.log("error getting users")
        }
    } catch (err) {
        console.log(err)
        logger(err)
       
    }
}


/**
 * createUser: create user
 * @route /user
 * @method post
 * @body  nickname,full_name,profile_url,access_token,role,is_active,is_online,locale,last_seen_at,metadata
 */
export const postUser = async (req, res) => {
        try {  
            const result = await user.create(req.body);
            if (result) {
                let dataLog = {
                    "app_id": "63ce8575037d76527a59a655",
                    "user_id": "6390b2efdfb49a27e7e3c0b9",
                    "socket_id": "req.body.socket_id",
                    "action": "Create user ",
                    "element": element,
                    "element_id": "1",
                    "ip_address": "192.168.1.1"
                }
                log.addLog(dataLog)
                res.status(201).json({
                    message: "success",
                    date: result
                })
            } else {
                res.status(400).json({
                    "error": 'failed to create new user'
                })
            }
        } catch (err) {
            console.log("err", err)

            res.status(400).json({
                'error': 'some error occurred.try again'
            })
            logger(err)
        }
    }

/**
 * updateUser : update user data
 * @route /user/:id
 * @method put
 */

export const putUser = async (userId, body, res) => {
    let formattedData = {};

    // Loop through the array and format the data
    body.fields.forEach(item => {
        formattedData[item.field_type] = item.field_value;
    });

    try {
        const firstName = formattedData["10"];
        const lastName = formattedData["11"];

        const metaDataWithoutNames = { ...formattedData };
        delete metaDataWithoutNames["10"];
        delete metaDataWithoutNames["11"];

        const updateFields = {
            metadata: metaDataWithoutNames
        };

        if (firstName !== undefined && lastName !== undefined) {
            updateFields.nickname = firstName;
            updateFields.full_name = `${firstName} ${lastName}`;
            updateFields.status=1
        }

        const result = await user.findByIdAndUpdate(
            userId, {
                $set: updateFields
            },
            { upsert: true, new: true }
        );

        if (result) {
            const dataLog = {
                "app_id": "63ce8575037d76527a59a655",
                "user_id": "6390b2efdfb49a27e7e3c0b9",
                "socket_id": "req.body.socket_id",
                "action": "update user",
                "element": element,
                "element_id": "1",
                "ip_address": "192.168.1.1"
            };
            log.addLog(dataLog);
        }
        return result;
    } catch (err) {
        logger(err);
    }
};

/**
 * update socket _id 
 */
export const putUserSocket = async (id, socket_id, res) => {
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such user (wrong id)'
        })
    } else {
        try {
            const result = await user.findByIdAndUpdate(
                id, {
                    $set: {
                        socket_id: socket_id
                    }
                })
            if (result) {
                let dataLog = {
                    "app_id": "63ce8575037d76527a59a655",
                    "user_id": "6390b2efdfb49a27e7e3c0b9",
                    "socket_id": socket_id,
                    "action": "update user socket id ",
                    "element": element,
                    "element_id": "1",
                    "ip_address": "192.168.1.1"
                }
                log.addLog(dataLog)
                return result
            } else {
                console.log("3 error")
            }
        } catch (err) {
            console.log(err)
            logger(err)
        }
    }
}


/**
 * update socket _id 
 */
export const putUserActivity = async (data) => {
    try {
        const result = await user.findOneAndUpdate({
                _id: data.userId
            }, 
            {
                $set: {
                    is_active: data.status,
                    socket_id:data.socketId,
                    last_seen_at:data?.last_seen_at
                }
            }, 
            {
                new: true
            } 
        );
        if (result) {

            let dataLog = {
                "app_id": "63ce8575037d76527a59a655",
                "user_id": "6390b2efdfb49a27e7e3c0b9",
                "socket_id": "123123",
                "action": `update user activity ${data.status} `,
                "element": element,
                "element_id": "1",
                "ip_address": "192.168.1.1"
            }
            log.addLog(dataLog)

            return result
        } 
    } catch (err) {
        console.log(err)
        logger(err)
    }
}


export const putUserStatus = async (userId,res) => {
    try {
        let result = await user.findOneAndUpdate(
            {id: userId}, 
            {
              $set: {
                role:"CLIENT",
                status: 1,
              },
            },
            {
              new: true,
            }
          );
      
      if (result) {
        let dataLog = {
          app_id: "63ce8575037d76527a59a655",
          user_id: "6390b2efdfb49a27e7e3c0b9",
          socket_id: "123123",
          action: "update user activity",
          element: element,
          element_id: "1",
          ip_address: "192.168.1.1",
        };
  
        log.addLog(dataLog); // Assuming the log module has an addLog function
  
        return result;
      } 
    } catch (err) {
      console.log(err);
      // Assuming the logger function exists and is defined elsewhere
      logger(err);
    }
  };




/**
 * getUserStatus : get user status
 * @route /users/status/:id
 * @method Get
 */
export const getUserStatus = async (req, res) => {
    const id = req.params.id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such user(wrong id) '
        })
    } else {
        try {
            const result = await user.find({
                _id: req.params.id,
                status: req.query.status
            });
            res.status(200).json({
                message: "success",
                data: result
            })
        } catch (err) {
            logger(err)
            res.status(400).send({
                message: "fail retrieving data"
            })
        }
    }
}
/**
 * getUsersOnline : get online users
 * @route /users/online/:id
 * @method Get
 */
export const getUsersOnline = async (req, res) => {

    try {
        const result = await user.find({
            is_online: true
        });
        res.status(200).json({
            message: "success",
            total: result.length,
            data: result
        })
    } catch (err) {
        logger(err)
        res.status(400).send({
            message: "fail retrieving data"
        })
    }
}
/**
 * registerUser : log in a user
 * @route /user/login/:id
 * @method put
 */
export const registerUser = async (req, res) => {
    const id = req.params.id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such user (wrong id)'
        })
    } else {
        const data = {
            access_token: req.access_token,
        }
        const check = Joi.object({
            access_token: Joi.string().required(),
        })
        
        const {
            error
        } = check.validate(data)
        if (error) {
            res.status(400).send({
                'error': error.details[0].message
            })
        } else {
            try {
                const result = await user.findByIdAndUpdate(
                    id, {
                        $set: req.body
                    })
                if (result) {
                    res.status(202).json({
                        message: "success",
                        data: result
                    })

                    let dataLog = {
                        "app_id": "63ce8575037d76527a59a655",
                        "user_id": "6390b2efdfb49a27e7e3c0b9",
                        "socket_id": "req.body.socket_id",
                        "action": "register user ",
                        "element": element,
                        "element_id": "1",
                        "ip_address": "192.168.1.1"
                    }
                    log.addLog(dataLog)
                } else {
                    res.status(400).send({
                        'error': ' wrong values'
                    })
                }

            } catch (err) {
                res.status(400).send({
                    'error': 'some error occurred. Try again (verify your params values ) '
                })
                logger(err)
            }
        }
    }

}

/**
 * banUser : ban a user
 * @route /user/ban/:id
 * @method put
 */
export const banUser = async (req, res) => {
    const id = req.params.id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such user (wrong id)'
        })
    } else {
        try {
            const result = await user.findByIdAndUpdate(
                id, {
                    $set: {
                        access_token: null
                    }
                })
            if (result) {
                let dataLog = {
                    "app_id": "63ce8575037d76527a59a655",
                    "user_id": "6390b2efdfb49a27e7e3c0b9",
                    "socket_id": "req.body.socket_id",
                    "action": "ban user ",
                    "element": element,
                    "element_id": "1",
                    "ip_address": "192.168.1.1"
                }
                log.addLog(dataLog)
                res.status(202).json({
                    message: "success",
                    data: result
                })
            } else {
                res.status(400).send({
                    'error': ' wrong values'
                })
            }

        } catch (err) {
            res.status(400).send({
                'error': 'some error occurred. Try again (verify your params values ) '
            })
            logger(err)
        }
    }
}

/**
 * unBanUser : unBan a user
 * @route /user/unban/:id
 * @method put
 */
export const unBanUser = async (req, res) => {
    const id = req.params.id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such user (wrong id)'
        })
    } else {
        try {
            const result = await user.findByIdAndUpdate(
                id, {
                    $set: {
                        access_token: "token"
                    }
                })
            if (result) {
                let dataLog = {
                    "app_id": "63ce8575037d76527a59a655",
                    "user_id": "6390b2efdfb49a27e7e3c0b9",
                    "socket_id": "req.body.socket_id",
                    "action": "unBan user ",
                    "element": element,
                    "element_id": "1",
                    "ip_address": "192.168.1.1"
                }
                log.addLog(dataLog)
                res.status(202).json({
                    message: "success",
                    data: result
                })
            } else {
                res.status(400).send({
                    'error': 'wrong values'
                })
            }

        } catch (err) {
            res.status(400).send({
                'error': 'some error occurred. Try again (verify your params values ) '
            })
            logger(err)
        }
    }
}


/**
 * deleteUser : delete user
 * @route /user/:id
 * @method delete
 */
export const deleteUser = async (req, res) => {
    const id = req.params.id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such user(wrong id) '
        })
    } else {
        try {
            const result = await user.findByIdAndDelete(id)
            if (result) {
                res.status(202).json({
                    message: "success",
                })
                let dataLog = {
                    "app_id": "63ce8575037d76527a59a655",
                    "user_id": "6390b2efdfb49a27e7e3c0b9",
                    "socket_id": "req.body.socket_id",
                    "action": "Delete user ",
                    "element": element,
                    "element_id": "1",
                    "ip_address": "192.168.1.1"
                }
                log.addLog(dataLog)
            } else {
                res.status(400).send({
                    'error': 'there is no such user'
                })
            }
        } catch (err) {
            res.status(400).send({
                'error': 'some error occurred. Try again '
            })
        }
    }

    
      

}
/**
     * get connected agent(role="agent" and is_online="true") who has the lowest active conversation ,status=1, 
     * https://foued.local.itwise.pro/chat_server/users/available_agent
     */
export const agentAvailable = async (accountId) => {
    try {
        const activeAgents = await user.find({
            role: "AGENT",
            is_active: true,
            accountId: accountId,
        });

        let agents;
        let userConversations = {};

        if (activeAgents.length > 0) {
            const activeAgentIds = activeAgents.map((agent) => agent._id);

            (await conversation.aggregate([
                {
                    $match: { owner_id: accountId, status: 1 },
                },
                {
                    $unwind: "$members",
                },
                {
                    $group: {
                        _id: "$members",
                        value: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ])).forEach((agentDetails) => {
                userConversations[agentDetails._id] = agentDetails.value;
            });

            agents = activeAgents.map((agent) => {
                agent = { ...agent }._doc;
                agent.count = userConversations[agent._id] ?? 0;
                return agent;
            });

            agents.sort((a, b) => a.count > b.count ? 1 : (a.count < b.count ? -1 : 0));
        } else {
            agents = await user.find({
                role: "AGENT",
                accountId: accountId,
            });

            const allAgentIds = agents.map((agent) => agent._id);

            (await conversation.aggregate([
                {
                    $match: { owner_id: accountId, status: 1 },
                },
                {
                    $unwind: "$members",
                },
                {
                    $group: {
                        _id: "$members",
                        value: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ])).forEach((agentDetails) => {
                userConversations[agentDetails._id] = agentDetails.value;
            });

            agents = agents.map((agent) => {
                agent = { ...agent }._doc;
                agent.count = userConversations[agent._id] ?? 0;
                return agent;
            });

            agents.sort((a, b) => a.count > b.count ? 1 : (a.count < b.count ? -1 : 0));
        }

        return agents.find((agent) => true);
    } catch (err) {
        console.log("err", err);
        logger(err);
    }
};


  /**
 * createUser: create user
 * @route /user
 * @method post
 * @body  nickname,full_name,profile_url,access_token,role,is_active,is_online,locale,last_seen_at,metadata
 */
export const createGuest = async (data, res) => {
        try {  
            const result = await user.create(data);
            if (result) {
                let dataLog = {
                    "app_id": "1",
                    "user_id": "6390b2efdfb49a27e7e3c0b9",
                    "socket_id": "req.body.socket_id",
                    "action": "Create user ",
                    "element": element,
                    "element_id": "1",
                    "ip_address": "192.168.1.1"
                }
                log.addLog(dataLog)
              return result 
            } 
        } catch (err) {
     
            logger(err)
        }
    }


    export const createAgent = async (data, res) => {
        try {  

            const result = await user.create(data.body);
            if (result) {
                let dataLog = {
                    "app_id": "1",
                    "user_id": "6390b2efdfb49a27e7e3c0b9",
                    "socket_id": "req.body.socket_id",
                    "action": "Create user ",
                    "element": element,
                    "element_id": "1",
                    "ip_address": "192.168.1.1"
                }
                log.addLog(dataLog)
                res.status(200).json({
                    'data': result
                })            } 
            
        } catch (err) {
            res.status(400).json({
                'error': 'some error occurred.try again'
            })
            logger(err)
        }


    }


    /**
 * update socket _id 
 */
export const putUserBalance = async (id,balance, res) => {
        try {
            const result = await user.findOneAndUpdate(
                {id:id},
                 {
                    $set: {
                        balance: balance
                    },
                    new:true,
                })
                // const balanceToUpdate = clientBalance.find(balance => balance.user === id);
            if (result) {

                return result
            } 
        } catch (err) {
            console.log(err)
            logger(err)
        }
    }

    export const putUserFreeBalance = async (id,balance, res) => {
        try {
            const result = await user.findOneAndUpdate(
                {id:id},
                 {
                    $set: {
                        free_balance: balance
                    },
                    new:true,
                })
                // const balanceToUpdate = clientBalance.find(balance => balance.user === id);
            if (result) {

                return result
            } 
        } catch (err) {
            console.log(err)
            logger(err)
        }
    }


    export const putBuyBalance = async (id, newBalance, res) => {      
        try {
          const userToUpdate = await user.findOne({ id: id });
          if (!userToUpdate) {
            return ;
          }
            const updatedBalance = userToUpdate?.balance || 0; 
            const updatedValue = isNaN(newBalance) ? 0 : Number(newBalance); 
            
            const result = await user.findOneAndUpdate(
              { id: id },
              {
                $set: {
                  balance: updatedBalance + updatedValue,
                },
              },
              { new: true }
            );
          return result;
        } catch (err) {
          console.log(err);
          logger(err);
        }
      };

export const getOperators=async(accountId)=>{
    try{
        const result=await user.find({
            role:"ADMIN",
            accountId:accountId        
        })
        return result[0]?._id
    }catch(err){
        console.log("err",err)
    }
  }


  export const updateAllUsersActivities = async () => {
    try {
     await user.updateMany({}, { $set: { is_active: false } });
    } catch (error) {
      console.error('Error updating users:', error);
    }
  };
  export const checkLoginUser =async(data)=>{
    try{
        const search=await user.find({
            role:"CLIENT",
            id:data.profile_id,
            account_id:data.accountId
        })
            return search
       

        }
    catch(error){
        console.error('Error login user:', error);

    }
  }
  