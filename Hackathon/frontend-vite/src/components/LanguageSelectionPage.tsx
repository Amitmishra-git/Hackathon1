import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LanguageSelectionPage: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated (has userData in localStorage)
    const storedUserData = localStorage.getItem('userData');
    if (!storedUserData) {
      navigate('/login');
      return;
    }
    
    try {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
    } catch (error) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
  };

  const handleContinue = () => {
    if (!selectedLanguage) {
      return;
    }

    setIsLoading(true);

    // Store language preference
    localStorage.setItem('selectedLanguage', selectedLanguage);

    // Simulate processing delay
    setTimeout(() => {
      setIsLoading(false);
      navigate('/vendor-selection');
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('selectedLanguage');
    navigate('/login');
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="auth-container">
      <h1 className="auth-title">Choose Your Language</h1>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Welcome, {userData.name}!
      </p>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Select your preferred language to continue
      </p>

      <div className="language-options">
        <button
          className={`language-btn ${selectedLanguage === 'english' ? 'selected' : ''}`}
          onClick={() => handleLanguageSelect('english')}
        >
          English
        </button>
        <button
          className={`language-btn ${selectedLanguage === 'hindi' ? 'selected' : ''}`}
          onClick={() => handleLanguageSelect('hindi')}
        >
          हिंदी (Hindi)
        </button>
      </div>

      <button
        className="submit-btn"
        onClick={handleContinue}
        disabled={!selectedLanguage || isLoading}
        style={{ marginTop: '2rem' }}
      >
        {isLoading ? 'Processing...' : 'Continue'}
      </button>

      <button
        onClick={handleLogout}
        style={{
          background: 'none',
          border: 'none',
          color: '#666',
          marginTop: '1rem',
          cursor: 'pointer',
          textDecoration: 'underline'
        }}
      >
        Sign out
      </button>
    </div>
  );
};

export default LanguageSelectionPage; 