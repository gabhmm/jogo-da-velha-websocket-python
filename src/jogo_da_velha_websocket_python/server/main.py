import tornado.ioloop
import tornado.web
import logging
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from game.connection_manager import ConnectionManager
from handlers.game_handler import GameHandler

def make_app():
    manager = ConnectionManager()
    return tornado.web.Application([
        (r"/ws", GameHandler, dict(manager=manager)),
    ])

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    app = make_app()
    port = 8888
    app.listen(port)
    logging.info(f"Servidor WebSocket iniciado na porta {port}.")
    tornado.ioloop.IOLoop.current().start()
