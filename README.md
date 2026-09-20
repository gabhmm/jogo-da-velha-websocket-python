# jogo-da-velha-websocket-python

Jogo da velha multiplayer em tempo real via WebSocket. Client em JavaScript e servidor em Python com Tornado.

## Stack

- **Client:** HTML, CSS (Tailwind), JavaScript
- **Server:** Python, Tornado
- **Gerenciador de pacotes:** uv

## Estrutura do projeto

```
jogo-da-velha-websocket-python/
├── src/
│   └── jogo_da_velha_websocket_python/
│       ├── client/
│       │   ├── css/
│       │   │   ├── input.css
│       │   │   └── style.css
│       │   ├── js/
│       │   │   ├── communication/
│       │   │   │   └── socket.js
│       │   │   ├── presentation/
│       │   │   │   └── ui.js
│       │   │   └── game.js
│       │   └── index.html
│       └── server/
│           ├── game/
│           │   ├── connection_manager.py
│           │   └── tic_tac_toe.py
│           ├── handlers/
│           │   └── game_handler.py
│           ├── messages/
│           │   ├── serializer.py
│           │   └── types.py
│           └── main.py
├── tests/
│   ├── conftest.py
│   └── test_tic_tac_toe.py
├── pyproject.toml
├── uv.lock
└── README.md
```

## Setup

```bash
uv sync
```

## Rodando o Servidor

Você pode iniciar o servidor de forma rápida com:

```bash
uv run start
```
*(ou `uv run server`, ou `uv run run.py`)*

O servidor WebSocket iniciará em `ws://localhost:8888/ws` (ou na porta definida).

## Abrindo o Client

Abra o arquivo `src/jogo_da_velha_websocket_python/client/index.html` no seu navegador (ou utilize uma extensão como Live Server no VS Code).

## Rodando os Testes Automatizados

```bash
uv run pytest
```