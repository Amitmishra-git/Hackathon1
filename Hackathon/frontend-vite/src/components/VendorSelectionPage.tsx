import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dbOperations, User } from '../lib/supabase';

interface Vendor {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string;
}

const VendorSelectionPage: React.FC = () => {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();

  // Updated vendor data with food/edible related categories
  const vendors: Vendor[] = [
    {
      id: '1',
      name: 'Fresh Farm Produce',
      category: 'Fresh Fruits & Vegetables',
      description: 'Premium supplier of fresh organic fruits and vegetables directly from farms',
      location: 'Mumbai, Maharashtra'
    },
    {
      id: '2',
      name: 'Gourmet Food Hub',
      category: 'Packaged Foods & Snacks',
      description: 'Wide variety of packaged foods, snacks, and gourmet items for retail',
      location: 'Delhi, NCR'
    },
    {
      id: '3',
      name: 'Dairy Fresh Co.',
      category: 'Dairy & Beverages',
      description: 'Fresh dairy products, milk, yogurt, cheese, and healthy beverages',
      location: 'Bangalore, Karnataka'
    },
    {
      id: '4',
      name: 'Spice Garden',
      category: 'Spices & Condiments',
      description: 'Authentic spices, herbs, condiments, and cooking ingredients',
      location: 'Pune, Maharashtra'
    },
    {
      id: '5',
      name: 'Grain & Cereals Plus',
      category: 'Grains & Cereals',
      description: 'Quality grains, cereals, pulses, and staple food items',
      location: 'Kolkata, West Bengal'
    },
    {
      id: '6',
      name: 'Sweet Treats Wholesale',
      category: 'Bakery & Confectionery',
      description: 'Fresh bakery items, sweets, chocolates, and confectionery products',
      location: 'Chennai, Tamil Nadu'
    }
  ];

  useEffect(() => {
    // Check if user is authenticated and is a vendor
    const storedUserData = localStorage.getItem('userData');
    const selectedLanguage = localStorage.getItem('selectedLanguage');
    const userType = localStorage.getItem('userType');
    
    if (!storedUserData || !selectedLanguage || userType !== 'vendor') {
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

  const handleVendorSelect = (vendor: Vendor) => {
    setSelectedVendor(vendor);
  };

  const handleContinue = async () => {
    if (!selectedVendor) {
      return;
    }

    setIsLoading(true);

    try {
      // First, create or update user record
      const userRecord: Omit<User, 'id' | 'created_at' | 'updated_at'> = {
        name: userData.name,
        email: userData.email || '',
        phone: userData.phone || '',
        user_type: 'vendor',
        language: localStorage.getItem('selectedLanguage') || 'english'
      };

      let user;
      try {
        // Try to get existing user
        user = await dbOperations.getUserByEmail(userData.email);
        if (user) {
          // Update existing user
          user = await dbOperations.updateUser(user.id, {
            user_type: 'vendor',
            language: userRecord.language
          });
        } else {
          // Create new user
          user = await dbOperations.createUser(userRecord);
        }
      } catch (error) {
        // If user doesn't exist, create new one
        user = await dbOperations.createUser(userRecord);
      }

      // Create vendor record
      const vendorData = {
        user_id: user.id,
        business_name: selectedVendor.name,
        category: selectedVendor.category,
        description: selectedVendor.description,
        location: selectedVendor.location
      };

      await dbOperations.createVendor(vendorData);

      // Store selected vendor and update user data
      localStorage.setItem('selectedVendor', JSON.stringify(selectedVendor));
      
      const updatedUserData = {
        ...userData,
        id: user.id,
        userType: 'vendor',
        isRegistered: true
      };
      localStorage.setItem('userData', JSON.stringify(updatedUserData));

      setIsLoading(false);
      navigate('/supplier-recommendations');
      
    } catch (error) {
      console.error('Error saving vendor information:', error);
      // Continue with local storage only if Supabase fails
      localStorage.setItem('selectedVendor', JSON.stringify(selectedVendor));
      setIsLoading(false);
      navigate('/supplier-recommendations');
    }
  };

  const handleBack = () => {
    navigate('/user-type-selection');
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div 
      className="auth-container" 
      style={{ 
        maxWidth: '900px',
        maxHeight: '95vh',
        overflow: 'auto',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <h1 className="auth-title">Select Your Vendor Category</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Choose the food vendor category that best matches your business needs
      </p>

      <div 
        className="vendor-grid" 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1rem',
          marginBottom: '2rem',
          flex: '1',
          overflowY: 'auto'
        }}
      >
        {vendors.map((vendor) => (
          <div
            key={vendor.id}
            className={`vendor-card ${selectedVendor?.id === vendor.id ? 'selected' : ''}`}
            onClick={() => handleVendorSelect(vendor)}
            style={{
              border: selectedVendor?.id === vendor.id ? '2px solid #667eea' : '2px solid #e1e5e9',
              borderRadius: '12px',
              padding: '1.5rem',
              cursor: 'pointer',
              background: selectedVendor?.id === vendor.id ? '#f8f9ff' : 'white',
              textAlign: 'left',
              height: 'fit-content'
            }}
          >
            <h3 style={{ 
              margin: '0 0 0.5rem 0', 
              color: selectedVendor?.id === vendor.id ? '#667eea' : '#333',
              fontSize: '1.1rem'
            }}>
              {vendor.name}
            </h3>
            <div style={{ 
              color: '#667eea', 
              fontSize: '0.9rem', 
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}>
              {vendor.category}
            </div>
            <p style={{ 
              color: '#666', 
              fontSize: '0.9rem', 
              margin: '0 0 0.5rem 0',
              lineHeight: '1.4'
            }}>
              {vendor.description}
            </p>
            <div style={{ 
              color: '#888', 
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center'
            }}>
              📍 {vendor.location}
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid #e1e5e9',
        flexShrink: 0
      }}>
        <button
          onClick={handleBack}
          style={{
            flex: '1',
            padding: '0.75rem',
            background: '#f8f9fa',
            color: '#666',
            border: '2px solid #e1e5e9',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Back
        </button>
        <button
          className="submit-btn"
          onClick={handleContinue}
          disabled={!selectedVendor || isLoading}
          style={{ flex: '2' }}
        >
          {isLoading ? 'Processing...' : 'View Supplier Recommendations'}
        </button>
      </div>
    </div>
  );
};

export default VendorSelectionPage;