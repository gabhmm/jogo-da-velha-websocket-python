# Tasks — Implementação do Servidor de Jogo da Velha (WebSocket)

> Checklist de execução. Só iniciar após aprovação formal do PRD e do Tech Spec.

## Checklist

- [x] Adicionar pacotes de desenvolvimento ao projeto (`pytest`, `pytest-asyncio`) usando `uv`.
- [x] Implementar `messages/types.py` e `messages/serializer.py`: usar `dataclasses` nativas para tipar e validar as mensagens de entrada e saída (JSON).
- [x] Implementar `game/tic_tac_toe.py`: classe State Machine com a malha 3x3, verificação de vez de jogar, bloqueio bidirecional (quem tenta jogar fora da vez é bloqueado) e checagem de vitória/empate.
- [x] Escrever testes unitários automatizados cobrindo a lógica de `tic_tac_toe.py` para garantir que os requisitos de vitória, empate e bloqueios estão inquebráveis.
- [x] Implementar `game/connection_manager.py`: gerencia as salas, o placar, o revezamento (quem ganhou a última começa a próxima) e o broadcast de estado e mensagens de chat.
- [x] Implementar `handlers/game_handler.py`: lida com `RESTART_GAME` e `CHAT_MESSAGE`, acionando o manager.
- [x] Implementar `main.py`: start do Tornado.
- [x] Refatorar o cliente Javascript (`client/js/game.js` e etc):
  - [x] Implementar lógica de desenho passivo do tabuleiro via `GAME_STATE`.
  - [x] Implementar Modal de Fim de Jogo (Placar, Restart e Sair).
  - [x] Integrar Notificações (Toasts) visuais para erros e alertas da sala.
  - [x] Implementar funcionalidade de Chat em Tempo Real (Broadcast).
  - [x] Implementar indicador de "Oponente Pensando..." (facilmente desativável via flag ou comentário).
- [x] Realizar teste manual E2E validando tudo (incluindo chat e revezamento de turnos).

## Notas de execução
(Preencher conforme decisões em tempo de código)
