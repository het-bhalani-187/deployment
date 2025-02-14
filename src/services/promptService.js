import axios from 'axios';

class PromptService {
    constructor() {
        // Create axios instance with default config
        this.api = axios.create({
            baseURL: 'http://localhost:5000',  // Updated to match backend port
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 30000 // 30 second timeout
        });

        // Add request interceptor for debugging
        this.api.interceptors.request.use(request => {
            console.log('Request:', request);
            return request;
        });

        // Add response interceptor for debugging
        this.api.interceptors.response.use(
            response => {
                console.log('Response:', response);
                return response;
            },
            error => {
                console.error('Response Error:', error);
                return Promise.reject(error);
            }
        );
    }

    async getConversations() {
        try {
            const conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
            return conversations;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async createConversation(title) {
        try {
            const conversation = {
                id: Date.now().toString(),
                title: title || 'New Conversation',
                createdAt: new Date().toISOString()
            };

            const conversations = await this.getConversations();
            conversations.unshift(conversation);
            localStorage.setItem('conversations', JSON.stringify(conversations));

            return conversation;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async deleteConversation(conversationId) {
        try {
            const conversations = await this.getConversations();
            const updatedConversations = conversations.filter(c => c.id !== conversationId);
            localStorage.setItem('conversations', JSON.stringify(updatedConversations));
            localStorage.removeItem(`messages_${conversationId}`);
            return { success: true };
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getConversationMessages(conversationId) {
        try {
            const messages = JSON.parse(localStorage.getItem(`messages_${conversationId}`) || '[]');
            return messages;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async sendMessage(conversationId, message) {
        try {
            // Store user message
            const messages = JSON.parse(localStorage.getItem(`messages_${conversationId}`) || '[]');
            const userMessage = {
                id: Date.now().toString(),
                content: message,
                sender: 'user',
                timestamp: new Date().toISOString()
            };

            // Add user message immediately for better UX
            messages.push(userMessage);
            localStorage.setItem(`messages_${conversationId}`, JSON.stringify(messages));

            // Send message to backend proxy
            console.log('Sending message to backend:', message);
            const response = await this.api.post('/api/chat', {
                message: message
            });
            console.log('Received response from backend:', response.data);

            // Create AI message from response
            const aiMessage = {
                id: (Date.now() + 1).toString(),
                content: response.data.response || response.data.message || 'No response from AI',
                sender: 'ai',
                timestamp: new Date().toISOString()
            };

            // Add AI message
            messages.push(aiMessage);
            localStorage.setItem(`messages_${conversationId}`, JSON.stringify(messages));

            return aiMessage;
        } catch (error) {
            console.error('API Error:', error);
            // Log detailed error information
            if (error.response) {
                console.error('Error response:', {
                    data: error.response.data,
                    status: error.response.status,
                    headers: error.response.headers
                });
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up request:', error.message);
            }
            throw this.handleError(error);
        }
    }

    async provideFeedback(messageId, feedback) {
        try {
            // Store feedback locally
            const allConversations = await this.getConversations();
            for (const conv of allConversations) {
                const messages = JSON.parse(localStorage.getItem(`messages_${conv.id}`) || '[]');
                const updated = messages.map(msg => 
                    msg.id === messageId ? { ...msg, feedback } : msg
                );
                localStorage.setItem(`messages_${conv.id}`, JSON.stringify(updated));
            }
            return { success: true };
        } catch (error) {
            throw this.handleError(error);
        }
    }

    handleError(error) {
        console.error('PromptService Error:', error);
        if (error.response?.data?.error) {
            return new Error(error.response.data.error);
        }
        if (error.message === 'Network Error') {
            return new Error('Unable to connect to the server. Please check if the backend server is running.');
        }
        return new Error(error.message || 'An error occurred while processing your request');
    }
}

export default new PromptService();
