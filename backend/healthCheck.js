const axios= require('axios');

const pingBackendServer = async () => {
    try {
        const backEndStatus = await axios.get('http://127.0.0.1:3000/health');
        console.log('Backend Ping Successful:', backEndStatus.data);
    } catch (error) {
        console.log('Error Pinging Backend Server:', error.message);
    }
};

const pingLLMServer = async () => {
    try {
        const llmServerStatus = await axios.get('http://127.0.0.1:5001/health');
        console.log('LLM Server Ping Successful:', llmServerStatus.data);
    } catch (error) {
        console.log('Error Pinging LLM Server:', error.message);
    }
};


module.exports={ pingBackendServer, pingLLMServer};