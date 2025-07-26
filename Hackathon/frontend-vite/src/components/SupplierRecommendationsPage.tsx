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

  // Sample supplier data - in a real app, this would come from an API
  const allSuppliers: Supplier[] = [
    // Electronics suppliers
    {
      id: '1',
      name: 'ElectroTech Wholesale',
      category: 'Electronics',
      products: ['Smartphones', 'Laptops', 'Tablets', 'Accessories', 'Chargers'],
      rating: 4.8,
      location: 'Mumbai, Maharashtra',
      contactInfo: {
        phone: '+91 98765 43210',
        email: 'sales@electrotech.com'
      },
      priceRange: '₹500 - ₹1,50,000',
      description: 'Leading wholesale supplier of electronics with 15+ years of experience',
      established: '2008',
      certifications: ['ISO 9001', 'CE Certified', 'BIS Approved']
    },
    {
      id: '2',
      name: 'Digital Components Ltd',
      category: 'Electronics',
      products: ['Circuit Boards', 'Processors', 'Memory Cards', 'Cables', 'Adapters'],
      rating: 4.6,
      location: 'Bangalore, Karnataka',
      contactInfo: {
        phone: '+91 87654 32109',
        email: 'info@digitalcomponents.com'
      },
      priceRange: '₹100 - ₹50,000',
      description: 'Specialized in electronic components and parts supply',
      established: '2012',
      certifications: ['ISO 14001', 'RoHS Compliant']
    },
    // Fashion & Apparel suppliers
    {
      id: '3',
      name: 'Textile Masters',
      category: 'Fashion & Apparel',
      products: ['Cotton Fabrics', 'Silk', 'Denim', 'Synthetic Materials', 'Accessories'],
      rating: 4.7,
      location: 'Delhi, NCR',
      contactInfo: {
        phone: '+91 76543 21098',
        email: 'orders@textilemasters.com'
      },
      priceRange: '₹50 - ₹5,000 per meter',
      description: 'Premium textile supplier serving fashion industry for over 20 years',
      established: '2003',
      certifications: ['GOTS Certified', 'OEKO-TEX Standard']
    },
    {
      id: '4',
      name: 'Fashion Forward Supplies',
      category: 'Fashion & Apparel',
      products: ['Ready-made Garments', 'Shoes', 'Bags', 'Jewelry', 'Belts'],
      rating: 4.5,
      location: 'Chennai, Tamil Nadu',
      contactInfo: {
        phone: '+91 65432 10987',
        email: 'contact@fashionforward.com'
      },
      priceRange: '₹200 - ₹15,000',
      description: 'Complete fashion accessories and garment supplier',
      established: '2010',
      certifications: ['WRAP Certified', 'BSCI Compliant']
    },
    // Home & Garden suppliers
    {
      id: '5',
      name: 'WoodCraft Industries',
      category: 'Home & Garden',
      products: ['Wooden Furniture', 'Chairs', 'Tables', 'Cabinets', 'Decorative Items'],
      rating: 4.9,
      location: 'Bangalore, Karnataka',
      contactInfo: {
        phone: '+91 54321 09876',
        email: 'sales@woodcraft.com'
      },
      priceRange: '₹2,000 - ₹2,00,000',
      description: 'Handcrafted wooden furniture manufacturer and supplier',
      established: '1995',
      certifications: ['FSC Certified', 'Greenguard Gold']
    },
    {
      id: '6',
      name: 'Home Essentials Co.',
      category: 'Home & Garden',
      products: ['Kitchen Appliances', 'Home Decor', 'Lighting', 'Garden Tools', 'Planters'],
      rating: 4.4,
      location: 'Pune, Maharashtra',
      contactInfo: {
        phone: '+91 43210 98765',
        email: 'info@homeessentials.com'
      },
      priceRange: '₹500 - ₹75,000',
      description: 'Complete home and garden essentials supplier',
      established: '2007',
      certifications: ['Energy Star', 'ISI Mark']
    },
    // Sports & Fitness suppliers
    {
      id: '7',
      name: 'Athletic Pro Supplies',
      category: 'Sports & Fitness',
      products: ['Sports Equipment', 'Gym Machines', 'Athletic Wear', 'Shoes', 'Accessories'],
      rating: 4.6,
      location: 'Pune, Maharashtra',
      contactInfo: {
        phone: '+91 32109 87654',
        email: 'orders@athleticpro.com'
      },
      priceRange: '₹300 - ₹5,00,000',
      description: 'Professional sports and fitness equipment supplier',
      established: '2009',
      certifications: ['ISO 9001', 'CE Marked']
    },
    // Books & Education suppliers
    {
      id: '8',
      name: 'Knowledge Hub Publishers',
      category: 'Books & Education',
      products: ['Educational Books', 'E-learning Materials', 'Stationery', 'Digital Content', 'Teaching Aids'],
      rating: 4.8,
      location: 'Kolkata, West Bengal',
      contactInfo: {
        phone: '+91 21098 76543',
        email: 'sales@knowledgehub.com'
      },
      priceRange: '₹50 - ₹10,000',
      description: 'Leading educational content and material supplier',
      established: '2001',
      certifications: ['NCERT Approved', 'CBSE Recognized']
    },
    // Automotive suppliers
    {
      id: '9',
      name: 'AutoParts Express',
      category: 'Automotive',
      products: ['Engine Parts', 'Brake Systems', 'Tires', 'Batteries', 'Accessories'],
      rating: 4.7,
      location: 'Chennai, Tamil Nadu',
      contactInfo: {
        phone: '+91 10987 65432',
        email: 'support@autopartsexpress.com'
      },
      priceRange: '₹100 - ₹1,00,000',
      description: 'Comprehensive automotive parts and accessories supplier',
      established: '2005',
      certifications: ['IATF 16949', 'ISO 14001']
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
    <div className="auth-container" style={{ maxWidth: '800px', maxHeight: '90vh', overflow: 'auto' }}>
      <h1 className="auth-title">Supplier Recommendations</h1>
      <div style={{ 
        background: '#f8f9ff', 
        padding: '1rem', 
        borderRadius: '8px', 
        marginBottom: '2rem',
        border: '1px solid #e1e5e9'
      }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#667eea' }}>
          Selected Vendor: {selectedVendor.name}
        </h3>
        <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
          Category: {selectedVendor.category} | Showing {filteredSuppliers.length} recommended suppliers
        </p>
      </div>

      {filteredSuppliers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <p>No suppliers found for this category.</p>
          <button onClick={handleBack} className="submit-btn" style={{ marginTop: '1rem' }}>
            Select Different Vendor
          </button>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '2rem' }}>
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
                        <strong style={{ color: '#333' }}>Certifications:</strong>
                        <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
                          {supplier.certifications.join(', ')}
                        </div>
                      </div>
                    </div>

                    <div>
                      <strong style={{ color: '#333' }}>Products & Services:</strong>
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

          <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #e1e5e9' }}>
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