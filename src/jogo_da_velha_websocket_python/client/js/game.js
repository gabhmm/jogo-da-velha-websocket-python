
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
        document.getElementById('btnLeave').addEventListener('click', () => location.reload());
        document.getElementById('btnRestart').addEventListener('click', () => this.requestRematch());
        document.getElementById('btnBackLobby').addEventListener('click', () => location.reload());

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
        socket.send('CREATE_ROOM', { playerName });
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

        socket.send('JOIN_ROOM', { roomId, playerName });
    }

    makeMove(position) {
        if (this.gameOver || this.currentTurn !== this.mySymbol) return;
        socket.send('MAKE_MOVE', { roomId: this.roomId, position });
    }

    requestRematch() {
        if (!this.roomId) return;
        ui.showRestartButton(false);
        ui.updateStatus('Reiniciando partida...', 'default');
        socket.send('REMATCH', { roomId: this.roomId });
    }

    handleServerMessage(data) {
        const { type, payload } = data;

        switch (type) {
            case 'ROOM_CREATED':
                this.roomId = payload.roomId;
                this.mySymbol = 'X';
                this.currentTurn = null;
                document.getElementById('inputRoomId').value = this.roomId;
                {
                    const hostName = document.getElementById('inputPlayerName').value.trim();
                    ui.showWaitingOpponent(this.roomId);
                    ui.setPlayers({ X: hostName, O: null });
                }
                break;

            case 'GAME_START':
                this.roomId = this.roomId || document.getElementById('inputRoomId').value.trim().toUpperCase();
                this.mySymbol = payload.symbol;
                this.currentTurn = payload.turn;
                this.gameOver = false;
                ui.showGame();
                ui.hideGameToast();
                ui.showBackToLobby(false);
                ui.setRoomInfo(this.roomId, this.mySymbol);
                ui.setPlayers(payload.players);
                ui.renderBoard(payload.board);
                ui.setBoardEnabled(true);
                ui.showRestartButton(false);
                this.updateStatus();
                break;

            case 'GAME_UPDATE':
                this.currentTurn = payload.turn;
                ui.renderBoard(payload.board);
                ui.setBoardEnabled(true);
                this.updateStatus();
                break;

            case 'GAME_OVER':
                this.currentTurn = null;
                this.gameOver = true;
                ui.showWinner(payload.winner, payload.board);
                break;

            case 'OPPONENT_LEFT':
                ui.showOpponentLeft();
                break;

            case 'ERROR':
                ui.updateStatus(payload.message, 'error');
                if (ui.lobby.classList.contains('hidden') === false) {
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
        ui.updateStatus(message, 'default');
        ui.highlightTurn(isMyTurn);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});
