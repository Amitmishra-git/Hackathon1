import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PINCODE_API = 'https://api.postalpincode.in/pincode/';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNo: '',
    city: '',
    state: '',
    pinCode: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);
  const [pinError, setPinError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateContactNo = (contactNo: string): boolean => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(contactNo.replace(/\s/g, ''));
  };

  const validatePinCode = (pinCode: string): boolean => {
    const pinRegex = /^\d{6}$/;
    return pinRegex.test(pinCode.replace(/\s/g, ''));
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Only allow digits for pinCode and max 6 digits
    if (name === 'pinCode') {
      const digits = value.replace(/\D/g, '').slice(0, 6);
      setFormData(prev => ({ ...prev, pinCode: digits }));
      setPinError('');
      setFormData(prev => ({ ...prev, city: '', state: '' }));
      if (digits.length === 6) {
        setPinLoading(true);
        try {
          const res = await fetch(PINCODE_API + digits);
          const data = await res.json();
          if (data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
            const postOffice = data[0].PostOffice[0];
            setFormData(prev => ({
              ...prev,
              city: postOffice.District || '',
              state: postOffice.State || ''
            }));
            setPinError('');
          } else {
            setPinError('Invalid pin code. Please enter a valid 6-digit pin code.');
          }
        } catch (err) {
          setPinError('Error fetching location. Please try again.');
        }
        setPinLoading(false);
      }
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPinError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!formData.contactNo.trim()) {
      setError('Please enter your contact number');
      return;
    }
    if (!validateContactNo(formData.contactNo)) {
      setError('Please enter a valid 10-digit contact number');
      return;
    }
    if (!formData.city.trim()) {
      setError('Please enter your city');
      return;
    }
    if (!formData.state.trim()) {
      setError('Please enter your state');
      return;
    }
    if (!formData.pinCode.trim()) {
      setError('Please enter your pin code');
      return;
    }
    if (!validatePinCode(formData.pinCode)) {
      setError('Please enter a valid 6-digit pin code');
      return;
    }
    if (pinError) {
      setError(pinError);
      return;
    }
    setIsLoading(true);
    // Store user data (city/state from pin code)
    localStorage.setItem('userData', JSON.stringify(formData));
    setIsLoading(false);
    navigate('/language-selection');
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Welcome</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Please enter your details to continue
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="contactNo" className="form-label">Contact Number</label>
          <input
            type="tel"
            id="contactNo"
            name="contactNo"
            className="form-input"
            value={formData.contactNo}
            onChange={handleInputChange}
            placeholder="Enter your 10-digit contact number"
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="pinCode" className="form-label">Pin Code</label>
          <input
            type="text"
            id="pinCode"
            name="pinCode"
            className="form-input"
            value={formData.pinCode}
            onChange={handleInputChange}
            placeholder="Enter your 6-digit pin code"
            disabled={isLoading || pinLoading}
            maxLength={6}
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="postal-code"
          />
          {pinLoading && <div style={{ color: '#888', fontSize: '0.9rem' }}>Checking pin code...</div>}
          {pinError && <div className="error-message">{pinError}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="city" className="form-label">City</label>
          <input
            type="text"
            id="city"
            name="city"
            className="form-input"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="City will be auto-filled"
            disabled={true}
          />
        </div>
        <div className="form-group">
          <label htmlFor="state" className="form-label">State</label>
          <input
            type="text"
            id="state"
            name="state"
            className="form-input"
            value={formData.state}
            onChange={handleInputChange}
            placeholder="State will be auto-filled"
            disabled={true}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button
          type="submit"
          className="submit-btn"
          disabled={isLoading || pinLoading}
        >
          {isLoading ? 'Processing...' : 'Continue'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage; 