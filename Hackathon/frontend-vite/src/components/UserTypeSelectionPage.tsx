import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserTypeSelectionPage: React.FC = () => {
  const [selectedUserType, setSelectedUserType] = useState<'vendor' | 'supplier' | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated and has selected language
    const storedUserData = localStorage.getItem('userData');
    const selectedLanguage = localStorage.getItem('selectedLanguage');
    
    if (!storedUserData || !selectedLanguage) {
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

  const handleUserTypeSelect = (userType: 'vendor' | 'supplier') => {
    setSelectedUserType(userType);
  };

  const handleContinue = () => {
    if (!selectedUserType) {
      return;
    }

    setIsLoading(true);

    // Store user type preference
    localStorage.setItem('userType', selectedUserType);

    // Update userData with user type
    const updatedUserData = {
      ...userData,
      userType: selectedUserType
    };
    localStorage.setItem('userData', JSON.stringify(updatedUserData));

    // Simulate processing delay
    setTimeout(() => {
      setIsLoading(false);
      
      // Navigate based on user type
      if (selectedUserType === 'vendor') {
        navigate('/vendor-selection');
      } else {
        navigate('/supplier-registration');
      }
    }, 1000);
  };

  const handleBack = () => {
    navigate('/language-selection');
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="auth-container">
      <h1 className="auth-title">What describes you best?</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Choose your role to get personalized recommendations
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        <div
          className={`user-type-card ${selectedUserType === 'vendor' ? 'selected' : ''}`}
          onClick={() => handleUserTypeSelect('vendor')}
          style={{
            border: selectedUserType === 'vendor' ? '2px solid #667eea' : '1px solid #e1e5e9',
            borderRadius: '12px',
            padding: '1.5rem',
            cursor: 'pointer',
            background: selectedUserType === 'vendor' ? '#f8f9ff' : 'white',
            transition: 'all 0.3s ease'
          }}
        >
          <h3 style={{ 
            margin: '0 0 0.5rem 0', 
            color: selectedUserType === 'vendor' ? '#667eea' : '#333',
            fontSize: '1.2rem',
            fontWeight: '600'
          }}>
            🏪 I'm a Vendor
          </h3>
          <p style={{ 
            margin: '0', 
            color: '#666', 
            fontSize: '0.9rem',
            lineHeight: '1.4'
          }}>
            I run a food business and need to find reliable suppliers for my ingredients and products
          </p>
        </div>

        <div
          className={`user-type-card ${selectedUserType === 'supplier' ? 'selected' : ''}`}
          onClick={() => handleUserTypeSelect('supplier')}
          style={{
            border: selectedUserType === 'supplier' ? '2px solid #667eea' : '1px solid #e1e5e9',
            borderRadius: '12px',
            padding: '1.5rem',
            cursor: 'pointer',
            background: selectedUserType === 'supplier' ? '#f8f9ff' : 'white',
            transition: 'all 0.3s ease'
          }}
        >
          <h3 style={{ 
            margin: '0 0 0.5rem 0', 
            color: selectedUserType === 'supplier' ? '#667eea' : '#333',
            fontSize: '1.2rem',
            fontWeight: '600'
          }}>
            🚚 I'm a Supplier
          </h3>
          <p style={{ 
            margin: '0', 
            color: '#666', 
            fontSize: '0.9rem',
            lineHeight: '1.4'
          }}>
            I supply food products, ingredients, or raw materials to businesses and want to connect with potential vendors
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={handleBack}
          style={{
            flex: '1',
            padding: '12px 24px',
            border: '1px solid #e1e5e9',
            borderRadius: '8px',
            background: 'white',
            color: '#666',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Back
        </button>
        
        <button
          className="submit-btn"
          onClick={handleContinue}
          disabled={!selectedUserType || isLoading}
          style={{ flex: '2' }}
        >
          {isLoading ? 'Processing...' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default UserTypeSelectionPage;