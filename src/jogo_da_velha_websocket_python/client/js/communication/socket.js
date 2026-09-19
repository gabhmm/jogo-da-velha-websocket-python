
class SocketClient {
    constructor() {
        this.socket = null;
        this.onMessageCallback = null;
    }

    connect() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        const url = `${protocol}//${host}`;

        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
            console.log('[Socket] Conectado ao servidor.');
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (this.onMessageCallback) {
                this.onMessageCallback(data);
            }
        };

        this.socket.onclose = () => {
            console.log('[Socket] Conexão encerrada.');
        };

        this.socket.onerror = (error) => {
            console.error('[Socket] Erro na conexão:', error);
        };
    }

    send(type, payload = {}) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ type, payload }));
        }
    }

    onMessage(callback) {
        this.onMessageCallback = callback;
    }
}

const socket = new SocketClient();
socket.connect();
