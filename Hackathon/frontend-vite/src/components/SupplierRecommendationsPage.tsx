import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Supplier {
  id: string;
  name: string;
  category: string;
  products: string[];
  rating: number;
  location: string;
  contactInfo: {
    phone: string;
    email: string;
  };
  priceRange: string;
  description: string;
  established: string;
  certifications: string[];
}

interface Vendor {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string;
}

const SupplierRecommendationsPage: React.FC = () => {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();

  // Updated supplier data with food and edible items only
  const allSuppliers: Supplier[] = [
    // Fresh Fruits & Vegetables suppliers
    {
      id: '1',
      name: 'Organic Farm Direct',
      category: 'Fresh Fruits & Vegetables',
      products: ['Organic Apples', 'Fresh Spinach', 'Tomatoes', 'Carrots', 'Bananas', 'Leafy Greens'],
      rating: 4.8,
      location: 'Mumbai, Maharashtra',
      contactInfo: {
        phone: '+91 98765 43210',
        email: 'sales@organicfarmdirect.com'
      },
      priceRange: '₹20 - ₹500 per kg',
      description: 'Premium organic fruits and vegetables directly from certified organic farms',
      established: '2015',
      certifications: ['Organic India Certified', 'FSSAI Licensed', 'Fair Trade']
    },
    {
      id: '2',
      name: 'Fresh Harvest Co.',
      category: 'Fresh Fruits & Vegetables',
      products: ['Seasonal Fruits', 'Root Vegetables', 'Herbs', 'Citrus Fruits', 'Berries'],
      rating: 4.6,
      location: 'Pune, Maharashtra',
      contactInfo: {
        phone: '+91 87654 32109',
        email: 'info@freshharvest.com'
      },
      priceRange: '₹15 - ₹400 per kg',
      description: 'Fresh seasonal produce sourced from local farmers',
      established: '2018',
      certifications: ['FSSAI Licensed', 'ISO 22000']
    },
    // Packaged Foods & Snacks suppliers
    {
      id: '3',
      name: 'Snack Central',
      category: 'Packaged Foods & Snacks',
      products: ['Potato Chips', 'Cookies', 'Nuts & Seeds', 'Energy Bars', 'Crackers', 'Dried Fruits'],
      rating: 4.7,
      location: 'Delhi, NCR',
      contactInfo: {
        phone: '+91 76543 21098',
        email: 'orders@snackcentral.com'
      },
      priceRange: '₹50 - ₹1,200 per pack',
      description: 'Wide variety of healthy and tasty packaged snacks and foods',
      established: '2012',
      certifications: ['FSSAI Licensed', 'BRC Food Safety', 'Halal Certified']
    },
    {
      id: '4',
      name: 'Gourmet Foods Ltd',
      category: 'Packaged Foods & Snacks',
      products: ['Instant Noodles', 'Ready Meals', 'Breakfast Cereals', 'Pasta', 'Sauces', 'Canned Foods'],
      rating: 4.5,
      location: 'Bangalore, Karnataka',
      contactInfo: {
        phone: '+91 65432 10987',
        email: 'contact@gourmetfoods.com'
      },
      priceRange: '₹80 - ₹800 per item',
      description: 'Premium packaged foods and gourmet meal solutions',
      established: '2010',
      certifications: ['FSSAI Licensed', 'ISO 22000', 'HACCP']
    },
    // Dairy & Beverages suppliers
    {
      id: '5',
      name: 'Pure Dairy Solutions',
      category: 'Dairy & Beverages',
      products: ['Fresh Milk', 'Yogurt', 'Cheese', 'Butter', 'Paneer', 'Cream'],
      rating: 4.9,
      location: 'Bangalore, Karnataka',
      contactInfo: {
        phone: '+91 54321 09876',
        email: 'sales@puredairy.com'
      },
      priceRange: '₹30 - ₹800 per item',
      description: 'Fresh dairy products from farm to table with quality assurance',
      established: '2008',
      certifications: ['FSSAI Licensed', 'ISO 22000', 'Organic Certified']
    },
    {
      id: '6',
      name: 'Beverage Masters',
      category: 'Dairy & Beverages',
      products: ['Fresh Juices', 'Smoothies', 'Lassi', 'Coconut Water', 'Energy Drinks', 'Tea & Coffee'],
      rating: 4.4,
      location: 'Chennai, Tamil Nadu',
      contactInfo: {
        phone: '+91 43210 98765',
        email: 'info@beveragemasters.com'
      },
      priceRange: '₹25 - ₹300 per bottle',
      description: 'Fresh and healthy beverages for all occasions',
      established: '2014',
      certifications: ['FSSAI Licensed', 'FDA Approved']
    },
    // Spices & Condiments suppliers
    {
      id: '7',
      name: 'Spice Kingdom',
      category: 'Spices & Condiments',
      products: ['Whole Spices', 'Ground Spices', 'Masala Blends', 'Pickles', 'Chutneys', 'Dried Herbs'],
      rating: 4.8,
      location: 'Pune, Maharashtra',
      contactInfo: {
        phone: '+91 32109 87654',
        email: 'orders@spicekingdom.com'
      },
      priceRange: '₹100 - ₹2,000 per kg',
      description: 'Authentic Indian spices and condiments with traditional flavors',
      established: '2005',
      certifications: ['FSSAI Licensed', 'Spices Board Certified', 'Organic Certified']
    },
    // Grains & Cereals suppliers
    {
      id: '8',
      name: 'Grain Warehouse',
      category: 'Grains & Cereals',
      products: ['Basmati Rice', 'Wheat Flour', 'Pulses', 'Millets', 'Quinoa', 'Oats'],
      rating: 4.7,
      location: 'Kolkata, West Bengal',
      contactInfo: {
        phone: '+91 21098 76543',
        email: 'sales@grainwarehouse.com'
      },
      priceRange: '₹40 - ₹300 per kg',
      description: 'Premium quality grains and cereals for healthy nutrition',
      established: '2003',
      certifications: ['FSSAI Licensed', 'FPO Certified', 'Organic Certified']
    },
    // Bakery & Confectionery suppliers
    {
      id: '9',
      name: 'Sweet Delights Bakery',
      category: 'Bakery & Confectionery',
      products: ['Fresh Bread', 'Cakes', 'Pastries', 'Cookies', 'Chocolates', 'Traditional Sweets'],
      rating: 4.6,
      location: 'Chennai, Tamil Nadu',
      contactInfo: {
        phone: '+91 10987 65432',
        email: 'support@sweetdelights.com'
      },
      priceRange: '₹50 - ₹2,500 per item',
      description: 'Fresh bakery items and traditional sweets made with quality ingredients',
      established: '2011',
      certifications: ['FSSAI Licensed', 'Halal Certified', 'ISO 22000']
    }
  ];

  useEffect(() => {
    // Check if user is authenticated and has selected a vendor
    const storedUserData = localStorage.getItem('userData');
    const selectedLanguage = localStorage.getItem('selectedLanguage');
    const storedVendor = localStorage.getItem('selectedVendor');
    
    if (!storedUserData || !selectedLanguage || !storedVendor) {
      navigate('/login');
      return;
    }
    
    try {
      const parsedUserData = JSON.parse(storedUserData);
      const parsedVendor = JSON.parse(storedVendor);
      setUserData(parsedUserData);
      setSelectedVendor(parsedVendor);
      
      // Filter suppliers based on vendor category
      const categorySuppliers = allSuppliers.filter(
        supplier => supplier.category === parsedVendor.category
      );
      setFilteredSuppliers(categorySuppliers);
    } catch (error) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSupplierSelect = (supplier: Supplier) => {
    setSelectedSupplier(selectedSupplier?.id === supplier.id ? null : supplier);
  };

  const handleContactSupplier = (supplier: Supplier) => {
    // In a real app, this would open a contact form or messaging system
    alert(`Contacting ${supplier.name}\nPhone: ${supplier.contactInfo.phone}\nEmail: ${supplier.contactInfo.email}`);
  };

  const handleBack = () => {
    navigate('/vendor-selection');
  };

  const handleStartOver = () => {
    localStorage.removeItem('selectedVendor');
    navigate('/language-selection');
  };

  if (!userData || !selectedVendor) {
    return <div>Loading...</div>;
  }

  const renderStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

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
      <h1 className="auth-title">Food Supplier Recommendations</h1>
      <div style={{ 
        background: '#f8f9ff', 
        padding: '1rem', 
        borderRadius: '8px', 
        marginBottom: '2rem',
        border: '1px solid #e1e5e9',
        flexShrink: 0
      }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#667eea' }}>
          Selected Vendor: {selectedVendor.name}
        </h3>
        <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
          Category: {selectedVendor.category} | Showing {filteredSuppliers.length} recommended food suppliers
        </p>
      </div>

      {filteredSuppliers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <p>No food suppliers found for this category.</p>
          <button onClick={handleBack} className="submit-btn" style={{ marginTop: '1rem' }}>
            Select Different Vendor
          </button>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '2rem', flex: '1', overflowY: 'auto' }}>
            {filteredSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="supplier-card"
                style={{
                  border: selectedSupplier?.id === supplier.id ? '2px solid #667eea' : '1px solid #e1e5e9',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginBottom: '1rem',
                  background: 'white',
                  cursor: 'pointer'
                }}
                onClick={() => handleSupplierSelect(supplier)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#333', fontSize: '1.2rem' }}>
                      {supplier.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <span style={{ color: '#667eea', fontWeight: '600' }}>
                        {renderStars(supplier.rating)} {supplier.rating}
                      </span>
                      <span style={{ color: '#888', fontSize: '0.9rem' }}>
                        📍 {supplier.location}
                      </span>
                    </div>
                    <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>
                      {supplier.description}
                    </p>
                    <div style={{ color: '#888', fontSize: '0.85rem' }}>
                      Established: {supplier.established} | Price Range: {supplier.priceRange}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContactSupplier(supplier);
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    Contact
                  </button>
                </div>

                {selectedSupplier?.id === supplier.id && (
                  <div style={{ 
                    borderTop: '1px solid #e1e5e9', 
                    paddingTop: '1rem',
                    background: '#f8f9ff',
                    margin: '0 -1.5rem -1.5rem -1.5rem',
                    padding: '1rem 1.5rem',
                    borderRadius: '0 0 12px 12px'
                  }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: '#667eea' }}>Supplier Details</h4>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <strong style={{ color: '#333' }}>Contact Information:</strong>
                        <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
                          📞 {supplier.contactInfo.phone}<br />
                          ✉️ {supplier.contactInfo.email}
                        </div>
                      </div>
                      <div>
                        <strong style={{ color: '#333' }}>Food Safety Certifications:</strong>
                        <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
                          {supplier.certifications.join(', ')}
                        </div>
                      </div>
                    </div>

                    <div>
                      <strong style={{ color: '#333' }}>Available Food Products:</strong>
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '0.5rem', 
                        marginTop: '0.5rem' 
                      }}>
                        {supplier.products.map((product, index) => (
                          <span
                            key={index}
                            style={{
                              background: '#667eea',
                              color: 'white',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '15px',
                              fontSize: '0.8rem',
                              fontWeight: '500'
                            }}
                          >
                            {product}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
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
                cursor: 'pointer'
              }}
            >
              Change Vendor
            </button>
            <button
              onClick={handleStartOver}
              className="submit-btn"
              style={{ flex: '1' }}
            >
              Start Over
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SupplierRecommendationsPage;