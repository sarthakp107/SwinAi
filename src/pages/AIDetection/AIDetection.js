import React, { useState, useEffect } from 'react';
import { pdfjs } from 'react-pdf';
import './AIDetection.css';

// Set up PDF.js worker from the installed package
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();

// Alternative method if the above doesn't work
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const AIDetection = () => {
    const [text, setText] = useState('');
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [fileError, setFileError] = useState('');

    useEffect(() => {
        // Initialize PDF.js when component mounts
        const initializePdfJs = async () => {
            try {
                await pdfjs.getDocument({ data: new Uint8Array() }).promise;
            } catch (error) {
                // Ignore the empty document error, we just want to initialize the worker
            }
        };
        
        initializePdfJs();
    }, []);

    const extractTextFromPDF = async (file) => {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
            let fullText = '';

            // Extract text from each page
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
        setIsLoading(true);

        try {
            let extractedText = '';

            if (file.type === 'application/pdf') {
                // Handle PDF files
                extractedText = await extractTextFromPDF(file);
            } else {
                // Handle text files
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
        } finally {
            setIsLoading(false);
        }
    };

    const handleDetection = async () => {
        if (!text.trim()) return;
        
        setIsLoading(true);
        try {
            // Your AI detection logic here
            setTimeout(() => {
                setResult({
                    isAI: Math.random() > 0.5,
                    confidence: Math.floor(Math.random() * 40) + 60,
                    analysis: {
                        grammar: Math.floor(Math.random() * 40) + 60,
                        naturalness: Math.floor(Math.random() * 40) + 60,
                        coherence: Math.floor(Math.random() * 40) + 60
                    }
                });
                setIsLoading(false);
            }, 1500);
        } catch (error) {
            console.error('Error:', error);
            setIsLoading(false);
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
                            <p className="header-subtitle">Check if text was written by AI or human</p>
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
                        <>
                            <div className="result-header">
                                <div className={`result-badge ${result.isAI ? 'ai' : 'human'}`}>
                                    <i className={`fas ${result.isAI ? 'fa-robot' : 'fa-user'}`}></i>
                                    {result.isAI ? 'AI Generated' : 'Human Written'}
                                </div>
                                <div className="confidence">
                                    {result.confidence}% Confidence
                                </div>
                            </div>

                            <div className="analysis-grid">
                                <div className="analysis-card">
                                    <div className="card-icon">
                                        <i className="fas fa-spell-check"></i>
                                    </div>
                                    <div className="card-content">
                                        <div className="card-title">Grammar Score</div>
                                        <div className="card-value">{result.analysis.grammar}%</div>
                                    </div>
                                </div>

                                <div className="analysis-card">
                                    <div className="card-icon">
                                        <i className="fas fa-comments"></i>
                                    </div>
                                    <div className="card-content">
                                        <div className="card-title">Naturalness</div>
                                        <div className="card-value">{result.analysis.naturalness}%</div>
                                    </div>
                                </div>

                                <div className="analysis-card">
                                    <div className="card-icon">
                                        <i className="fas fa-link"></i>
                                    </div>
                                    <div className="card-content">
                                        <div className="card-title">Coherence</div>
                                        <div className="card-value">{result.analysis.coherence}%</div>
                                    </div>
                                </div>
                            </div>
                        </>
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