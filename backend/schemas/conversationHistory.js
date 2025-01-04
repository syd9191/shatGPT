const mongoose= require('mongoose');
const Schema= mongoose.Schema;

const conversationHistorySchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    conversation:{
        type: [
            {
                role: {
                    type: String,
                    enum: ['system', 'user', 'assistant'],
                    required: true,
                },

                content:{
                    type:String, 
                    required:true
                }
            }
        ], 
        defualt:[]
    },
    totalTokens:{
        type:Number, 
        default:0
    },

    lastUpdated:{
        type: Date, 
    },

    latestMessage:{
        type: String,
        default:''
    },

    createdAt:{
        type: Date,
        default: Date.now
    }
});


conversationHistorySchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    if (this.conversation.length > 0) {
        this.latestMessage = this.conversation[this.conversation.length - 1].content;
    }
    next();
});

const ConversationHistory=mongoose.model('conversationHistory', conversationHistorySchema);

module.exports=ConversationHistory;