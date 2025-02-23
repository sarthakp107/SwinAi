import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../config/Supabase';
import './TopicSelection.css';
import { useAuth } from '../../context/AuthContext';

const topics = [
    {
        id: 'ai-humanizer',
        title: 'AI Humanizer',
        description: 'Transform robotic AI responses into natural, human-like conversations. Make your AI interactions more engaging and personable.',
        icon: '👨‍🎓',
        color: '#4CAF50',
        path: '/ai-humanizer'
    },
    {
        id: 'security',
        title: 'AI Security',
        description: 'Protect your AI systems with state-of-the-art security measures. Ensure data privacy and prevent unauthorized access.',
        icon: '🛡️',
        color: '#2196F3',
        path: '/dashboard/security'
    },
    {
        id: 'automation',
        title: 'AI Automation',
        description: 'Streamline your workflows with intelligent automation. Save time and resources while maintaining quality.',
        icon: '⚡',
        color: '#FF9800',
        path: '/dashboard/automation'
    },
    {
        id: 'detector',
        title: 'AI Detector',
        description: 'Identify AI-generated content with high accuracy. Maintain authenticity in your digital communications.',
        icon: '🔍',
        color: '#9C27B0',
        path: '/ai-detector'
    }
];

const TopicSelection = () => {
    const navigate = useNavigate();
    const [selectedTopic, setSelectedTopic] = useState(null);
    const { user, loading } = useAuth();

    const handleTopicSelect = async (topic) => {
        setSelectedTopic(topic.id);
        try {
            const { error } = await supabase
                .from('user_preferences')
                .upsert({ 
                    user_id: user.id,
                    selected_topic: topic.id,
                    updated_at: new Date()
                });
            navigate(topic.path);
        } catch (error) {
            console.error('Error saving topic preference:', error);
        }
    };

    if (loading) {
        return (
            <div className="topic-loading">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="topic-selection">
            <div className="topic-header">
                <h1>Welcome, {user?.user_metadata?.full_name}! 👋</h1>
                <p>Choose a tool to get started with</p>
            </div>

            <div className="topics-grid">
                {topics.map((topic) => (
                    <div 
                        key={topic.id}
                        className={`topic-card ${selectedTopic === topic.id ? 'selected' : ''}`}
                        onClick={() => handleTopicSelect(topic)}
                        style={{'--topic-color': topic.color}}
                    >
                        <div className="topic-icon">{topic.icon}</div>
                        <h3>{topic.title}</h3>
                        <p>{topic.description}</p>
                        <div className="topic-hover-effect">
                            <span>Get Started</span>
                            <i className="fas fa-arrow-right"></i>
                        </div>
                    </div>
                ))}
            </div>

            <div className="topic-footer">
                <p>You can always switch between tools from your dashboard later</p>
            </div>
        </div>
    );
};

export default TopicSelection; 