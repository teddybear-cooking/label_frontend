import React, { useState, useEffect } from 'react';
import { LabelingService } from '../api/api.service';
import { LabelCategory } from '../api/types';
import '../styles/LabelingInterface.css';

const LabelingInterface: React.FC = () => {
    const [currentText, setCurrentText] = useState<string>('');
    const [userInput, setUserInput] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const categories: LabelCategory[] = ['normal', 'hate_speech', 'offensive', 'religious_hate', 'political_hate'];

    useEffect(() => {
        fetchNextSentence();
    }, []);

    const fetchNextSentence = async () => {
        try {
            setIsLoading(true);
            const response = await LabelingService.getNextSentence();
            setCurrentText(response.text);
            setMessage('');
        } catch (error) {
            setMessage('Error fetching next sentence. Please try again.');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExistingLabel = async (category: LabelCategory) => {
        try {
            setIsLoading(true);
            await LabelingService.labelSentence(currentText, category);
            setMessage('Successfully labeled existing text!');
            fetchNextSentence();
        } catch (error) {
            setMessage('Error labeling text. Please try again.');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUserInputLabel = async (category: LabelCategory) => {
        if (!userInput.trim()) {
            setMessage('Please enter some text to label.');
            return;
        }

        try {
            setIsLoading(true);
            await LabelingService.labelUserInput(userInput, category);
            setMessage('Successfully labeled your input!');
            setUserInput('');
        } catch (error) {
            setMessage('Error labeling text. Please try again.');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="labeling-interface">
            <section className="user-input-section">
                <div className="section-header">
                    <p className="helper-text">
                        <span className="sub-text" style={{ fontWeight: 'bold' }}>"Collecting data for my Model"</span>
                        <br />
                        <span className="sub-text" style={{ fontWeight: 'bold' }}>I know you can give me some naughty sentences.</span>
                        <br />
                        <span className="note">The only data we'll take is your text input and the class of it 🙂</span>
                    </p>
                    <h2>Write anything and choose what you write</h2>
                </div>
                <div className="input-section">
                    <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Enter text to label..."
                        rows={4}
                    />
                </div>
                <div className="category-buttons">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleUserInputLabel(category)}
                            disabled={isLoading || !userInput.trim()}
                        >
                            {category.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </section>

            <section className="existing-text-section">
                <div className="section-header">
                    <p className="helper-text">
                        <span className="highlight">Help me label the text here</span>
                        <br />
                        <span className="thank-you">Kop Kun Kub </span>
                    </p>
                    <h2>Read and Choose</h2>
                </div>
                <div className="text-display">
                    <p>{currentText || 'Loading...'}</p>
                </div>
                <div className="category-buttons">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleExistingLabel(category)}
                            disabled={isLoading || !currentText}
                        >
                            {category.replace('_', ' ')}
                        </button>
                    ))}
                </div>
                <button 
                    className="skip-button"
                    onClick={fetchNextSentence}
                    disabled={isLoading}
                >
                    Skip Text
                </button>
            </section>

            {message && (
                <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default LabelingInterface; 