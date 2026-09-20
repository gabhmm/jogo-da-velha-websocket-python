# PRD — Implementação do Servidor de Jogo da Velha (WebSocket)

## Contexto
O projeto trata-se de uma avaliação acadêmica onde os alunos (em grupos de até 5 pessoas) devem construir uma aplicação utilizando WebSocket. O frontend (cliente em HTML/JavaScript puro com CSS/Tailwind) já tem sua estrutura inicial e interface delineados, e agora é necessário construir o backend em Python utilizando o framework Tornado, em conformidade com as restrições (client/server claros) e tecnologias passadas em sala de aula.

## Problema
O código atual do servidor Python (`main.py`, `connection_manager.py`, `tic_tac_toe.py` etc.) está inteiramente em branco (0 bytes). Não há lógica de jogo, gerenciamento de estados, nem servidor rodando, o que impossibilita as conexões e interações em tempo real do frontend. Além disso, é exigido garantir de forma rigorosa que toda a lógica de negócio esteja no servidor. O cliente atual pode até ter código de estado embutido que precisa ser desacoplado.

## Objetivo
Implementar o backend do Jogo da Velha (Tic-Tac-Toe) com Python e Tornado, gerenciando a comunicação via WebSocket em tempo real. O backend deve ser o responsável único e absoluto pela lógica do jogo, validação de regras, gerenciamento do estado global e fluxo das mensagens. O frontend deve atuar estritamente como um "cliente passivo" (dumb client).

## Escopo
### Incluído
- Implementação de um servidor WebSocket assíncrono usando Tornado (`main.py` e `handlers/game_handler.py`).
- Sistema de gerenciamento de conexões, lobby e salas independentes (`game/connection_manager.py`).
- Implementação da lógica State Machine de Jogo da Velha: validação da vez de quem joga, verificação de vitória (diagonais, linhas, colunas), empate e reinício do jogo (`game/tic_tac_toe.py`).
- Definição de contratos/schemas de mensagens consistentes (usando classes nativas `dataclasses` em `messages/`).
- Atualização do client JS para que ele não compute vitórias e sim apenas "desenhe na tela" (UI) as respostas do servidor (garantindo a distinção clara de papéis do requisito).

### Fora de escopo
- Mudar para outro framework web que não tenha sido o padrão da aula (como FastAPI ou Django Channels).
- Adição de banco de dados persistente real (como SQLite ou PostgreSQL). Os estados das salas e jogos serão mantidos na memória RAM local do servidor, o que atende plenamente ao projeto.
- Sistema de Contas/Login com senha (os jogadores usam nomes provisórios fornecidos na entrada).

## Critérios de aceite
- [ ] O comando `uv run server/main.py` inicia o servidor corretamente sem erros.
- [ ] O cliente JS consegue criar uma sala recebendo um código do servidor e aguardar o outro jogador.
- [ ] Um segundo cliente JS consegue entrar em uma sala usando o código específico. O jogo apenas inicia quando existem dois jogadores conectados na mesma sala.
- [ ] O servidor proíbe expressamente uma jogada de um jogador quando for o turno do adversário (ex: jogador X não joga no turno do O, e jogador O não joga no turno do X).
- [ ] O servidor analisa a malha (grid) a cada jogada e notifica ambos se houver vitória ou empate, bloqueando o tabuleiro e atualizando o placar da sala.
- [ ] Separação clara: Código de Frontend (`.js`) não contém validações de "quem ganhou", ele recebe a notificação do servidor e exibe um modal/popup com a quantidade de vitórias de cada jogador.
- [ ] O modal de fim de jogo deve exibir um botão para "Jogar Novamente" (reinicia a partida mantendo a sala) e um botão para voltar à tela inicial (Lobby).

## Riscos e dependências
- **Desconexão:** Precisamos limpar a sala se um jogador fechar o navegador antes do término, notificando o remanescente.
- **Segurança de Mensagem:** Garantir que se o JS enviar um payload lixo, o backend em Tornado consiga pegar a exceção, dropar o pacote malicioso e não "quebrar" (crash) o processo principal para as demais salas.
