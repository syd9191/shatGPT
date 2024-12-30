//required packages
const express= require('express');
const cors= require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const bcrypt=require('bcrypt');


//custom
const {pingBackendServer, pingLLMServer} = require('./healthCheck.js');
const userDetailModel=require('./schemas/userDetails.js');


require('dotenv').config();


const port = 3000; //abstract this to config file at a later time
const app= express();
const DBURI= process.env.DBURI;



//middleware
app.use(express.json());
app.use(express.urlencoded()); //remember we need this for post request body
app.use(cors()); //this is for allowing cross origin


mongoose.connect(DBURI)
    .then(()=>{
        console.log("MongoDB Connected!");
        app.listen(port, ()=>{
            console.log(`Listening on port ${port}`)
        });
    })
    .catch((err)=>{
        console.log(err);
    });


//health check
app.get('/health', (req, res)=>{
    res.status(200).json({
        status: "Backend Server Healthy",
        message: "Backend Server is up and running"
    })
})

const getLLMreply= async (userMessage)=>{
    try{
        //check health first 
        pingLLMServer();
        pingBackendServer();

        const reply= await axios.post("http://127.0.0.1:5000/chatbot/generate", userMessage);

        console.log('backend server received reply: ', reply.data.message.content);

        return reply.data; //this is the whole json object
        
    }catch (error){
        console.log(error);
    }
}

//start with placeholder post req for main chatbot
app.post('/api/chatbot', async (req, res) => {
    const userMessage=req.body;
    console.log("Backend Server received userMessage: ", userMessage.message);

    const chatResponse= await getLLMreply(userMessage);
    res.json({replyDetailsObj: chatResponse.message, tokenUsageObj: chatResponse.token_usage});
});

//DB Methods: We do it in backend server like a boss
app.post('/signup', async (req, res)=>{
    const {username, password}=req.body;
    try{
        const userExists= await userDetailModel.findOne({username: username});
        if (userExists){
            return res.status(400).json({message:"Username already exists"})
        }

        const hashedPw=await bcrypt.hash(password, 10);
        const userDetails= new userDetailModel({username: username, 
                                                password: hashedPw});

        userDetails.save()
        console.log("Successful User Signup");
        res.status(200).json({message:"Successful User Signup"})
    } catch (err){
        console.error(err);
        res.status(500).json({ message: "Signup Failed", error: err.message });
    }
    });


