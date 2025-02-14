class CourtroomSocket {
    constructor() {
        this.socket = null;
        this.subscribers = new Map();
        this.messageQueue = [];
        this.connecting = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 2000;
    }

    connect() {
        if (this.socket?.readyState === WebSocket.OPEN || this.connecting) {
            return Promise.resolve();
        }
        
        this.connecting = true;
        const token = localStorage.getItem('token');
        
        if (!token) {
            this.connecting = false;
            return Promise.reject(new Error('No authentication token found'));
        }

        return new Promise((resolve, reject) => {
            try {
                const wsUrl = `ws://localhost:5000/courtroom?token=${token}`;
                this.socket = new WebSocket(wsUrl);

                this.socket.onopen = () => {
                    console.log('WebSocket connected');
                    this.connecting = false;
                    this.reconnectAttempts = 0;

                    // Process any queued messages
                    while (this.messageQueue.length > 0) {
                        const data = this.messageQueue.shift();
                        this.send(data);
                    }

                    // Send initial user activity
                    this.send({
                        type: 'user_activity',
                        payload: { timestamp: Date.now() }
                    });

                    resolve();
                };

                this.socket.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        const subscribers = this.subscribers.get(data.type) || [];
                        subscribers.forEach(callback => callback(data.payload));
                    } catch (error) {
                        console.error('Error handling WebSocket message:', error);
                    }
                };

                this.socket.onclose = (event) => {
                    this.connecting = false;
                    console.log('WebSocket closed with code:', event.code);
                    
                    if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
                        console.log(`Attempting to reconnect (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
                        setTimeout(() => {
                            this.reconnectAttempts++;
                            this.connect().catch(console.error);
                        }, this.reconnectDelay);
                    }
                };

                this.socket.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    this.connecting = false;
                    if (this.socket.readyState !== WebSocket.OPEN) {
                        reject(error);
                    }
                };

            } catch (error) {
                this.connecting = false;
                console.error('Error creating WebSocket connection:', error);
                reject(error);
            }
        });
    }

    send(data) {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            // Queue the message if socket is not ready
            this.messageQueue.push(data);
            this.connect().catch(console.error);
            return;
        }

        try {
            this.socket.send(JSON.stringify(data));
        } catch (error) {
            console.error('Error sending message:', error);
            // Queue the message for retry
            this.messageQueue.push(data);
        }
    }

    subscribe(type, callback) {
        if (!this.subscribers.has(type)) {
            this.subscribers.set(type, []);
        }
        this.subscribers.get(type).push(callback);

        return () => {
            const callbacks = this.subscribers.get(type);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        };
    }

    disconnect() {
        if (this.socket) {
            this.socket.close(1000);
            this.socket = null;
        }
        this.subscribers.clear();
        this.messageQueue = [];
    }

    get readyState() {
        return this.socket ? this.socket.readyState : WebSocket.CLOSED;
    }
}

export default new CourtroomSocket();
