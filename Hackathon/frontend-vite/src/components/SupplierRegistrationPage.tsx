import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dbOperations, User } from '../lib/supabase';

interface SupplierFormData {
  businessName: string;
  category: string;
  products: string;
  location: string;
  phone: string;
  email: string;
  priceRange: string;
  description: string;
  established: string;
  certifications: string;
  businessLicense?: string;
  gstNumber?: string;
}

const SupplierRegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState<SupplierFormData>({
    businessName: '',
    category: '',
    products: '',
    location: '',
    phone: '',
    email: '',
    priceRange: '',
    description: '',
    established: '',
    certifications: '',
    businessLicense: '',
    gstNumber: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const categories = [
    'Fresh Fruits & Vegetables',
    'Packaged Foods & Snacks',
    'Dairy & Beverages',
    'Spices & Condiments',
    'Grains & Cereals',
    'Bakery & Confectionery',
    'Meat & Seafood',
    'Organic Products',
    'Frozen Foods',
    'Oils & Ghee'
  ];

  useEffect(() => {
    // Check if user is authenticated and is a supplier
    const storedUserData = localStorage.getItem('userData');
    const userType = localStorage.getItem('userType');
    
    if (!storedUserData || userType !== 'supplier') {
      navigate('/login');
      return;
    }
    
    try {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      
      // Pre-fill email and phone if available
      setFormData(prev => ({
        ...prev,
        email: parsedUserData.email || '',
        phone: parsedUserData.phone || ''
      }));
    } catch (error) {
      navigate('/login');
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.products.trim()) {
      newErrors.products = 'Products list is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[1-9]\d{9,14}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Business description is required';
    }

    if (!formData.established.trim()) {
      newErrors.established = 'Established year is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // First, create or update user record
      const userRecord: Omit<User, 'id' | 'created_at' | 'updated_at'> = {
        name: userData.name,
        email: formData.email,
        phone: formData.phone,
        user_type: 'supplier',
        language: localStorage.getItem('selectedLanguage') || 'english'
      };

      let user;
      try {
        // Try to get existing user
        user = await dbOperations.getUserByEmail(formData.email);
        if (user) {
          // Update existing user
          user = await dbOperations.updateUser(user.id, {
            user_type: 'supplier',
            phone: formData.phone,
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

      // Create supplier record
      const supplierData = {
        user_id: user.id,
        business_name: formData.businessName,
        category: formData.category,
        products: formData.products.split(',').map(p => p.trim()),
        location: formData.location,
        contact_info: {
          phone: formData.phone,
          email: formData.email
        },
        price_range: formData.priceRange || 'Contact for pricing',
        description: formData.description,
        established: formData.established,
        certifications: formData.certifications.split(',').map(c => c.trim()).filter(c => c.length > 0),
        business_license: formData.businessLicense,
        gst_number: formData.gstNumber
      };

      await dbOperations.createSupplier(supplierData);

      // Update localStorage with complete user data
      const updatedUserData = {
        ...userData,
        id: user.id,
        email: formData.email,
        phone: formData.phone,
        userType: 'supplier',
        isRegistered: true
      };
      localStorage.setItem('userData', JSON.stringify(updatedUserData));

      setIsLoading(false);
      
      // Show success message and redirect
      alert('Registration successful! Welcome to our supplier network.');
      navigate('/supplier-dashboard'); // You can create this page later or redirect to a confirmation page
      
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      alert('Registration failed. Please try again.');
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
        maxWidth: '800px',
        maxHeight: '95vh',
        overflow: 'auto'
      }}
    >
      <h1 className="auth-title">Supplier Registration</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Tell us about your business to connect with potential vendors
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Business Information */}
        <div style={{ background: '#f8f9ff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e1e5e9' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#667eea' }}>Business Information</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Business Name *
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                placeholder="Your business name"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: errors.businessName ? '2px solid #ef4444' : '1px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
              {errors.businessName && (
                <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{errors.businessName}</span>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: errors.category ? '2px solid #ef4444' : '1px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && (
                <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{errors.category}</span>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Products/Services *
            </label>
            <input
              type="text"
              name="products"
              value={formData.products}
              onChange={handleInputChange}
              placeholder="e.g., Organic Vegetables, Fresh Fruits, Dairy Products (comma separated)"
              style={{
                width: '100%',
                padding: '12px',
                border: errors.products ? '2px solid #ef4444' : '1px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
            {errors.products && (
              <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{errors.products}</span>
            )}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Business Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your business, specialties, and what makes you unique"
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                border: errors.description ? '2px solid #ef4444' : '1px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
            {errors.description && (
              <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{errors.description}</span>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div style={{ background: '#f8f9ff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e1e5e9' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#667eea' }}>Contact Information</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="business@example.com"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: errors.email ? '2px solid #ef4444' : '1px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
              {errors.email && (
                <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{errors.email}</span>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91 98765 43210"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: errors.phone ? '2px solid #ef4444' : '1px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
              {errors.phone && (
                <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{errors.phone}</span>
              )}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Business Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="City, State"
              style={{
                width: '100%',
                padding: '12px',
                border: errors.location ? '2px solid #ef4444' : '1px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
            {errors.location && (
              <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{errors.location}</span>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div style={{ background: '#f8f9ff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e1e5e9' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#667eea' }}>Additional Information</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Established Year *
              </label>
              <input
                type="text"
                name="established"
                value={formData.established}
                onChange={handleInputChange}
                placeholder="2020"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: errors.established ? '2px solid #ef4444' : '1px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
              {errors.established && (
                <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{errors.established}</span>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Price Range
              </label>
              <input
                type="text"
                name="priceRange"
                value={formData.priceRange}
                onChange={handleInputChange}
                placeholder="₹100 - ₹5000 per unit"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Certifications
            </label>
            <input
              type="text"
              name="certifications"
              value={formData.certifications}
              onChange={handleInputChange}
              placeholder="FSSAI Licensed, ISO 22000, Organic Certified (comma separated)"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Business License Number
              </label>
              <input
                type="text"
                name="businessLicense"
                value={formData.businessLicense}
                onChange={handleInputChange}
                placeholder="Optional"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                GST Number
              </label>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleInputChange}
                placeholder="Optional"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem' }}>
          <button
            type="button"
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
            type="submit"
            className="submit-btn"
            disabled={isLoading}
            style={{ flex: '2' }}
          >
            {isLoading ? 'Registering...' : 'Complete Registration'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupplierRegistrationPage;