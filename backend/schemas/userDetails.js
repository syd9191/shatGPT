const mongoose= require('mongoose');
const Schema=mongoose.Schema;

const userSchema= new Schema({
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
}, {timeStamps:true});

const User=mongoose.model('user', userSchema);

module.exports=User;
