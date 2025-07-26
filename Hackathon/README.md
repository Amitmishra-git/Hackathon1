# Vendor-Based Supplier Recommendation System

## Overview
This application provides a vendor-based supplier recommendation system where users can select their vendor category and get personalized supplier recommendations that match their business needs.

## Features

### 1. User Registration & Authentication
- User registration with location auto-detection via PIN code
- Language selection (English/Hindi)
- User data persistence across sessions

### 2. Vendor Selection
- Multiple vendor categories available:
  - Electronics
  - Fashion & Apparel  
  - Home & Garden
  - Sports & Fitness
  - Books & Education
  - Automotive
- Detailed vendor information including description and location
- Interactive vendor selection interface

### 3. Supplier Recommendations
- **Smart Filtering**: Suppliers are automatically filtered based on the selected vendor's category
- **Detailed Supplier Information**:
  - Company name and description
  - Star ratings and reviews
  - Contact information (phone, email)
  - Product/service offerings
  - Price ranges
  - Establishment year
  - Certifications and compliance
  - Location details

### 4. Interactive Features
- Click to expand supplier details
- Direct contact buttons for each supplier
- Navigation between different vendor categories
- Responsive design for mobile and desktop

## How It Works

1. **User Registration**: Users enter their details and location
2. **Language Selection**: Choose preferred language
3. **Vendor Selection**: Select the vendor category that matches their business
4. **Supplier Recommendations**: View filtered suppliers who supply products/services for that vendor category
5. **Contact Suppliers**: Get contact information and reach out to preferred suppliers

## Technical Implementation

### Frontend
- **React 19** with TypeScript
- **React Router** for navigation
- **Responsive CSS** with modern styling
- **Local Storage** for data persistence

### Key Components
- `LoginPage.tsx` - User registration and authentication
- `LanguageSelectionPage.tsx` - Language preference selection
- `VendorSelectionPage.tsx` - Vendor category selection
- `SupplierRecommendationsPage.tsx` - Filtered supplier recommendations

### Supplier Filtering Logic
```typescript
// Filter suppliers based on vendor category
const categorySuppliers = allSuppliers.filter(
  supplier => supplier.category === selectedVendor.category
);
```

## Getting Started

1. Install dependencies:
   ```bash
   cd Hackathon/frontend-vite
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## User Flow

1. **Login** → Enter personal details and location
2. **Language Selection** → Choose English or Hindi
3. **Vendor Selection** → Pick your business category
4. **Supplier Recommendations** → View and contact relevant suppliers

## Benefits

- **Targeted Recommendations**: Only see suppliers relevant to your vendor category
- **Time Efficient**: No need to browse through unrelated suppliers
- **Comprehensive Information**: All supplier details in one place
- **Easy Contact**: Direct access to supplier contact information
- **User-Friendly**: Intuitive interface with smooth navigation

## Future Enhancements

- Integration with real supplier databases
- Advanced filtering options (location, price range, ratings)
- Messaging system between users and suppliers
- Supplier comparison tools
- Review and rating system
- Mobile app version