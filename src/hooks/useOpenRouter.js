import { useState } from 'react';

// const OPENROUTER_API_KEY = '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';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const useOpenRouter = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const callOpenRouter = async (messages) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer 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`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'SwinAI'
                },
                body: JSON.stringify({
                    model: 'deepseek/deepseek-r1:free',
                    messages: messages,
                    temperature: 0.3,
                    max_tokens: 1000
                })
            });

            const responseData = await response.json();
            console.log('API Response:', responseData);

            if (!response.ok) {
                throw new Error(responseData.error?.message || 'API request failed');
            }

            const content = responseData.choices[0].message.content;
            if (!content) {
                throw new Error('Empty response from API');
            }

            return content;

        } catch (err) {
            console.error('API Error:', err);
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const detectAI = async (content) => {
        if (!content?.trim()) {
            setError('No content provided');
            return null;
        }

        const messages = [
            {
                role: 'system',
                content: 'You are an AI text detector. Respond only with a number between 0 and 100 representing the probability percentage that the given text was written by AI. Do not include any other text or explanation.'
            },
            {
                role: 'user',
                content: `Rate the probability (0-100) that this text was written by AI: "${content.slice(0, 1000)}"`
            }
        ];

        const result = await callOpenRouter(messages);
        console.log('Raw result:', result);

        if (!result) {
            return null;
        }

        try {
            // Try parsing as direct number first
            const directNumber = parseInt(result.trim());
            if (!isNaN(directNumber) && directNumber >= 0 && directNumber <= 100) {
                return { aiProbability: directNumber };
            }

            // Try extracting number if direct parse fails
            const numberMatch = result.match(/\d+/);
            if (numberMatch) {
                const number = parseInt(numberMatch[0]);
                if (number >= 0 && number <= 100) {
                    return { aiProbability: number };
                }
            }

            setError('Invalid response format');
            return null;
        } catch (error) {
            console.error('Error parsing result:', error);
            setError('Could not parse the detection result');
            return null;
        }
    };

    const humanizeText = async (content, style = 'casual') => {
        const messages = [
            {
                role: 'system',
                content: `You are a text humanizer expert. Convert the given text to sound more human-like and natural in a ${style} style. Maintain the original meaning but make it more conversational and authentic.`
            },
            {
                role: 'user',
                content: `Humanize this text: "${content}"`
            }
        ];

        return await callOpenRouter(messages);
    };

    const summarizeText = async (content, length = 'medium') => {
        const messages = [
            {
                role: 'system',
                content: `You are a text summarization expert. Create a ${length} length summary of the given text while maintaining the key points and important details.`
            },
            {
                role: 'user',
                content: `Summarize this text: "${content}"`
            }
        ];

        return await callOpenRouter(messages);
    };

    return {
        detectAI,
        humanizeText,
        summarizeText,
        isLoading,
        error,
        callOpenRouter // Exposed for custom implementations
    };
};

export default useOpenRouter;