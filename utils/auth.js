import  appActions from '../models//app/appMethods.js'


const foued=new appActions()

const check =function (data) {
    
   foued.getAppById(data).then(resData=>{

      if(resData){
        return true 

      }

   })

}

export default check
