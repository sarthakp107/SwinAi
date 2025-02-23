import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AIHumanizer.css';

const AIHumanizer = () => {
    const { user, loading } = useAuth();
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    
    const handleHumanize = async () => {
        const systemPrompt = `Your task is to humanize the given text to the highest degree possible, ensuring that it mimics the writing style of real students from US and Australian universities before 2022. Your goal is to transform AI-generated content into text that flows naturally, is structured like human writing, and aligns with how students wrote their assignments before the widespread use of AI. Follow these detailed instructions:

1. Sentence Structure & Flow
- Rewrite sentences to reflect natural human phrasing, cadence, and rhythm.
- Vary sentence length and complexity—mix short, direct sentences with longer, nuanced ones.
- Avoid robotic or overly structured sentence patterns; incorporate subtle sentence fragments or conversational transitions when natural.

2. Word Choice & Synonyms
- Replace uncommon AI-preferred words with those a student would naturally use.
- Maintain discipline-specific terminology when relevant, but avoid excessive formality or jargon.
- Use contractions where appropriate (e.g., "it's" instead of "it is") to reflect casual human tendencies.

3. Tone & Style Variation
- Reflect how students naturally write—a blend of formal, semi-formal, and informal tones, depending on context.
- Use occasional first-person reflections ("I believe," "From my perspective") when appropriate, to add authenticity.
- Adjust complexity based on subject matter; students in humanities often write fluid, expressive prose, while STEM students favor precise, direct explanations.

4. Logical Transitions & Coherence
- Ensure smooth, natural transitions between sentences and paragraphs using human-like connectors:
  AI-like: "This leads to the conclusion that…"
  Human-like: "Given this, it makes sense that…"
- Use implicit connections rather than rigidly structured explanations.

5. Formatting & Structural Adjustments
- Structure text the way real students organize their work:
  Introduction: Engaging, thesis-driven but subtly introduced.
  Body Paragraphs: Topic sentences that flow naturally into evidence and explanation rather than rigidly stating them.
  Conclusion: Summarizes key points while offering slight reflection instead of a mechanical rewording.

6. Common Human Mistakes & Imperfections
- Introduce occasional, natural minor imperfections that real students make:
  A slight redundancy in phrasing to mimic human thought processes.
  A sentence starting with 'And' or 'But' where appropriate.
  A mild grammatical quirk (e.g., ending a sentence with a preposition occasionally).

7. AI Detection Avoidance
- DeepSeek should analyze real pre-2022 university essays to replicate their tone, style, and sentence structuring.
- Avoid patterns common in AI writing, such as:
  Overuse of transition phrases like "Moreover," "Furthermore" (instead, mix in: "On top of that," "Not to mention," etc.).
  Predictable structure with each paragraph mechanically formatted the same way.
- Use semantic diversity—vary phrasing across similar concepts instead of repeating patterns.

8. Final Output Expectation
- The transformed text should:
  Read entirely human-written, as if a student from a US or Australian university wrote it before 2022.
  Be highly natural, nuanced, and readable.
  Bypass all AI detection systems by mimicking pre-AI student writing styles.

Now, process the following text using these rules and return a fully humanized version:`;

        setIsLoading(true);
        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer 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",
                    "HTTP-Referer": window.location.origin,
                    "X-Title": "AI Humanizer",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "deepseek/deepseek-r1:free",
                    messages: [
                        {
                            "role": "system",
                            "content": systemPrompt
                        },
                        {
                            "role": "user",
                            "content": inputText
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error: ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            if (data.choices && data.choices[0] && data.choices[0].message) {
                setOutputText(data.choices[0].message.content);
            } else {
                throw new Error('Unexpected API response structure');
            }
        } catch (error) {
            console.error('Detailed Error:', error);
            setOutputText(`An error occurred: ${error.message}`);
        } finally {
            setIsLoading(false);
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
            <div className="tool-header">
                <h1>👨‍🎓 AI Humanizer</h1>
                <p>Bypass AI detection systems by humanizing your text</p>
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