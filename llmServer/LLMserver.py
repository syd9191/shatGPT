import os

from dotenv import load_dotenv
from openai import OpenAI
from fastapi import FastAPI,HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from schema import chatResponse, userMessage

load_dotenv()

#load in dot env
api_key=os.getenv("API_KEY")

#fastAPI webapp
app=FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=['*'])

@app.get("/")
async def health_check():
    return {"status": "healthy"}

@app.post("/chatbot/health")
async def health_check():
    try:
        return {"status": "ok", "message": "Server is up and running!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Server health check failed.")


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
        total_tokens=completion.usage.total_tokens
        print(reply)
        print(total_tokens)
        return {"message":reply, "total_tokens":total_tokens}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

if __name__=="__main__":
    uvicorn.run(app, host="127.0.0.1", port=5000)








