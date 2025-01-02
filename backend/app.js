//required packages
const express= require('express');
const cors= require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const bcrypt=require('bcrypt');


//custom
const {pingBackendServer, pingLLMServer} = require('./healthCheck.js');

//Schemas
const userDetailModel=require('./schemas/userDetails.js');
const conversationHistoryModel=require('./schemas/conversationHistory.js');


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
            return res.status(400).json({status:400, message:"Username already exists"})
        }

        const hashedPw=await bcrypt.hash(password, 10);
        const userDetails= new userDetailModel({username: username, 
                                                password: hashedPw});
        await userDetails.save();
        //create a new conversation for each new user
        const getUser= await userDetailModel.findOne({username: username});
        console.log(getUser);
        const newConversation=new conversationHistoryModel({
            user_id:getUser._id
        })
        newConversation.save();
        console.log("Backend Server: Successful User Sign Up");
        res.status(200).json({status:200, message:"Successful User Signup"});
    } catch (err){
        console.error(err);
        res.status(500).json({status:500,message: "Signup Failed"});
    }
    });

app.post('/login', async (req, res)=>{
    const {username, password}=req.body;
    try{
        const existingUser= await userDetailModel.findOne({username: username});
        console.log(existingUser);

        if (!existingUser){
            return res.status(400).json({status:400, message:"This Username does not exist"})
        }

        const correctPassword= await bcrypt.compare(password, existingUser.password); //returns bool

        if (correctPassword) {
            console.log("Backend Server: User Sign In Successful");
            res.status(200).json({ status: 200, message: "Successful User Login", user_id: existingUser._id}); // Corrected message
        } else {
            console.log("Wrong Password Entered");
            res.status(401).json({ status: 401, message: "Wrong Password Entered" }); 
        }
    } catch (err){
        console.error(err);
        res.status(500).json({status:500,message: "Login Failed"});
    }
});

app.post('/get-user-conversation', async (req, res)=>{
    const {user_id}=req.body;
    console.log(user_id);
    
    try{
        const conversationHisory=await conversationHistoryModel.findOne({
            user_id: new mongoose.Types.ObjectId(user_id)
        });

        res.status(200).json(
            {status:200, 
             message: "Successful Retrieval of Conversation History", 
             user_id:user_id, 
             conversationHistory: conversationHisory.conversation})
    } catch (err){
        console.error(err);
        res.status(500).json({
            status:500,
            message: "UnSuccessful Retrieval of Conversation History"
        })
    }
});





