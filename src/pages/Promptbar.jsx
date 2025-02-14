import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiSearch, FiThumbsUp, FiThumbsDown, FiUser, FiCpu, FiPlus, FiMessageSquare, FiTrash2, FiMenu } from 'react-icons/fi';
import { toast } from 'react-toastify';
import promptService from '../services/promptService';
import '../styles/PromptBar.css';
import BubbleChat from './BubbleChat';

const Promptbar = () => {
    const [question, setQuestion] = useState('');
    const [conversations, setConversations] = useState([]); 
    const [currentConversation, setCurrentConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const chatBoxRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        loadConversations();
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (currentConversation) {
            loadConversationMessages(currentConversation.id);
        }
    }, [currentConversation]);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        // Initialize ThinkStack widget when component mounts
        const initializeWidget = () => {
            if (window.ThinkStackAI) {
                window.ThinkStackAI.init({
                    chatbot_id: '67a896a7973d850ac6f70fc6',
                    container_id: 'thinkstack-container',
                    position: 'center',
                    width: '100%',
                    height: '600px'
                });
            } else {
                // If widget isn't loaded yet, try again in 1 second
                setTimeout(initializeWidget, 1000);
            }
        };

        initializeWidget();

        // Cleanup function
        return () => {
            if (window.ThinkStackAI && window.ThinkStackAI.destroy) {
                window.ThinkStackAI.destroy();
            }
        };
    }, []);

    const loadConversations = async () => {
        try {
            const data = await promptService.getConversations();
            setConversations(data);
            if (data.length > 0 && !currentConversation) {
                setCurrentConversation(data[0]);
            }
        } catch (error) {
            console.error('Error loading conversations:', error);
            toast.error('Failed to load conversations');
        }
    };

    const loadConversationMessages = async (conversationId) => {
        try {
            setLoading(true);
            const data = await promptService.getConversationMessages(conversationId);
            setMessages(data);
        } catch (error) {
            console.error('Error loading conversation messages:', error);
            toast.error('Failed to load conversation messages');
        } finally {
            setLoading(false);
        }
    };

    const createNewConversation = async () => {
        try {
            const newConversation = await promptService.createConversation('New Chat');
            setConversations(prev => [newConversation, ...prev]);
            setCurrentConversation(newConversation);
            setMessages([]);
        } catch (error) {
            console.error('Error creating conversation:', error);
            toast.error('Failed to create new conversation');
        }
    };

    const deleteConversation = async (e, conversationId) => {
        e.stopPropagation();
        try {
            await promptService.deleteConversation(conversationId);
            setConversations(prev => prev.filter(conv => conv.id !== conversationId));
            if (currentConversation?.id === conversationId) {
                const nextConversation = conversations.find(conv => conv.id !== conversationId);
                setCurrentConversation(nextConversation || null);
                setMessages([]);
            }
        } catch (error) {
            console.error('Error deleting conversation:', error);
            toast.error('Failed to delete conversation');
        }
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();
        if (!question.trim()) {
            toast.error('Please enter a question');
            return;
        }

        try {
            setLoading(true);
            const currentQuestion = question;
            setQuestion('');

            let activeConversation = currentConversation;
            if (!activeConversation) {
                activeConversation = await createNewConversation();
            }

            const response = await promptService.sendMessage(activeConversation.id, currentQuestion);
            setMessages(prev => [...prev, response]);

        } catch (error) {
            console.error('Error submitting question:', error);
            toast.error('Failed to submit question');
            setQuestion(question); // Restore the question if there was an error
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };

    const handleFeedback = async (messageId, type) => {
        try {
            setLoading(true);
            await promptService.provideFeedback(messageId, type);
            
            setMessages(prevMessages => 
                prevMessages.map(msg => 
                    msg.id === messageId 
                        ? { ...msg, feedback: type }
                        : msg
                )
            );
            
            toast.success('Thank you for your feedback!');
        } catch (error) {
            console.error('Error providing feedback:', error);
            toast.error('Failed to submit feedback');
        } finally {
            setLoading(false);
        }
    };

    const filteredConversations = conversations.filter(conv =>
        conv.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="chat-interface">
            
            <div className={`chat-sidebar ${isSidebarOpen || !isMobile ? '' : 'closed'}`}>
                <div className="sidebar-header">
                    <button className="new-chat-btn" onClick={createNewConversation}>
                        <FiPlus /> New Chat
                    </button>
                    <div className="search-container">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="conversations-list">
                    {filteredConversations.map((conv) => (
                        <div
                            key={conv.id}
                            className={`conversation-item ${currentConversation?.id === conv.id ? 'active' : ''}`}
                            onClick={() => setCurrentConversation(conv)}
                        >
                            <FiMessageSquare className="conversation-icon" />
                            <span className="conversation-title">{conv.title}</span>
                            <button
                                className="delete-conversation"
                                onClick={(e) => deleteConversation(e, conv.id)}
                            >
                                <FiTrash2 />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="chat-container">
                {isMobile && (
                    <button
                        className="sidebar-toggle"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <FiMenu />
                    </button>
                )}

                <div className="chat-header">
                    <h2>Legal Assistant</h2>
                </div>

                <div className="chat-messages" ref={chatBoxRef}>
                    {messages.length === 0 ? (
                        <div className="welcome-message">
                            <FiCpu className="ai-icon" />
                            <h3>Welcome to Legal Assistant</h3>
                            <p>Ask any legal question to get started</p>
                        </div>
                    ) : (
                        messages.map((message) => (
                            <div
                                key={message.id}
                                className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
                            >
                                <div className="message-header">
                                    {message.sender === 'user' ? (
                                        <FiUser className="user-icon" />
                                    ) : (
                                        <FiCpu className="ai-icon" />
                                    )}
                                </div>
                                <div className="message-content">
                                    <p>{message.content}</p>
                                </div>
                                {message.sender === 'ai' && !message.feedback && (
                                    <div className="message-feedback">
                                        <button onClick={() => handleFeedback(message.id, 'helpful')}>
                                            <FiThumbsUp />
                                        </button>
                                        <button onClick={() => handleFeedback(message.id, 'unhelpful')}>
                                            <FiThumbsDown />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                    {loading && (
                        <div className="loading-indicator">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    )}
                </div>

                <form className="chat-input" onSubmit={handleSubmit}>
                    <textarea
                        ref={textareaRef}
                        value={question}
                        onChange={(e) => {
                            setQuestion(e.target.value);
                            adjustTextareaHeight();
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your legal question here..."
                        rows={1}
                    />
                    <button type="submit" disabled={loading || !question.trim()}>
                        <FiSend />
                    </button>
                </form>
                <div id="thinkstack-container" className="thinkstack-chat-container"></div>
                <BubbleChat/>
            </div>
        </div>
    );
};

export default Promptbar;
