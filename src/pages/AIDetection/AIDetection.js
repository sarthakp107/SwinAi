import React, { useState, useEffect } from 'react';
import * as pdfjs from 'pdfjs-dist';
import useOpenRouter from '../../hooks/useOpenRouter';
import './AIDetection.css';
import { Link, useNavigate } from 'react-router-dom';

// Configure PDF.js worker
const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const AIDetection = () => {
    const [text, setText] = useState('');
    const [result, setResult] = useState(null);
    const [file, setFile] = useState(null);
    const [fileError, setFileError] = useState('');
    const { detectAI, isLoading, error } = useOpenRouter();

    const extractTextFromPDF = async (file) => {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
            let fullText = '';

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + '\n';
            }

            return fullText;
        } catch (error) {
            console.error('Error extracting PDF text:', error);
            throw new Error('Could not read PDF file');
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        setFileError('');

        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            setFileError('File too large. Please upload a file smaller than 10MB.');
            return;
        }

        setFile(file);

        try {
            let extractedText = '';

            if (file.type === 'application/pdf') {
                extractedText = await extractTextFromPDF(file);
            } else {
                const reader = new FileReader();
                extractedText = await new Promise((resolve, reject) => {
                    reader.onload = (e) => resolve(e.target.result);
                    reader.onerror = (e) => reject(e);
                    reader.readAsText(file);
                });
            }

            setText(extractedText.trim());
        } catch (error) {
            console.error('Error reading file:', error);
            setFileError('Error reading file content. Please try another file.');
            setText('');
        }
    };

    const handleDetection = async () => {
        if (!text.trim()) return;
        
        try {
            const analysis = await detectAI(text);
            if (analysis) {
                setResult(analysis);
            } else {
                setFileError('Could not analyze text. Please try again.');
            }
        } catch (error) {
            console.error('Error during analysis:', error);
            setFileError('Error analyzing text');
        }
    };

    return (
        <div className="detection-container">
            <div className="detection-grid">
                <div className="input-section">
                    <div className="section-header">
                        <div className="header-icon">
                            <i className="fas fa-robot"></i>
                        </div>
                        <div>
                            <h1 className="header-title">AI Text Detection</h1>
                            <p className="header-subtitle">Check if text was written by AI</p>
                        </div>
                    </div>

                    <div className="file-upload-container">
                        <label className="file-upload-label">
                            <input
                                type="file"
                                accept=".txt,.pdf"
                                onChange={handleFileChange}
                                className="file-input"
                            />
                            <i className="fas fa-cloud-upload-alt"></i>
                            <span>{file ? file.name : 'Upload your document (PDF or TXT)'}</span>
                        </label>
                        {fileError && <div className="file-error">{fileError}</div>}
                    </div>

                    <div className="text-input-container">
                        <textarea
                            className="text-input"
                            placeholder="Paste your text here or upload a file (minimum 100 characters)..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows={10}
                        />
                        <div className="char-count">
                            {text.length} characters
                        </div>
                    </div>

                    <button 
                        className={`analyze-button ${isLoading ? 'loading' : ''}`}
                        onClick={handleDetection}
                        disabled={text.length < 100 || isLoading}
                    >
                        {isLoading ? (
                            <>
                                <div className="spinner"></div>
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-search"></i>
                                Analyze Text
                            </>
                        )}
                    </button>
                </div>

                <div className="result-section">
                    {result ? (
                        <div className="result-content">
                            <div className="percentage-display">
                                <div className="percentage-circle" style={{
                                    background: `conic-gradient(#ff0000 ${result.aiProbability}%, #f8f9fa ${result.aiProbability}% 100%)`
                                }}>
                                    <div className="percentage-inner">
                                        <span className="percentage-value">{result.aiProbability}%</span>
                                        {/* <span className="percentage-label">AI Probability</span> */}
                                    </div>
                                </div>
                            </div>
                            <div className="action-buttons">
                                <Link 
                                    to="/ai-humanizer" 
                                    className="humanize-button"
                                    state={{ textToHumanize: text }}
                                >
                                    <i className="fas fa-magic"></i>
                                    Humanize Text
                                </Link>
                                <button 
                                    className="try-again-button"
                                    onClick={() => {
                                        setText('');
                                        setResult(null);
                                    }}
                                >
                                    <i className="fas fa-redo"></i>
                                    Try Again
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-result">
                            <div className="empty-icon">
                                <i className="fas fa-search"></i>
                            </div>
                            <h2>No Analysis Yet</h2>
                            <p>Enter your text and click analyze to detect AI-generated content</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIDetection; 