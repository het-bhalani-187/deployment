import React, { useState, useEffect, useRef } from 'react';
import '../styles/Courtroom.css';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { FiSend, FiThumbsUp, FiThumbsDown, FiSearch, FiFilter } from 'react-icons/fi';
import courtroomSocket from '../services/courtroomSocket';
import { toast } from 'react-toastify';
import { throttle } from 'lodash';

const API_BASE_URL = 'http://localhost:5000';

const Courtroom = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [inputQuestion, setInputQuestion] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [onlineLawyers, setOnlineLawyers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [answerInputs, setAnswerInputs] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const chatBoxRef = useRef(null);
  const observerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { user } = useAuth();

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Criminal Law', label: 'Criminal Law' },
    { value: 'Civil Law', label: 'Civil Law' },
    { value: 'Family Law', label: 'Family Law' },
    { value: 'Corporate Law', label: 'Corporate Law' },
    { value: 'Property Law', label: 'Property Law' },
    { value: 'Immigration Law', label: 'Immigration Law' }
  ];

  const authAxios = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    try {
      setLoading(true);
      courtroomSocket.send({
        type: 'new_message',
        payload: {
          content: inputMessage.trim(),
          category: selectedCategory
        }
      });
      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendQuestion = async (e) => {
    e.preventDefault();
    if (!inputQuestion.trim()) return;

    try {
      setLoading(true);
      courtroomSocket.send({
        type: 'new_question',
        payload: {
          content: inputQuestion.trim(),
          category: selectedCategory
        }
      });
      setInputQuestion('');
    } catch (error) {
      console.error('Error sending question:', error);
      toast.error('Failed to send question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerQuestion = async (questionId, answer) => {
    if (!answer.trim()) return;

    try {
      courtroomSocket.send({
        type: 'answer_question',
        payload: {
          questionId,
          content: answer.trim()
        }
      });
      
      // Clear the answer input for this question
      setAnswerInputs(prev => ({
        ...prev,
        [questionId]: ''
      }));
    } catch (error) {
      console.error('Error sending answer:', error);
      toast.error('Failed to send answer. Please try again.');
    }
  };

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      courtroomSocket.send({
        type: 'user_typing',
        payload: { isTyping: true }
      });
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      courtroomSocket.send({
        type: 'user_typing',
        payload: { isTyping: false }
      });
    }, 1000);
  };

  const handleKeyPress = (e, type = 'message') => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (type === 'message') {
        handleSendMessage(e);
      } else {
        handleSendQuestion(e);
      }
    }
  };

  const formatMessageTime = (timestamp) => {
    const messageDate = new Date(timestamp);
    const now = new Date();
    
    if (messageDate.toDateString() === now.toDateString()) {
      return format(messageDate, 'h:mm a');
    } else if (messageDate.getFullYear() === now.getFullYear()) {
      return format(messageDate, 'MMM d, h:mm a');
    }
    return format(messageDate, 'MMM d, yyyy, h:mm a');
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      const date = new Date(message.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    courtroomSocket.connect();

    const unsubscribeInitialMessages = courtroomSocket.subscribe('initial_messages', ({ messages, hasMore }) => {
      setMessages(messages);
      setHasMore(hasMore);
      setLoading(false);
    });

    const unsubscribeNewMessage = courtroomSocket.subscribe('new_message', (message) => {
      setMessages(prevMessages => [message, ...prevMessages]);
    });

    const unsubscribeOnlineStatus = courtroomSocket.subscribe('online_status', ({ users, lawyers }) => {
      setOnlineLawyers(lawyers || []);
      setOnlineUsers(users || []);
    });

    const unsubscribeTypingStatus = courtroomSocket.subscribe('typing_status', ({ users }) => {
      setTypingUsers(users || []);
    });

    const unsubscribeError = courtroomSocket.subscribe('error', (error) => {
      toast.error(error.message || 'An error occurred');
    });

    courtroomSocket.send({
      type: 'user_activity',
      payload: { timestamp: Date.now() }
    });

    return () => {
      unsubscribeInitialMessages();
      unsubscribeNewMessage();
      unsubscribeOnlineStatus();
      unsubscribeTypingStatus();
      unsubscribeError();
      courtroomSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0
    };

    observerRef.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !loading) {
        setPage(prev => prev + 1);
      }
    }, options);

    const firstMessage = document.querySelector('.message:first-child');
    if (firstMessage && observerRef.current) {
      observerRef.current.observe(firstMessage);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading]);

  useEffect(() => {
    if (page > 1) {
      loadMoreMessages();
    }
  }, [page]);

  const loadMoreMessages = async () => {
    try {
      courtroomSocket.send({
        type: 'fetch_messages',
        payload: {
          page,
          category: selectedCategory,
          search: searchQuery,
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString()
        }
      });
    } catch (error) {
      console.error('Error loading more messages:', error);
      toast.error('Failed to load more messages');
    }
  };

  useEffect(() => {
    if (startDate || endDate) {
      setPage(1);
      setMessages([]);
      loadMoreMessages();
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      setPage(1);
      courtroomSocket.send('fetch_messages', {
        page: 1,
        category: selectedCategory,
        search: searchQuery,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString()
      });
    }
  }, [user, selectedCategory, searchQuery]);

  const handleScroll = () => {
    if (
      chatBoxRef.current &&
      chatBoxRef.current.scrollHeight - chatBoxRef.current.scrollTop === chatBoxRef.current.clientHeight &&
      hasMore && !loading
    ) {
      setLoading(true);
      const nextPage = page + 1;
      setPage(nextPage);
      courtroomSocket.send('fetch_messages', {
        page: nextPage,
        category: selectedCategory,
        search: searchQuery,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString()
      });
    }
  };

  useEffect(() => {
    const chatBox = chatBoxRef.current;
    if (chatBox) {
      chatBox.addEventListener('scroll', handleScroll);
      return () => chatBox.removeEventListener('scroll', handleScroll);
    }
  }, [hasMore, loading]);

  const handleAnswerMessage = async (messageId, answer) => {
    try {
      courtroomSocket.send('message_answer', {
        messageId,
        answer: {
          content: answer
        }
      });
    } catch (error) {
      console.error('Error answering message:', error);
    }
  };

  const handleRateAnswer = async (messageId, answerId, isHelpful) => {
    try {
      if (user.role !== 'civilian') {
        toast.error('Only civilians can rate answers');
        return;
      }

      courtroomSocket.send('message_rating', {
        messageId,
        answerId,
        rating: isHelpful ? 1 : -1
      });
    } catch (error) {
      console.error('Error rating answer:', error);
    }
  };

  const getAnswerRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    return ratings.reduce((sum, r) => sum + r.rating, 0);
  };

  const getUserRating = (ratings, userId) => {
    const userRating = ratings?.find(r => r.ratedBy?._id === userId);
    return userRating ? userRating.rating : null;
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase() || '?';
  };

  return (
    <div className="courtroom-container">
      <div className="sidebar">
        <div className="filters">
          <div className="category-filter">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          
          <div className="date-filter">
            <input
              type="date"
              value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
              className="date-input"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
              className="date-input"
              placeholder="End Date"
            />
          </div>
          
          <div className="search-box">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="search-input"
            />
            <FiSearch className="search-icon" />
          </div>
        </div>

        <div className="online-users">
          <h3>Online Lawyers ({onlineLawyers.length})</h3>
          <ul>
            {onlineLawyers.map(lawyer => (
              <li key={lawyer._id} className="online-user">
                <div className="user-avatar">
                  {lawyer.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <span className="user-name">{lawyer.name}</span>
                  <span className="user-role">{lawyer.specialization}</span>
                </div>
                <span className="user-status online"></span>
              </li>
            ))}
          </ul>

          <h3>Online Users ({onlineUsers.length})</h3>
          <ul>
            {onlineUsers.map(user => (
              <li key={user._id} className="online-user">
                <div className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <span className="user-name">{user.name}</span>
                </div>
                <span className="user-status online"></span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="chat-container">
        <div className="chat-messages" ref={chatBoxRef}>
          {loading && page === 1 && (
            <div className="loading-spinner">Loading...</div>
          )}
          
          {typingUsers.length > 0 && (
            <div className="typing-indicator">
              {typingUsers.length === 1 ? (
                <span>{typingUsers[0].name} is typing...</span>
              ) : typingUsers.length === 2 ? (
                <span>{typingUsers[0].name} and {typingUsers[1].name} are typing...</span>
              ) : (
                <span>Several people are typing...</span>
              )}
              <div className="typing-animation">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}
          
          {Object.entries(groupMessagesByDate(messages)).map(([date, dateMessages]) => (
            <div key={date} className="message-group">
              <div className="date-divider">
                <span>{format(new Date(date), 'MMMM d, yyyy')}</span>
              </div>
              
              {dateMessages.map((message) => (
                <div key={message._id} className={`message ${message.type === 'question' ? 'question' : ''} ${message.sender._id === user._id ? 'own-message' : ''}`}>
                  <div className="message-header">
                    <div className="user-avatar">
                      {message.sender.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="message-info">
                      <span className="sender-name">{message.sender.name}</span>
                      {message.sender.specialization && (
                        <span className="sender-role">{message.sender.specialization}</span>
                      )}
                      <span className="message-time">
                        {formatMessageTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                  <div className="message-content">{message.content}</div>
                  
                  {message.type === 'question' && user.role === 'lawyer' && (
                    <div className="answer-section">
                      <input
                        type="text"
                        value={answerInputs[message._id] || ''}
                        onChange={(e) => setAnswerInputs(prev => ({
                          ...prev,
                          [message._id]: e.target.value
                        }))}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAnswerQuestion(message._id, answerInputs[message._id]);
                          }
                        }}
                        placeholder="Type your answer..."
                        className="answer-input"
                      />
                      <button
                        onClick={() => handleAnswerQuestion(message._id, answerInputs[message._id])}
                        className="answer-button"
                        disabled={!answerInputs[message._id]?.trim()}
                      >
                        Answer
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
          
          {loading && page > 1 && (
            <div className="loading-more">Loading more messages...</div>
          )}
        </div>

        <div className="input-container">
          <div className="message-input-container">
            <textarea
              value={inputMessage}
              onChange={(e) => {
                setInputMessage(e.target.value);
                handleTyping();
              }}
              onKeyPress={(e) => handleKeyPress(e, 'message')}
              placeholder="Type a message... (Press Enter to send, Shift + Enter for new line)"
              className="message-input"
              rows="1"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || loading}
              className="send-button"
            >
              <FiSend />
            </button>
          </div>

          <div className="question-input-container">
            <textarea
              value={inputQuestion}
              onChange={(e) => {
                setInputQuestion(e.target.value);
                handleTyping();
              }}
              onKeyPress={(e) => handleKeyPress(e, 'question')}
              placeholder="Ask a question... (Press Enter to send, Shift + Enter for new line)"
              className="question-input"
              rows="1"
            />
            <button
              onClick={handleSendQuestion}
              disabled={!inputQuestion.trim() || loading}
              className="ask-button"
            >
              Ask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courtroom;
