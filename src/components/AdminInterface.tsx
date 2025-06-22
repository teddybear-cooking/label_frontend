import React, { useState } from 'react';
import { LabelingService } from '../api/api.service';
import '../styles/AdminInterface.css';

const AdminInterface: React.FC = () => {
    const [paragraphText, setParagraphText] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!paragraphText.trim()) {
            setMessage('Please enter some text before submitting.');
            return;
        }

        try {
            setIsLoading(true);
            const response = await LabelingService.submitParagraph(paragraphText);
            setMessage(`Paragraph processed successfully! Created ${response.count} sentences.`);
            setParagraphText('');
        } catch (error) {
            setMessage('Error submitting paragraph. Please try again.');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-interface">
            <header className="admin-header">
                <h1>Nomenweb</h1>
            </header>

            <div className="admin-content">
                <form onSubmit={handleSubmit} className="paragraph-form">
                    <div className="input-section">
                        <label htmlFor="paragraphInput">Enter Paragraph:</label>
                        <textarea
                            id="paragraphInput"
                            value={paragraphText}
                            onChange={(e) => setParagraphText(e.target.value)}
                            placeholder="Enter your paragraph here..."
                            rows={8}
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={isLoading || !paragraphText.trim()}
                    >
                        {isLoading ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
            </div>

            {message && (
                <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default AdminInterface; 