
import { saveFormRegistration } from "./saveFormRegistration.js";
import { saveForms } from "./saveForms.js";
const saveFormData = async (dataForm,socket) => {
  let data = JSON.parse(dataForm);

  if (data.form.form_type==1 && data.verificationCode){
      saveFormRegistration(dataForm,socket)
      
    }else {
    saveForms(dataForm,socket)
    }

    }


export default saveFormData;

