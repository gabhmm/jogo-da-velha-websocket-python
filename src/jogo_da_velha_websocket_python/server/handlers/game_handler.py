import tornado.websocket
import logging
try:
    from ..game.connection_manager import ConnectionManager
    from ..messages.serializer import parse_message
    from ..messages.types import (
        CreateRoomMessage, JoinRoomMessage, MakeMoveMessage,
        RestartGameMessage, LeaveRoomMessage, ChatMessage
    )
except (ImportError, ValueError):
    from game.connection_manager import ConnectionManager
    from messages.serializer import parse_message
    from messages.types import (
        CreateRoomMessage, JoinRoomMessage, MakeMoveMessage,
        RestartGameMessage, LeaveRoomMessage, ChatMessage
    )


class GameHandler(tornado.websocket.WebSocketHandler):
    def initialize(self, manager: ConnectionManager):
        self.manager = manager

    def check_origin(self, origin):
        return True  # Permitindo qualquer origem para facilitar testes locais

    def open(self):
        logging.info("Nova conexão WebSocket estabelecida.")

    def on_message(self, message):
        try:
            msg = parse_message(message)
            
            if isinstance(msg, CreateRoomMessage):
                self.manager.create_room(self, msg.player_name)
            elif isinstance(msg, JoinRoomMessage):
                self.manager.join_room(self, msg.room_id, msg.player_name)
            elif isinstance(msg, MakeMoveMessage):
                self.manager.make_move(self, msg.index)
            elif isinstance(msg, RestartGameMessage):
                self.manager.restart_game(self)
            elif isinstance(msg, LeaveRoomMessage):
                self.manager.leave_room(self)
            elif isinstance(msg, ChatMessage):
                self.manager.chat_message(self, msg.text)
                
        except ValueError as e:
            self.write_message({"type": "ERROR", "message": str(e)})

    def on_close(self):
        logging.info("Conexão WebSocket encerrada.")
        self.manager.leave_room(self)
