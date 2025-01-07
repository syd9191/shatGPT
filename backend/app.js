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
const userConversations=require('./schemas/userConversations.js');


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

        console.log('backend server received obect from frontend: ', reply.data);

        return reply.data; //this is the whole json object
        
    }catch (error){
        console.log(error);
    }
}

//start with placeholder post req for main chatbot
app.post('/api/chatbot', async (req, res) => {
    const userMessage=req.body;
    console.log("Backend Server received userMessage: ", userMessage.conversationHistory);

    const filter={_id:userMessage.conversationHistory._id};
    const newConversationHistory=userMessage.conversationHistory
    const convHist= await conversationHistoryModel.findOneAndUpdate(filter, userMessage.conversationHistory);
    console.log("DB received userMessage: ", convHist);

    const chatResponse= await getLLMreply(userMessage.conversationHistory);
    const updatedFilter={_id:userMessage.conversationHistory._id};
    const updatedConvHist= await conversationHistoryModel.findOneAndUpdate(updatedFilter, chatResponse);
    console.log("DB received userMessage: ", updatedConvHist);
    
    console.log("LLM SERVER REPLY: ", chatResponse);
    res.json(chatResponse);
});

//DB Methods: We do it in backend server like a boss
app.post('/signup', async (req, res)=>{
    const {username, password}=req.body;
    try{
        //creation of user profile: username and hashed password
        const userExists= await userDetailModel.findOne({username: username});
        if (userExists){
            return res.status(400).json({status:400, message:"Username already exists"})
        }

        const hashedPw=await bcrypt.hash(password, 10);
        const userDetails= new userDetailModel({username: username, 
                                                password: hashedPw});
        await userDetails.save();

        //create a new userConversation container for each new user
        const getUser= await userDetailModel.findOne({username: username});
        console.log(getUser);
        const newConversation=new userConversations({
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


//TODO: to change later
app.post('/get-conversation-history', async (req, res)=>{
    const conversation_id=req.body.conversation_id;
    console.log(conversation_id);
    
    try{
        const conversationHistory=await conversationHistoryModel.findOne({
            _id: new mongoose.Types.ObjectId(conversation_id)
        });
        console.log("Conversation History Fetched From DB: ", conversationHistory);

        res.status(200).json(
            {status:200, 
             message: "Successful Retrieval of Conversation History", 
             user_id:conversationHistory.user_id, 
             conversationHistory: conversationHistory})
    } catch (err){
        console.error(err);
        res.status(500).json({
            status:500,
            message: "UnSuccessful Retrieval of Conversation History"
        })
    }
});


app.post('/get-user-conversations', async (req, res)=>{
    const user_id= req.body.user_id;
    try {
        const userIdFilter={user_id:user_id};
        const userConversation= await userConversations.findOne(
            userIdFilter
        );
        console.log("userConversation fetched from DB");

        res.status(200).json({
            status:200,
            message: "Successful Retrieval of User Conversation",
            userConversation: userConversation});
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status:500,
            message: "Unsuccessful Retrieval of User Conversation"
        });
    }
});

app.post('/update-user-conversations', async (req, res)=>{
    const user_id= req.body.user_id;
    const conversationsList= req.body.conversationsList;
    try {
        const userIdFilter={user_id:user_id};
        const conversationListUpdate={$set: {conversationsList:conversationsList}};

        const userConversation= await userConversations.findOneAndUpdate(
            userIdFilter,
            conversationListUpdate,
            { returnDocument: "after", upsert:true}
        );
        console.log("userConversation updated from DB");
        res.status(200).json({
            status:200,
            message: "Successful Update of User Conversation",
            userConversation: userConversation});
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status:500,
            message: "Unsuccessful Update of User Conversation"
        });
    }
});

app.post('/clear-conversation', async (req, res)=>{
    try{
        const clearedConversationhistory=req.body.conversationHistory;
        const filter={user_id:clearedConversationhistory.user_id}
        const clearedDoc= await conversationHistoryModel.findOneAndUpdate(
            filter, clearedConversationhistory
        ).then(()=>{
            console.log("Clear-conversation endpoint: Conversation Cleared");
            res.status(200).json({
                status:200,
                message:"Conversation Clearing Successful"
            });
        });
    }
    catch (error){
        console.error(error);
        res.status(500).json({
            status:500, 
            message:"Conversation Clearing Unsuccessful, Internal Server Error"});
    }
});

app.post('/create-conversation-history', async (req,res)=>{
    const user_id=req.body.user_id;
    const title=req.body.title;
    try{
        const newConversation=new conversationHistoryModel({
            user_id:user_id,
            title:title
        });
        newConversation.save();
        const messageSuccess='conversationHistory: '+ title + 'saved successfully!';
        res.status(200).json({
            status:200,
            message: messageSuccess,
            conversationHistory: newConversation
        });
    } catch (error){
        console.error(error);
        res.status(500).json({
            status:500, 
            message:"Unsuccessful Creation of Conversation History, Internal Server Error"});
        }
})





