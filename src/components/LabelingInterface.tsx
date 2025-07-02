import React, { useState, useEffect } from 'react';
import { LabelingService } from '../api/api.service';
import { LabelCategory } from '../api/types';
import '../styles/LabelingInterface.css';

const LabelingInterface: React.FC = () => {
    const [currentText, setCurrentText] = useState<string>('');
    const [userInput, setUserInput] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedUserInputCategory, setSelectedUserInputCategory] = useState<LabelCategory | null>(null);
    const [selectedExistingTextCategory, setSelectedExistingTextCategory] = useState<LabelCategory | null>(null);

    const categories: LabelCategory[] = ['normal', 'hate_speech', 'offensive', 'religious_hate', 'political_hate'];

    // Helper function to format category names for display
    const formatCategoryName = (category: string): string => {
        return category
            .replace('_', ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

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

    const handleExistingTextSubmit = async () => {
        if (!selectedExistingTextCategory) {
            setMessage('Please select a category before submitting.');
            return;
        }

        try {
            setIsLoading(true);
            await LabelingService.labelSentence(currentText, selectedExistingTextCategory);
            setMessage('Successfully labeled existing text!');
            setSelectedExistingTextCategory(null);
            fetchNextSentence();
        } catch (error) {
            setMessage('Error labeling text. Please try again.');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUserInputSubmit = async () => {
        if (!userInput.trim()) {
            setMessage('Please enter some text to label.');
            return;
        }

        if (!selectedUserInputCategory) {
            setMessage('Please select a category before submitting.');
            return;
        }

        try {
            setIsLoading(true);
            await LabelingService.labelUserInput(userInput, selectedUserInputCategory);
            setMessage('Successfully labeled your input!');
            setUserInput('');
            setSelectedUserInputCategory(null);
        } catch (error) {
            setMessage('Error labeling text. Please try again.');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUserInputCategoryChange = (category: LabelCategory) => {
        setSelectedUserInputCategory(category === selectedUserInputCategory ? null : category);
    };

    const handleExistingTextCategoryChange = (category: LabelCategory) => {
        setSelectedExistingTextCategory(category === selectedExistingTextCategory ? null : category);
    };

    return (
        <div className="labeling-interface">
            <section className="user-input-section">
                <div className="section-header">
                    <p className="helper-text">
                        <span className="sub-text" style={{ fontWeight: 'bold' }}>"I need more data 🙏"</span>
                        <span className="note">only text and label will be collected</span>
                    </p>
                    <h2>Write and choose label</h2>
                </div>
                <div className="input-section">
                    <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Enter text to label..."
                        rows={4}
                    />
                </div>
                <div className="category-checkboxes">
                    {categories.map((category) => (
                        <label key={category} className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={selectedUserInputCategory === category}
                                onChange={() => handleUserInputCategoryChange(category)}
                                disabled={isLoading}
                            />
                            <span className="checkbox-text">{formatCategoryName(category)}</span>
                        </label>
                    ))}
                </div>
                {selectedUserInputCategory && (
                    <button 
                        onClick={handleUserInputSubmit}
                        disabled={isLoading || !userInput.trim()}
                        style={{ backgroundColor: 'red', color: 'white' }}
                    >
                        {isLoading ? 'Submitting...' : 'Submit Label'}
                    </button>
                )}
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
                <div className="category-checkboxes">
                    {categories.map((category) => (
                        <label key={category} className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={selectedExistingTextCategory === category}
                                onChange={() => handleExistingTextCategoryChange(category)}
                                disabled={isLoading}
                            />
                            <span className="checkbox-text">{formatCategoryName(category)}</span>
                        </label>
                    ))}
                </div>
                {selectedExistingTextCategory && (
                    <button 
                        onClick={handleExistingTextSubmit}
                        disabled={isLoading || !currentText}
                        style={{ backgroundColor: 'red', color: 'white' }}
                    >
                        {isLoading ? 'Submitting...' : 'Submit Label'}
                    </button>
                )}
                <button 
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