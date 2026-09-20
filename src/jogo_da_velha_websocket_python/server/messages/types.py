from dataclasses import dataclass
from typing import Optional, Dict, List

@dataclass
class CreateRoomMessage:
    player_name: str
    type: str = "CREATE_ROOM"

@dataclass
class JoinRoomMessage:
    room_id: str
    player_name: str
    type: str = "JOIN_ROOM"

@dataclass
class MakeMoveMessage:
    index: int
    type: str = "MAKE_MOVE"

@dataclass
class RestartGameMessage:
    type: str = "RESTART_GAME"

@dataclass
class LeaveRoomMessage:
    type: str = "LEAVE_ROOM"

@dataclass
class ChatMessage:
    text: str
    type: str = "CHAT_MESSAGE"

# Respostas do Servidor
@dataclass
class RoomCreatedEvent:
    room_id: str
    type: str = "ROOM_CREATED"

@dataclass
class GameStateEvent:
    room_id: str
    board: List[Optional[str]]
    current_turn: str
    status: str
    players: Dict[str, str]
    scores: Dict[str, int]
    winner: Optional[str] = None
    type: str = "GAME_STATE"

@dataclass
class ErrorEvent:
    message: str
    type: str = "ERROR"

@dataclass
class ChatEvent:
    player_name: str
    text: str
    type: str = "CHAT_EVENT"
