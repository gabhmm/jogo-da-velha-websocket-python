import tornado.ioloop
import tornado.web
import logging
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from game.connection_manager import ConnectionManager
    from handlers.game_handler import GameHandler
except ImportError:
    from jogo_da_velha_websocket_python.server.game.connection_manager import ConnectionManager
    from jogo_da_velha_websocket_python.server.handlers.game_handler import GameHandler

def make_app():
    manager = ConnectionManager()
    return tornado.web.Application([
        (r"/ws", GameHandler, dict(manager=manager)),
    ])

def main():
    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
    app = make_app()
    port = 8888
    app.listen(port)
    logging.info(f"Servidor WebSocket iniciado na porta {port}.")
    try:
        tornado.ioloop.IOLoop.current().start()
    except KeyboardInterrupt:
        logging.info("Servidor encerrado pelo usuário com sucesso.")

if __name__ == "__main__":
    main()

