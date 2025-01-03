import os

from dotenv import load_dotenv
from openai import OpenAI
from fastapi import FastAPI,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
import uvicorn
from datetime import datetime
from fastapi.encoders import jsonable_encoder

from schema import chatResponse, ConversationHistory, ChatCompletionMessage

load_dotenv()

#load in dot env
api_key=os.getenv("API_KEY")

#fastAPI webapp
app=FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=['*'])

@app.get("/health")
async def health_check():
    return {'status': "LLM server healthy", 'message': "LLM Server is up and running"}

    
@app.post("/chatbot/generate")
async def chatBot(conversationHistory: ConversationHistory):
    try:
        print(conversationHistory)
        client = OpenAI(
            api_key=api_key
        )
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            store=True,
            messages=conversationHistory.conversation)

        reply=completion.choices[0].message
        token_usage=completion.usage

        conversationHistory.conversation.append({
            "role": "assistant",
            "content": reply.content
        })
        conversationHistory.total_tokens+=token_usage.total_tokens
        conversationHistory.last_updated=datetime.now()
        conversationHistory.latest_message=reply.content


        print(dict(conversationHistory))
        return dict(conversationHistory)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




if __name__=="__main__":
    uvicorn.run(app, host="127.0.0.1", port=5000)








