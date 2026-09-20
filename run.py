"""
Script de entrada rápido para inicializar o servidor WebSocket.
Permite executar simplesmente: uv run run.py
"""
import os
import sys

current_dir = os.path.dirname(os.path.abspath(__file__))
server_dir = os.path.join(current_dir, "src", "jogo_da_velha_websocket_python", "server")
sys.path.insert(0, server_dir)

if __name__ == "__main__":
    import runpy
    main_file = os.path.join(server_dir, "main.py")
    try:
        runpy.run_path(main_file, run_name="__main__")
    except KeyboardInterrupt:
        print("\nServidor encerrado pelo usuário com sucesso.")
