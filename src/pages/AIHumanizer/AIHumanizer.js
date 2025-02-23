import React, { useState } from 'react';
import './AIHumanizer.css';

const AIHumanizer = () => {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleHumanize = async () => {
        setIsLoading(true);
        try {
            // TODO: Implement AI humanization logic
            setOutputText("Humanized version of your text will appear here");
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="tool-container">
            <div className="tool-header">
                <h1>👨‍🎓 AI Humanizer</h1>
                <p>Transform robotic AI responses into natural, human-like conversations</p>
            </div>

            <div className="tool-content">
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
                            <span className="icon">🔄</span>
                            Humanize Text
                        </>
                    )}
                </button>

                <div className="output-section">
                    <h2>Humanized Output</h2>
                    <div className="output-box">
                        {outputText || "Your humanized text will appear here"}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIHumanizer; 