import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import useOpenRouter from '../../hooks/useOpenRouter';
import './AIHumanizer.css';

const AIHumanizer = () => {
    const { user, loading } = useAuth();
    const location = useLocation();
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [copyStatus, setCopyStatus] = useState('idle');


    const { humanizeText } = useOpenRouter();

    useEffect(() => {
        // Set the text from the detection page if available
        if (location.state?.textToHumanize) {
            setInputText(location.state.textToHumanize);
        }
    }, [location]);


    const handleHumanize = async () => {
        setIsLoading(true);
        setOutputText('');
    
        const systemPrompt = `hi`;
    
        try {
            const response = await fetch("http://localhost:11500/api/generate", {  // Ollama API endpoint
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "deepseek-r1:14b",  // Make sure this matches your fine-tuned model's name
                    prompt: `${systemPrompt}\n\n${inputText}`,  // Concatenate system and user input
                    stream: true,  // Enable streaming
                    temperature: 0.7
                })
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error: ${JSON.stringify(errorData)}`);
            }
    
            // Streaming response handling
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
    
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
    
                buffer += decoder.decode(value);
    
                // Since Ollama's response format is simpler, split and process each chunk
                const lines = buffer.split('\n');
                buffer = lines.pop(); // Keep any unfinished line in buffer
    
                for (const line of lines) {
                    if (line.trim() === '') continue;
    
                    try {
                        const jsonData = JSON.parse(line);  // Parse Ollama's JSON response
                        if (jsonData.response) {
                            setOutputText(prev => prev + jsonData.response);
                        }
                    } catch (e) {
                        console.error('Error parsing stream:', e);
                    }
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setOutputText("An error occurred while humanizing the text.");
        } finally {
            setIsLoading(false);
        }
    };
    

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(outputText);
            setCopyStatus('copied');
            
            // Reset copy button ack to idle after 4 seconds
            setTimeout(() => {
                setCopyStatus('idle');
            }, 4000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    if (loading) {
        return (
            <div className="tool-loading">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="tool-container">
            <div className={`particles ${isLoading ? 'loading' : ''}`}></div>
            <div className="tool-header">
                <h1>👨‍🎓 AI Humanizer</h1>

                <p>Transform robotic AI responses into natural, human-like conversations</p>
            </div>

            <div className={`tool-content ${isLoading ? 'loading' : ''}`}>
                <div className="input-section">
                    <h2>Input Text</h2>
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Paste your AI-generated text here..."
                        rows={8}
                    />
                </div>

                <button 
                    className="action-button"
                    onClick={handleHumanize}
                    disabled={isLoading || !inputText.trim()}
                >
                    {isLoading ? (
                        <>
                            <span className="spinner"></span>
                            Humanizing...
                        </>
                    ) : (
                        <>
                            <span className="icon">🚀</span>
                            Humanize Text
                        </>
                    )}
                </button>

                <div className="output-section">
                    <h2>Humanized Output</h2>
                    <div className="output-box-container">
                        <div className="output-box">
                            {outputText || "Your humanized text will appear here"}
                        </div>
                        <button 
                            className={`copy-button ${copyStatus === 'copied' ? 'copied' : ''}`}
                            onClick={handleCopy}
                            title="Copy to clipboard"
                        >
                            {copyStatus === 'copied' ? (
                                <span>✓ Copied!</span>
                            ) : (
                                <>
                                    <svg 
                                        stroke="currentColor" 
                                        fill="none" 
                                        strokeWidth="2" 
                                        viewBox="0 0 24 24" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        height="1em" 
                                        width="1em" 
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                                    </svg>
                                    <span style={{ marginLeft: '4px' }}>Copy</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIHumanizer; 