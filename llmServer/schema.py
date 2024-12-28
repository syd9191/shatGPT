from pydantic import BaseModel

class ChatCompletionMessage(BaseModel):
    content: str
    refusal: str
    role: str
    audio: None
    function_call: None
    tool_calls: None

class chatResponse(BaseModel):
    message: ChatCompletionMessage
    total_tokens: int


class userMessage(BaseModel):
    message: str


