import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

  // Sample vendor data - in a real app, this would come from an API
  const vendors: Vendor[] = [
    {
      id: '1',
      name: 'TechMart Electronics',
      category: 'Electronics',
      description: 'Leading electronics vendor specializing in smartphones, laptops, and accessories',
      location: 'Mumbai, Maharashtra'
    },
    {
      id: '2',
      name: 'Fashion Hub',
      category: 'Fashion & Apparel',
      description: 'Premium fashion retailer offering clothing, shoes, and accessories',
      location: 'Delhi, NCR'
    },
    {
      id: '3',
      name: 'HomeCraft Furniture',
      category: 'Home & Garden',
      description: 'Quality furniture and home decor items for modern living',
      location: 'Bangalore, Karnataka'
    },
    {
      id: '4',
      name: 'SportZone',
      category: 'Sports & Fitness',
      description: 'Complete sports equipment and fitness gear supplier',
      location: 'Pune, Maharashtra'
    },
    {
      id: '5',
      name: 'BookWorld',
      category: 'Books & Education',
      description: 'Educational materials, books, and learning resources',
      location: 'Kolkata, West Bengal'
    },
    {
      id: '6',
      name: 'AutoParts Pro',
      category: 'Automotive',
      description: 'Automotive parts and accessories supplier',
      location: 'Chennai, Tamil Nadu'
    }
  ];

  useEffect(() => {
    // Check if user is authenticated
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

  const handleVendorSelect = (vendor: Vendor) => {
    setSelectedVendor(vendor);
  };

  const handleContinue = () => {
    if (!selectedVendor) {
      return;
    }

    setIsLoading(true);

    // Store selected vendor
    localStorage.setItem('selectedVendor', JSON.stringify(selectedVendor));

    setTimeout(() => {
      setIsLoading(false);
      navigate('/supplier-recommendations');
    }, 800);
  };

  const handleBack = () => {
    navigate('/language-selection');
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="auth-container" style={{ maxWidth: '600px' }}>
      <h1 className="auth-title">Select Your Vendor Category</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Choose the vendor category that best matches your business needs
      </p>

      <div className="vendor-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
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
              textAlign: 'left'
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

      <div style={{ display: 'flex', gap: '1rem' }}>
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