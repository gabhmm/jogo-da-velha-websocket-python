from typing import Dict, Any
import json
import string
import random
from tornado.websocket import WebSocketHandler
from .tic_tac_toe import TicTacToeGame

class Room:
    def __init__(self, room_id: str):
        self.room_id = room_id
        self.players: Dict[str, WebSocketHandler] = {}
        self.player_names: Dict[str, str] = {}
        self.scores: Dict[str, int] = {"X": 0, "O": 0}
        self.game = TicTacToeGame()
        self.last_winner: str = "X"

    def add_player(self, name: str, ws: WebSocketHandler) -> str:
        if "X" not in self.players:
            symbol = "X"
        elif "O" not in self.players:
            symbol = "O"
        else:
            raise ValueError("Sala cheia.")

        self.players[symbol] = ws
        self.player_names[symbol] = name

        if len(self.players) == 2:
            self.game.start_game(starting_player=self.last_winner)
        return symbol

    def remove_player_by_ws(self, ws: WebSocketHandler):
        for symbol, player_ws in list(self.players.items()):
            if player_ws == ws:
                del self.players[symbol]
                del self.player_names[symbol]
                self.game.status = "WAITING_OPPONENT"

    def get_state(self) -> Dict[str, Any]:
        return {
            "type": "GAME_STATE",
            "room_id": self.room_id,
            "board": self.game.board,
            "current_turn": self.game.current_turn,
            "status": self.game.status,
            "players": self.player_names,
            "scores": self.scores,
            "winner": self.game.winner
        }


class ConnectionManager:
    def __init__(self):
        self.rooms: Dict[str, Room] = {}
        self.player_room_map: Dict[WebSocketHandler, str] = {}

    def _generate_room_id(self) -> str:
        while True:
            code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
            if code not in self.rooms:
                return code

    def create_room(self, ws: WebSocketHandler, player_name: str):
        room_id = self._generate_room_id()
        room = Room(room_id)
        self.rooms[room_id] = room
        room.add_player(player_name, ws)
        self.player_room_map[ws] = room_id
        
        ws.write_message(json.dumps({"type": "ROOM_CREATED", "room_id": room_id}))
        self.broadcast_state(room_id)

    def join_room(self, ws: WebSocketHandler, room_id: str, player_name: str):
        room_id = room_id.upper()
        if room_id not in self.rooms:
            ws.write_message(json.dumps({"type": "ERROR", "message": "Sala não encontrada."}))
            return

        room = self.rooms[room_id]
        try:
            room.add_player(player_name, ws)
            self.player_room_map[ws] = room_id
            self.broadcast_state(room_id)
        except ValueError as e:
            ws.write_message(json.dumps({"type": "ERROR", "message": str(e)}))

    def make_move(self, ws: WebSocketHandler, index: int):
        room_id = self.player_room_map.get(ws)
        if not room_id:
            return
        
        room = self.rooms[room_id]
        symbol = "X" if room.players.get("X") == ws else "O" if room.players.get("O") == ws else None
        if not symbol:
            return

        try:
            room.game.make_move(index, symbol)
            if room.game.status == "FINISHED":
                if room.game.winner in ["X", "O"]:
                    room.scores[room.game.winner] += 1
                    room.last_winner = room.game.winner
                else:
                    room.last_winner = "O" if room.last_winner == "X" else "X"
                
            self.broadcast_state(room_id)
        except ValueError as e:
            ws.write_message(json.dumps({"type": "ERROR", "message": str(e)}))

    def restart_game(self, ws: WebSocketHandler):
        room_id = self.player_room_map.get(ws)
        if not room_id:
            return
        room = self.rooms[room_id]
        if len(room.players) == 2:
            room.game.start_game(starting_player=room.last_winner)
            self.broadcast_state(room_id)

    def leave_room(self, ws: WebSocketHandler):
        room_id = self.player_room_map.get(ws)
        if room_id and room_id in self.rooms:
            room = self.rooms[room_id]
            # Avisa o adversário remanescente para ele voltar à tela inicial
            for player_ws in room.players.values():
                if player_ws != ws:
                    try:
                        player_ws.write_message(json.dumps({"type": "OPPONENT_LEFT"}))
                    except:
                        pass
                
                # Remove o adversário e quem saiu do mapa
                if player_ws in self.player_room_map:
                    del self.player_room_map[player_ws]
                    
            del self.rooms[room_id]

    def chat_message(self, ws: WebSocketHandler, text: str):
        room_id = self.player_room_map.get(ws)
        if not room_id:
            return
        room = self.rooms[room_id]
        symbol = "X" if room.players.get("X") == ws else "O" if room.players.get("O") == ws else None
        if not symbol:
            return
        
        name = room.player_names[symbol]
        self.broadcast_message(room_id, {"type": "CHAT_EVENT", "player_name": name, "text": text})

    def broadcast_state(self, room_id: str):
        if room_id in self.rooms:
            room = self.rooms[room_id]
            state = room.get_state()
            state_json = json.dumps(state)
            for player_ws in room.players.values():
                player_ws.write_message(state_json)

    def broadcast_message(self, room_id: str, msg: Dict[str, Any]):
        if room_id in self.rooms:
            msg_json = json.dumps(msg)
            for player_ws in self.rooms[room_id].players.values():
                player_ws.write_message(msg_json)
