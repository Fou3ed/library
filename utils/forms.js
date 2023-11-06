import axios from "axios";

export let contactForms = [];

const getForms = async (retryCount = 0) => {
  try {
    const response = await axios.get(`${process.env.API_PATH}/GetFormType`,
    {headers:{
      "key":`${process.env.API_KEY}`,
    }}
    );
    if (response?.data?.data) {
      contactForms = response.data.data;
    return contactForms
    }
  } catch (error) {
    console.error("Error retrieving forms:", error);
    if (retryCount < 10) {
       getForms(retryCount + 1); 
    } else {
      console.log("error getting forms from iheb's data base")
    }
  }
}

export const filterForms = (type, accountId,source,agentStatus) => {
      // contactForms.sort((form,firm)=>(form-firm))
    
  return contactForms.find(form => form.form_type == type && form.account_id == accountId && (form.source==source || form.source== null) && (form.agent_status==agentStatus || form.agent_status==null))
}

export default getForms;
