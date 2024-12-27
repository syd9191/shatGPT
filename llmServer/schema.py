from pydantic import BaseModel

class chatResponse(BaseModel):
    message: str
    total_tokens: int


class userMessage(BaseModel):
    message: str
