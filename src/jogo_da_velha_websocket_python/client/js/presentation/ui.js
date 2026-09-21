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
        this.cells = document.querySelectorAll('.cell');

        this.chatPanel = document.getElementById('chatPanel');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');

        this.gameOverModal = document.getElementById('gameOverModal');
        this.gameOverModalContent = document.getElementById('gameOverModalContent');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalSubtitle = document.getElementById('modalSubtitle');
        this.scoreX = document.getElementById('scoreX');
        this.scoreO = document.getElementById('scoreO');
    }

    showGame() {
        this.lobby.classList.add('hidden');
        this.gameScreen.classList.remove('hidden');
        this.chatPanel.classList.remove('hidden');
        this.hideGameToast();
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
        this.status.innerHTML = message;
        const variants = {
            default: 'bg-gray-700 text-purple-400',
            error: 'bg-red-900 text-red-200',
            success: 'bg-indigo-900 text-indigo-200',
            warning: 'bg-fuchsia-900 text-fuchsia-200'
        };
        this.status.className = `text-center py-2 rounded-lg font-medium relative ${variants[variant] || variants.default}`;
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
        this.gameToast.className = `fixed top-10 left-1/2 transform -translate-x-1/2 z-[60] text-center py-3 px-6 rounded-xl text-sm font-bold shadow-2xl transition-all ${variants[variant] || variants.warning}`;
        this.gameToast.classList.remove('hidden');
        
        setTimeout(() => this.hideGameToast(), 3000);
    }

    hideGameToast() {
        this.gameToast.classList.add('hidden');
        this.gameToast.innerText = '';
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

            if (value === 'X') cell.classList.add('text-purple-400');
            if (value === 'O') cell.classList.add('text-indigo-400');
        });
    }

    highlightTurn(isMyTurn) {
        if (isMyTurn) {
            this.board.classList.add('border-purple-500');
            this.board.classList.remove('border-gray-600');
        } else {
            this.board.classList.remove('border-purple-500');
            this.board.classList.add('border-gray-600');
        }
    }

    showGameOverModal(winner, scores, isHost, hostName, players, mySymbol) {
        this.scoreX.innerText = scores['X'];
        this.scoreO.innerText = scores['O'];

        document.getElementById('scoreboardNameX').innerText = `${players['X']} (X)`;
        document.getElementById('scoreboardNameO').innerText = `${players['O'] || '?'} (O)`;

        if (winner === 'EMPATE') {
            this.modalTitle.innerText = 'EMPATE!';
            this.modalTitle.className = 'text-3xl font-extrabold text-center text-fuchsia-400 mb-2';
            this.modalSubtitle.innerText = 'Ninguém venceu dessa vez.';
        } else if (winner === mySymbol) {
            this.modalTitle.innerText = 'VITÓRIA!';
            this.modalTitle.className = 'text-3xl font-extrabold text-center text-green-400 mb-2';
            const winnerName = players[winner];
            this.modalSubtitle.innerText = `Você venceu a partida!`;
        } else {
            this.modalTitle.innerText = 'DERROTA!';
            this.modalTitle.className = 'text-3xl font-extrabold text-center text-red-500 mb-2';
            const winnerName = players[winner];
            this.modalSubtitle.innerText = `${winnerName} (${winner}) venceu a partida.`;
        }

        const btnRematch = document.getElementById('btnRematch');
        const waitingMsg = document.getElementById('waitingHostMessage');

        if (isHost) {
            btnRematch.classList.remove('hidden');
            waitingMsg.classList.add('hidden');
        } else {
            btnRematch.classList.add('hidden');
            waitingMsg.innerText = `Esperando ${hostName} recomeçar a partida...`;
            waitingMsg.classList.remove('hidden');
        }

        this.gameOverModal.classList.remove('hidden');
        // Animating entry
        setTimeout(() => {
            this.gameOverModalContent.classList.remove('scale-95', 'opacity-0');
            this.gameOverModalContent.classList.add('scale-100', 'opacity-100');
        }, 50);
    }

    hideGameOverModal() {
        this.gameOverModalContent.classList.remove('scale-100', 'opacity-100');
        this.gameOverModalContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            this.gameOverModal.classList.add('hidden');
        }, 300);
    }

    addChatMessage(playerName, text) {
        const msgDiv = document.createElement('div');
        msgDiv.innerHTML = `<span class="font-bold text-purple-400">${playerName}:</span> <span class="text-gray-300">${text}</span>`;
        this.chatMessages.appendChild(msgDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    showWaitingOpponent(roomId) {
        this.showGame();
        this.setRoomInfo(roomId, 'X');
        this.renderBoard(Array(9).fill(null));
        this.setBoardEnabled(false);
        this.updateStatus('Aguardando oponente entrar na sala...', 'default');
        this.updateLobbyMessage(`Sala criada! Código: ${roomId}`, 'success');
    }
}

const ui = new UI();
