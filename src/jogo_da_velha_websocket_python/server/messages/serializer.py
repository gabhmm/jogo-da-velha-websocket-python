import json
from typing import Any
from .types import (
    CreateRoomMessage, JoinRoomMessage, MakeMoveMessage,
    RestartGameMessage, LeaveRoomMessage, ChatMessage
)

def parse_message(payload: str) -> Any:
    """Faz o parse de string JSON para o respectivo Dataclass validado."""
    try:
        data = json.loads(payload)
        msg_type = data.get("type")
        
        if msg_type == "CREATE_ROOM":
            return CreateRoomMessage(player_name=data["player_name"])
        elif msg_type == "JOIN_ROOM":
            return JoinRoomMessage(room_id=data["room_id"], player_name=data["player_name"])
        elif msg_type == "MAKE_MOVE":
            return MakeMoveMessage(index=data["index"])
        elif msg_type == "RESTART_GAME":
            return RestartGameMessage()
        elif msg_type == "LEAVE_ROOM":
            return LeaveRoomMessage()
        elif msg_type == "CHAT_MESSAGE":
            return ChatMessage(text=data["text"])
        else:
            raise ValueError(f"Unknown message type: {msg_type}")
    except (json.JSONDecodeError, KeyError) as e:
        raise ValueError(f"Invalid payload format: {str(e)}")
