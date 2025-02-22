import './Home1.css'; 
import FeatureCard from '../../components/FeatureCard';
import { useNavigate } from 'react-router-dom';

const Home1 = () => {
    const features = [
        {
            icon: "👨‍🎓",
            title: "AI Humanizer",
            description: "Transform robotic AI responses into natural, human-like conversations. Make your AI interactions more engaging and personable."
        },
        {
            icon: "🛡️",
            title: "AI Security",
            description: "Protect your AI systems with state-of-the-art security measures. Ensure data privacy and prevent unauthorized access."
        },
        {
            icon: "⚡",
            title: "AI Automation",
            description: "Streamline your workflows with intelligent automation. Save time and resources while maintaining quality."
        },
        {
            icon: "🔍",
            title: "AI Detector",
            description: "Identify AI-generated content with high accuracy. Maintain authenticity in your digital communications."
        }
    ];

    const navigate = useNavigate();

    return ( 
        <div className="home1-container">
            <div className="hero-section">
                <h1>Welcome to SwinAI</h1>
                <h2>Transforming the Future of AI Interaction</h2>
                <p>Your all-in-one platform for secure, human-like, and automated AI solutions</p>
                <button className="cta-button" onClick={() => navigate('/login')}>Get Started</button>
            </div>

            <div className="features-grid">
                {features.map((feature, index) => (
                    <FeatureCard
                        key={index}
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                    />
                ))}
            </div>

            <div className="why-choose-us">
                <h2>Why Choose SwinAI?</h2>
                <div className="benefits">
                    <div className="benefit">
                        <h4>✨ Advanced Technology</h4>
                        <p>Cutting-edge AI solutions powered by the latest technology</p>
                    </div>
                    <div className="benefit">
                        <h4>🔒 Secure & Reliable</h4>
                        <p>Enterprise-grade security with 99.9% uptime guarantee</p>
                    </div>
                    <div className="benefit">
                        <h4>💡 Easy Integration</h4>
                        <p>Seamless integration with your existing systems</p>
                    </div>
                </div>
            </div>

            <div className="cta-section">
                <h2>Ready to Transform Your AI Experience?</h2>
                <p>Join thousands of satisfied users who trust SwinAI</p>
                <button className="cta-button">Start Free Trial</button>
            </div>

            
        </div>
     );
}
 
export default Home1;