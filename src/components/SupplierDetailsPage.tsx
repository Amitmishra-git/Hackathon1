import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const SupplierDetailsPage: React.FC = () => {
  const [supplyItem, setSupplyItem] = useState('');
  const [vendorType, setVendorType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated, has selected language, and is a supplier
    const storedUserData = localStorage.getItem('userData');
    const storedLanguage = localStorage.getItem('selectedLanguage');
    const storedRole = localStorage.getItem('userRole');
    
    if (!storedUserData || !storedLanguage || storedRole !== 'supplier') {
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

  const handleContinue = async () => {
    if (!supplyItem.trim() || !vendorType) {
      return;
    }

    setIsLoading(true);

    try {
      // Insert supplier data into Supabase
      const { error } = await supabase
        .from('suppliers')
        .insert([
          {
            name: userData.name,
            email: userData.email,
            contact_no: userData.contactNo,
            city: userData.city,
            state: userData.state,
            pin_code: userData.pinCode,
            supply_item: supplyItem.trim(),
            vendor_type: vendorType
          }
        ])
        .select();

      if (error) {
        console.error('Error inserting supplier data:', error);
        alert('Error saving supplier data. Please try again.');
        setIsLoading(false);
        return;
      }

      // Store supplier details locally
      const supplierData = {
        supplyItem: supplyItem.trim(),
        vendorType: vendorType
      };
      localStorage.setItem('supplierDetails', JSON.stringify(supplierData));

      // Show success message
      const content = getContent(selectedLanguage);
      const vendorTypeText = content.vendorTypes[vendorType as keyof typeof content.vendorTypes];
      alert(`Welcome ${userData?.name}! You are registered as a supplier of ${supplyItem} for ${vendorTypeText}. Data saved successfully!`);
      
      // For demo purposes, you can navigate to a main page or reset to login
      // navigate('/main');
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving supplier data. Please try again.');
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
    localStorage.removeItem('supplierDetails');
    navigate('/login');
  };

  const getContent = (language: string) => {
    const content = {
      english: {
        title: 'What do you supply?',
        subtitle: 'Please provide your supply details',
        supplyItemLabel: 'What do you supply?',
        supplyItemPlaceholder: 'e.g., vegetables, meat, spices, equipment, etc.',
        vendorTypeLabel: 'For which vendor type?',
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
        title: 'आप क्या आपूर्ति करते हैं?',
        subtitle: 'कृपया अपनी आपूर्ति का विवरण दें',
        supplyItemLabel: 'आप क्या आपूर्ति करते हैं?',
        supplyItemPlaceholder: 'जैसे, सब्जियां, मांस, मसाले, उपकरण, आदि।',
        vendorTypeLabel: 'किस विक्रेता प्रकार के लिए?',
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

      <form onSubmit={(e) => { e.preventDefault(); handleContinue(); }}>
        <div className="form-group">
          <label htmlFor="supplyItem" className="form-label">
            {currentContent.supplyItemLabel}
          </label>
          <input
            type="text"
            id="supplyItem"
            className="form-input"
            value={supplyItem}
            onChange={(e) => setSupplyItem(e.target.value)}
            placeholder={currentContent.supplyItemPlaceholder}
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            {currentContent.vendorTypeLabel}
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {Object.entries(currentContent.vendorTypes).map(([key, value]) => (
              <button
                key={key}
                type="button"
                className={`language-btn ${vendorType === key ? 'selected' : ''}`}
                onClick={() => setVendorType(key)}
                style={{ width: '100%', textAlign: 'left', padding: '0.75rem' }}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <button
            type="button"
            className="language-btn"
            onClick={handleBack}
            style={{ flex: 1 }}
          >
            {currentContent.back}
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={!supplyItem.trim() || !vendorType || isLoading}
            style={{ flex: 1 }}
          >
            {isLoading ? 'Saving...' : currentContent.continue}
          </button>
        </div>
      </form>

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

export default SupplierDetailsPage; 