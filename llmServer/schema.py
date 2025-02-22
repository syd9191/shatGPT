from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

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

class Message(BaseModel):
    role: str = Field(..., description="Role of the message sender",  pattern="^(system|user|assistant)$")
    content: str = Field(..., description="Content of the message")

class ConversationHistory(BaseModel):
    user_id: str = Field(..., description="Unique identifier of the user")
    title: str = Field(..., description="Title of the current conversation")
    conversation: List[Message] = Field(default=[], description="List of conversation messages")
    totalTokens: int = Field(default=0, description="Total tokens used in the conversation")
    lastUpdated: Optional[str] = Field(None, description="Timestamp of the last update (ISO string)")
    latestMessage: Optional[str] = Field(default="", description="Content of the latest message")
    createdAt: Optional[str] = Field(default_factory=str, description="Timestamp of when the conversation was created (ISO string)")
