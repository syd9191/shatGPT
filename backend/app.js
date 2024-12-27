const express= require('express');
const cors= require('cors');
const axios = require('axios');



const port = 3000; //abstract this to config file at a later time
const app= express();
    


//middleware
app.use(express.json());
app.use(express.urlencoded()); //remember we need this for post request body
app.use(cors()); //this is for allowing cross origin


const getLLMreply= async (userMessage)=>{
    try{
        const reply= await axios.post("http://127.0.0.1:5000/chatbot/generate", userMessage);
        console.log(reply.data);
        return reply.data;
    }catch (error){
        console.log(error);
    }
}



app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
});


//start with placeholder post req for main chatbot
app.post('/api/chatbot', async (req, res) => {
    const userMessage=req.body;
    console.log(userMessage);
    const reply= await getLLMreply(userMessage);
    //placeholder, we should add the llm call here
    res.json({chatBotReply: reply.message, total_tokens: reply.total_tokens});
});



