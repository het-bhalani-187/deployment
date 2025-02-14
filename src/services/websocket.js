class WebSocketService {
    constructor() {
        this.ws = null;
        this.listeners = new Map();
    }

    connect() {
        this.ws = new WebSocket('ws://localhost:5000');

        this.ws.onopen = () => {
            console.log('WebSocket Connected');
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type && this.listeners.has(data.type)) {
                this.listeners.get(data.type).forEach(callback => callback(data.payload));
            }
        };

        this.ws.onclose = () => {
            console.log('WebSocket Disconnected');
            // Attempt to reconnect after 3 seconds
            setTimeout(() => this.connect(), 3000);
        };
    }

    subscribe(type, callback) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }
        this.listeners.get(type).add(callback);
    }

    unsubscribe(type, callback) {
        if (this.listeners.has(type)) {
            this.listeners.get(type).delete(callback);
        }
    }

    send(type, payload) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type, payload }));
        }
    }
}

export default new WebSocketService();
