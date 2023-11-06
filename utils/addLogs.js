import axios from "axios";

const addLogs = async (data,socket) => {
      try {
        await axios.post(`${process.env.API_PATH}/add_logs`, data, {
            headers:{
                "key": `${process.env.API_KEY}` 
              }
        })  
        
      } catch (error) {
        console.error("Error while logging data:", error);

      }
}

export default addLogs;

