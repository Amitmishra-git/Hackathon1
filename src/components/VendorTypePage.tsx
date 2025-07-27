import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const VendorTypePage: React.FC = () => {
  const [selectedVendorType, setSelectedVendorType] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated, has selected language, and is a vendor
    const storedUserData = localStorage.getItem('userData');
    const storedLanguage = localStorage.getItem('selectedLanguage');
    const storedRole = localStorage.getItem('userRole');
    
    if (!storedUserData || !storedLanguage || storedRole !== 'vendor') {
      navigate('/login');
      return;
    }
    
    try {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      setSelectedLanguage(storedLanguage);
    } catch (error) {
      navigate('/login');
    }
  }, [navigate]);

  const handleVendorTypeSelect = (vendorType: string) => {
    setSelectedVendorType(vendorType);
  };

  const handleContinue = async () => {
    if (!selectedVendorType) {
      return;
    }

    setIsLoading(true);

    try {
      // Insert vendor data into Supabase
      const { error } = await supabase
        .from('vendors')
        .insert([
          {
            name: userData.name,
            email: userData.email,
            contact_no: userData.contactNo,
            city: userData.city,
            state: userData.state,
            pin_code: userData.pinCode,
            vendor_type: selectedVendorType
          }
        ])
        .select();

      if (error) {
        console.error('Error inserting vendor data:', error);
        alert('Error saving vendor data. Please try again.');
        setIsLoading(false);
        return;
      }

      // Store vendor type preference locally
      localStorage.setItem('vendorType', selectedVendorType);

      // Show success message
      const content = getContent(selectedLanguage);
      const vendorTypeText = content.vendorTypes[selectedVendorType as keyof typeof content.vendorTypes];
      alert(`Welcome ${userData?.name}! You are registered as a ${vendorTypeText}. Data saved successfully!`);
      
      // For demo purposes, you can navigate to a main page or reset to login
      // navigate('/main');
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving vendor data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/vendor-selection');
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('selectedLanguage');
    localStorage.removeItem('userRole');
    localStorage.removeItem('vendorType');
    navigate('/login');
  };

  const getContent = (language: string) => {
    const content = {
      english: {
        title: 'What type of vendor are you?',
        subtitle: 'Please select your vendor type to continue',
        vendorTypes: {
          momo: 'Momo Vendor',
          paniPuri: 'Pani Puri Vendor',
          chaat: 'Chaat Vendor',
          juice: 'Juice Vendor',
          other: 'Other'
        },
        continue: 'Continue',
        back: 'Back',
        signOut: 'Sign out'
      },
      hindi: {
        title: 'आप किस प्रकार के विक्रेता हैं?',
        subtitle: 'कृपया जारी रखने के लिए अपना विक्रेता प्रकार चुनें',
        vendorTypes: {
          momo: 'मोमो विक्रेता (Momo Vendor)',
          paniPuri: 'पानी पूरी विक्रेता (Pani Puri Vendor)',
          chaat: 'चाट विक्रेता (Chaat Vendor)',
          juice: 'जूस विक्रेता (Juice Vendor)',
          other: 'अन्य (Other)'
        },
        continue: 'जारी रखें',
        back: 'वापस',
        signOut: 'साइन आउट'
      }
    };
    return content[language as keyof typeof content];
  };

  if (!userData || !selectedLanguage) {
    return <div>Loading...</div>;
  }

  const currentContent = getContent(selectedLanguage);

  return (
    <div className="auth-container">
      <h1 className="auth-title">{currentContent.title}</h1>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Welcome, {userData.name}!
      </p>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        {currentContent.subtitle}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {Object.entries(currentContent.vendorTypes).map(([key, value]) => (
          <button
            key={key}
            className={`language-btn ${selectedVendorType === key ? 'selected' : ''}`}
            onClick={() => handleVendorTypeSelect(key)}
            style={{ width: '100%', textAlign: 'left', padding: '1rem' }}
          >
            {value}
          </button>
        ))}
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <button
          className="language-btn"
          onClick={handleBack}
          style={{ flex: 1 }}
        >
          {currentContent.back}
        </button>
        <button
          className="submit-btn"
          onClick={handleContinue}
          disabled={!selectedVendorType || isLoading}
          style={{ flex: 1 }}
        >
          {isLoading ? 'Saving...' : currentContent.continue}
        </button>
      </div>

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
        {currentContent.signOut}
      </button>
    </div>
  );
};

export default VendorTypePage; 