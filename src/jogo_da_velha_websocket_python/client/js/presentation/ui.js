
class UI {
    constructor() {
        this.lobby = document.getElementById('lobby');
        this.gameScreen = document.getElementById('gameScreen');
        this.board = document.getElementById('board');
        this.status = document.getElementById('status');
        this.gameToast = document.getElementById('gameToast');
        this.lobbyMessage = document.getElementById('lobbyMessage');
        this.playerSymbol = document.getElementById('playerSymbol');
        this.roomCode = document.getElementById('roomCode');
        this.playerXName = document.getElementById('playerXName');
        this.playerOName = document.getElementById('playerOName');
        this.btnRestart = document.getElementById('btnRestart');
        this.btnBackLobby = document.getElementById('btnBackLobby');
        this.cells = document.querySelectorAll('.cell');
    }

    showGame() {
        this.lobby.classList.add('hidden');
        this.gameScreen.classList.remove('hidden');
        this.hideGameToast();
        this.showBackToLobby(false);
    }

    showLobby() {
        this.lobby.classList.remove('hidden');
        this.gameScreen.classList.add('hidden');
        this.showRestartButton(false);
        this.showBackToLobby(false);
        this.hideGameToast();
        this.setBoardEnabled(true);
    }

    setRoomInfo(roomId, symbol) {
        this.roomCode.innerText = `Sala: #${roomId}`;
        this.playerSymbol.innerText = `Símbolo: ${symbol}`;
    }

    setPlayers(players) {
        this.playerXName.innerText = `X: ${players['X'] || 'Aguardando...'}`;
        this.playerOName.innerText = `O: ${players['O'] || 'Aguardando...'}`;
    }

    updateStatus(message, variant = 'default') {
        this.status.innerText = message;
        const variants = {
            default: 'bg-gray-700 text-purple-400',
            error: 'bg-red-900 text-red-200',
            success: 'bg-indigo-900 text-indigo-200',
            warning: 'bg-fuchsia-900 text-fuchsia-200'
        };
        this.status.className = `text-center py-2 rounded-lg font-medium ${variants[variant] || variants.default}`;
    }

    updateLobbyMessage(message, variant = 'default') {
        this.lobbyMessage.innerText = message;
        const variants = {
            default: 'text-gray-500',
            error: 'text-red-400',
            success: 'text-indigo-400'
        };
        this.lobbyMessage.className = `text-center text-sm ${variants[variant] || variants.default}`;
    }

    showGameToast(message, variant = 'warning') {
        const variants = {
            info: 'bg-purple-900 text-purple-200',
            warning: 'bg-fuchsia-900 text-fuchsia-200',
            error: 'bg-red-900 text-red-200'
        };
        this.gameToast.innerText = message;
        this.gameToast.className = `text-center py-2 rounded-lg text-sm font-medium ${variants[variant] || variants.warning}`;
        this.gameToast.classList.remove('hidden');
    }

    hideGameToast() {
        this.gameToast.classList.add('hidden');
        this.gameToast.innerText = '';
    }

    showRestartButton(show) {
        this.btnRestart.classList.toggle('hidden', !show);
    }

    showBackToLobby(show) {
        this.btnBackLobby.classList.toggle('hidden', !show);
    }

    setBoardEnabled(enabled) {
        this.cells.forEach((cell) => {
            cell.style.pointerEvents = enabled ? 'auto' : 'none';
            cell.classList.toggle('opacity-50', !enabled);
        });
    }

    renderBoard(boardData) {
        this.cells.forEach((cell, index) => {
            const value = boardData[index];
            cell.innerText = value || '';
            cell.className = 'cell flex items-center justify-center h-24 bg-gray-800 rounded-lg text-5xl font-bold cursor-pointer hover:bg-gray-700 transition-colors';

            if (value === 'X') cell.classList.add('text-x');
            if (value === 'O') cell.classList.add('text-o');
        });
    }

    highlightTurn(isMyTurn) {
        if (isMyTurn) {
            this.board.classList.add('my-turn');
        } else {
            this.board.classList.remove('my-turn');
        }
    }

    showWinner(winner, boardData) {
        this.renderBoard(boardData);
        this.setBoardEnabled(false);
        this.showRestartButton(true);

        if (winner === 'draw') {
            this.updateStatus('EMPATE!', 'warning');
        } else {
            this.updateStatus(`VITÓRIA DO ${winner}!`, 'success');
        }
    }

    showWaitingOpponent(roomId) {
        this.showGame();
        this.setRoomInfo(roomId, 'X');
        this.renderBoard(Array(9).fill(null));
        this.setBoardEnabled(false);
        this.showRestartButton(false);
        this.updateStatus('Aguardando oponente entrar na sala...', 'default');
        this.updateLobbyMessage(`Sala criada! Código: ${roomId}`, 'success');
    }

    showOpponentLeft() {
        this.setBoardEnabled(false);
        this.showRestartButton(false);
        this.updateStatus('Seu oponente saiu da partida.', 'warning');
        this.showGameToast('Você pode voltar ao início e criar ou entrar em outra sala.', 'warning');
        this.showBackToLobby(true);
    }
}

const ui = new UI();
