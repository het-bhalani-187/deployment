import React, { useState, useEffect } from 'react';
import { searchIPC } from '../services/ipcService';
import '../styles/PromptBar.css';

const PromptBar = () => {
    const [userInput, setUserInput] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to handle the search
    const handleSearch = async () => {
        if (!userInput.trim()) {
            setError('Please enter a search term');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await searchIPC(userInput);
            console.log("Search result: ", response);
            if (response.data && Array.isArray(response.data)) {
                setResults(response.data);
            } else {
                setError('No results found');
            }
        } catch (err) {
            setError('Error occurred while fetching data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => {
        const loadScript = () => {
          try {
            // Create and load the script
            const script = document.createElement('script');
            script.src = 'https://app.thinkstack.ai/bot/thinkstackai-loader.min.js';
            script.async = true;
            script.setAttribute('chatbot_id', '67adae0c9e89a6ec0f140953');
            script.setAttribute('data-type', 'default');
            
            // Add error handling for the script
            script.onerror = () => {
              setError('Failed to load the chatbot. Please check your internet connection and try again.');
            };

            // Add load handler
            script.onload = () => {
              // Clear any previous errors
              setError(null);
            };
            
            // Append the script to the document
            document.body.appendChild(script);

            // Cleanup function to remove the script when component unmounts
            return () => {
              document.body.removeChild(script);
              // Clean up any global variables or widgets that ThinkStack might have created
              if (window.ThinkStackAI) {
                window.ThinkStackAI.cleanup?.();
              }
            };
          } catch (err) {
            setError('An error occurred while initializing the chatbot: ' + err.message);
          }
        };

        // Add a timeout to retry loading if it fails
        const timeoutId = setTimeout(loadScript, 1000);

        return () => {
          clearTimeout(timeoutId);
        };
      }, []); // Empty dependency array means this effect runs once when component mounts

    return (
        <div className="container">
            <div className="search-section">
                <h1>IPC Section Finder</h1>
                <p>Search for an IPC Section or description below:</p>
                
                <div className="search-box">
                    <input 
                        type="text" 
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter IPC Section or description"
                    />
                    <button 
                        onClick={handleSearch} 
                        disabled={loading}
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}
            </div>

            {results.length > 0 && (
                <div className="output">
                    <h2>Results</h2>
                    {results.map((result, index) => (
                        <div key={index} className="result-item">
                            <div className="result-row">
                                <span className="label">IPC Section:</span>
                                <span className="value">{result["IPC Section"]}</span>
                            </div>
                            <div className="result-row">
                                <span className="label">Description:</span>
                                <span className="value">{result.Description}</span>
                            </div>
                            <div className="result-row">
                                <span className="label">Offence:</span>
                                <span className="value">{result.Offence}</span>
                            </div>
                            <div className="result-row">
                                <span className="label">Nature of Offence:</span>
                                <span className="value">{result["Nature of Offence"]}</span>
                            </div>
                            <div className="result-row">
                                <span className="label">Punishment:</span>
                                <span className="value">{result.Punishment}</span>
                            </div>
                            <div className="result-row">
                                <span className="label">Bailable or Not:</span>
                                <span className="value">{result["Bailable or Not"]}</span>
                            </div>
                            <div className="result-row">
                                <span className="label">Consequences:</span>
                                <span className="value">{result.Consequences}</span>
                            </div>
                            <div className="result-row">
                                <span className="label">Solutions:</span>
                                <span className="value">{result.Solutions}</span>
                            </div>
                            <div className="result-row">
                                <span className="label">Suggestions:</span>
                                <span className="value">{result.Suggestions}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <div className="promptbar-container">
              {error ? (
                <div className="error-message">
                  <p>{error}</p>
                  <button onClick={() => window.location.reload()}>Try Again</button>
                </div>
              ) : (
                <div id="thinkstack-container"></div>
              )}
            </div>
        </div>
    );
};

export default PromptBar;
