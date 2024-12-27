from dotenv import load_dotenv
import os
from openai import OpenAI

load_dotenv()

#load in dot env
api_key=os.getenv("API_KEY")


client = OpenAI(
  api_key=api_key
)

completion = client.chat.completions.create(
  model="gpt-4o-mini",
  store=True,
  messages=[
    {"role": "user", "content": "What color is the sky"}
  ]
)

print(completion.choices[0].message)
print("Tokens used:", completion.usage)
