import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import LanguageSelectionPage from './components/LanguageSelectionPage';
import UserTypeSelectionPage from './components/UserTypeSelectionPage';
import VendorSelectionPage from './components/VendorSelectionPage';
import SupplierRegistrationPage from './components/SupplierRegistrationPage';
import SupplierRecommendationsPage from './components/SupplierRecommendationsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/language-selection" element={<LanguageSelectionPage />} />
          <Route path="/user-type-selection" element={<UserTypeSelectionPage />} />
          <Route path="/vendor-selection" element={<VendorSelectionPage />} />
          <Route path="/supplier-registration" element={<SupplierRegistrationPage />} />
          <Route path="/supplier-recommendations" element={<SupplierRecommendationsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 