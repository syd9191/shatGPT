
import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()


#load in dot env
api_key=os.getenv("API_KEY")
print(api_key)

client = OpenAI(
    api_key=api_key
)
completion = client.chat.completions.create(
    model="gpt-4o-mini",
    store=True,
    messages=[
        {"role": "user", "content": "Hello"}
    ])
message=completion.choices[0].message
print(message)
print("Tokens used:", completion.usage)
