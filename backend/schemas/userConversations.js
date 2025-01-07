const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const userConversationsSchema= new Schema(
    {
    user_id: {
        type: String,
        required:true
    },

    conversationsList: {
        type: [
            {
                title:{
                    type: String, 
                    required:true
                },

                conversation_id:{
                    type: String,
                    required:true
                }

            }
        ],
        default:[]
    }
    }
);

const userConversations=mongoose.model('userConversation', userConversationsSchema);

module.exports=userConversations;