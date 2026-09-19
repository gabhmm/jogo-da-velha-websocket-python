# jogo-da-velha-websocket-python

Jogo da velha multiplayer em tempo real via WebSocket. Client em JavaScript e servidor em Python com Tornado.

## Stack

- **Client:** HTML, CSS (Tailwind), JavaScript
- **Server:** Python, Tornado
- **Gerenciador de pacotes:** uv

## Estrutura do projeto

```
jogo-da-velha-websocket-python/
├── client/
│   ├── css/
│   │   ├── input.css
│   │   └── style.css
│   ├── js/
│   │   ├── communication/
│   │   │   └── socket.js
│   │   ├── presentation/
│   │   │   └── ui.js
│   │   └── game.js
│   └── index.html
│
├── server/
│   ├── game/
│   │   ├── connection_manager.py
│   │   └── tic_tac_toe.py
│   ├── handlers/
│   │   └── game_handler.py
│   ├── messages/
│   │   ├── serializer.py
│   │   └── types.py
│   └── main.py
│
├── pyproject.toml
├── uv.lock
└── README.md
```

## Setup

```bash
uv sync
```

## Rodando o servidor

```bash
uv run server/main.py
```

## Abrindo o client

Abrir `client/index.html` no navegador.