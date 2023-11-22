import axios from "axios";

export async function changePassword(data,socket) {

    const response = await axios.post(
        `${process.env.API_PATH}/new_password `,
        data,
        {
          headers: {
            key: `${process.env.API_KEY}`,
          },
        }
      );
      console.log(response)
      if(response){
        socket.emit("password-result",response.data)
      }
    }
    