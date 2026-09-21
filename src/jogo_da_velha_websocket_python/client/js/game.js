class Game {
    constructor() {
        this.roomId = null;
        this.mySymbol = null;
        this.currentTurn = null;
        this.gameOver = false;
        this.init();
    }

    init() {
        document.getElementById('btnCreate').addEventListener('click', () => this.createRoom());
        document.getElementById('btnJoin').addEventListener('click', () => this.joinRoom());
        
        // Modal Buttons
        document.getElementById('btnRematch').addEventListener('click', () => {
            ui.hideGameOverModal();
            this.requestRematch();
        });
        document.getElementById('btnLeaveRoom').addEventListener('click', () => {
            socket.send('LEAVE_ROOM');
            location.reload();
        });

        // Chat
        document.getElementById('btnSendChat').addEventListener('click', () => this.sendChat());
        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendChat();
        });

        document.querySelectorAll('.cell').forEach(cell => {
            cell.addEventListener('click', () => {
                const index = parseInt(cell.getAttribute('data-index'), 10);
                this.makeMove(index);
            });
        });

        socket.onMessage((data) => this.handleServerMessage(data));
    }

    createRoom() {
        const playerName = document.getElementById('inputPlayerName').value.trim();
        if (!playerName) {
            ui.updateLobbyMessage('Por favor, insira seu nome.', 'error');
            return;
        }
        socket.send('CREATE_ROOM', { player_name: playerName });
    }

    joinRoom() {
        const playerName = document.getElementById('inputPlayerName').value.trim();
        const roomId = document.getElementById('inputRoomId').value.trim().toUpperCase();

        if (!playerName) {
            ui.updateLobbyMessage('Por favor, insira seu nome.', 'error');
            return;
        }
        if (!roomId) {
            ui.updateLobbyMessage('Informe o código da sala.', 'error');
            return;
        }

        socket.send('JOIN_ROOM', { room_id: roomId, player_name: playerName });
    }

    makeMove(position) {
        if (this.gameOver || this.currentTurn !== this.mySymbol) {
            ui.showGameToast('Não é a sua vez!', 'error');
            return;
        }
        socket.send('MAKE_MOVE', { index: position });
    }

    requestRematch() {
        socket.send('RESTART_GAME');
    }

    sendChat() {
        const input = document.getElementById('chatInput');
        const text = input.value.trim();
        if (text) {
            socket.send('CHAT_MESSAGE', { text });
            input.value = '';
        }
    }

    handleServerMessage(data) {
        const { type, ...payload } = data;

        switch (type) {
            case 'ROOM_CREATED':
                this.roomId = payload.room_id;
                this.mySymbol = 'X';
                document.getElementById('inputRoomId').value = this.roomId;
                ui.showWaitingOpponent(this.roomId);
                break;

            case 'GAME_STATE':
                this.roomId = payload.room_id;
                
                // Deduze o simbolo do usuario pelo nome
                const myName = document.getElementById('inputPlayerName').value.trim();
                if (payload.players['X'] === myName) this.mySymbol = 'X';
                else if (payload.players['O'] === myName) this.mySymbol = 'O';

                this.currentTurn = payload.current_turn;
                ui.setRoomInfo(this.roomId, this.mySymbol || '?');
                ui.setPlayers(payload.players);
                ui.renderBoard(payload.board);

                if (payload.status === 'WAITING_OPPONENT') {
                    ui.showGame();
                    ui.setBoardEnabled(false);
                    ui.updateStatus('Aguardando oponente entrar na sala...', 'default');
                } else if (payload.status === 'IN_PROGRESS') {
                    this.gameOver = false;
                    ui.hideGameOverModal();
                    ui.showGame();
                    ui.setBoardEnabled(true);
                    this.updateStatus();
                } else if (payload.status === 'FINISHED') {
                    this.gameOver = true;
                    ui.setBoardEnabled(false);
                    ui.updateStatus('Partida Encerrada', 'default');
                    
                    const isHost = this.mySymbol === 'X';
                    const hostName = payload.players['X'];
                    ui.showGameOverModal(payload.winner, payload.scores, isHost, hostName, payload.players, this.mySymbol);
                }
                break;

            case 'OPPONENT_LEFT':
                ui.hideGameOverModal(); // Força o modal a fechar para retirar o blur da tela
                ui.setBoardEnabled(false);
                ui.hideGameToast();
                
                let timeLeft = 15;
                ui.updateStatus(`Oponente desconectou. Retornando ao início em ${timeLeft}s...`, 'error');
                
                // Mostrar também no novo Toast flutuante gigante por cima de tudo
                ui.showGameToast(`Oponente desconectou. Sala será encerrada.`, 'error');
                
                const interval = setInterval(() => {
                    timeLeft--;
                    if (timeLeft > 0) {
                        ui.updateStatus(`Oponente desconectou. Retornando ao início em ${timeLeft}s...`, 'error');
                    } else {
                        clearInterval(interval);
                        location.reload();
                    }
                }, 1000);
                break;

            case 'CHAT_EVENT':
                ui.addChatMessage(payload.player_name, payload.text);
                break;

            case 'ERROR':
                if (!ui.lobby.classList.contains('hidden')) {
                    ui.updateLobbyMessage(payload.message, 'error');
                } else {
                    ui.showGameToast(payload.message, 'error');
                }
                break;
        }
    }

    updateStatus() {
        const isMyTurn = this.currentTurn === this.mySymbol;
        const message = isMyTurn ? 'Sua vez!' : 'Vez do oponente...';
        ui.updateStatus(message, isMyTurn ? 'success' : 'default');
        ui.highlightTurn(isMyTurn);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});
