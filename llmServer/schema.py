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
    conversation: List[Message] = Field(default=[], description="List of conversation messages")
    total_tokens: int = Field(default=0, description="Total tokens used in the conversation")
    last_updated: Optional[datetime] = Field(None, description="Timestamp of the last update")
    latest_message: Optional[str] = Field(default="", description="Content of the latest message")
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow, description="Timestamp of when the conversation was created")
