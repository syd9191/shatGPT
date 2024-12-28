import os

from dotenv import load_dotenv
from openai import OpenAI
from fastapi import FastAPI,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
import uvicorn

from schema import chatResponse, userMessage, ChatCompletionMessage

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
async def chatBot(userMessage: userMessage):
    try:
        client = OpenAI(
            api_key=api_key
        )
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            store=True,
            messages=[
                {"role": "user", "content": userMessage.message}
            ])
        reply=completion.choices[0].message
        token_usage=completion.usage
        return {'message':reply, 'token_usage': token_usage}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

if __name__=="__main__":
    uvicorn.run(app, host="127.0.0.1", port=5000)








