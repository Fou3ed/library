import axios from "axios";
export let apiKeys = [];

const getApiKeys = async () => {
    try {
        const response = await axios.get(`${process.env.API_PATH}/api/accounts`);
        
        apiKeys = response.data.map(item => ({
            appId: item.id,
            appKey: item.api_key
        }));
        
        return apiKeys
    } catch (error) {
        console.log("error saving form", error);
    }
    return;

}

export default getApiKeys;
