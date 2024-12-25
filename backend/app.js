const express= require('express');
const cors= require('cors');

const port = 3000; //abstract this to config file at a later time
const app= express();

//middleware
app.use(express.json());
app.use(express.urlencoded()); //remember we need this for post request body

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
});


//start with placeholder post req for main chatbot
app.post('/api/chatbot', (req, res) => {
    const userMessage=req.body.userMessage;
    console.log(userMessage);
    res.json({reply: `Your Message Is: ${userMessage}`});
});



