import axios from "axios"
import { saveForms } from "./saveForms.js"

export const saveFormRegistration = async(dataForm,socket)=>{
    let data = JSON.parse(dataForm);
let verif;
if(data.limitCode>0){


      verif=  await axios.post(`${process.env.API_PATH}/tools/2fa/verify`,  {
        receiver:data.email,
        code:data.verificationCode
      },{
        headers: {
            'Content-Type': 'application/json',
             "key": `${process.env.API_KEY}` 
        }
    })
    if(verif.data.success==true){
        saveForms(dataForm,socket)
    }else {
           socket.emit("wrongCode",verif?.data,data.limitCode)  
    }

}else {
    socket.emit("wrongCode",verif?.data,data.limitCode)

}
   
}