# Vendor-Supplier Platform Setup Guide

## New Features

### 1. User Type Selection
After language selection, users now choose whether they are a **Vendor** or **Supplier**:
- **Vendors**: Food business owners looking for suppliers
- **Suppliers**: Companies that supply food products to vendors

### 2. Supplier Registration
Suppliers complete a comprehensive registration form with:
- Business information (name, category, products)
- Contact details (email, phone, location)
- Additional info (certifications, licenses, established year)

### 3. Vendor Information Storage
Vendors select their category and business details are stored in the database.

### 4. Supabase Integration
All user, vendor, and supplier data is stored in Supabase database for persistence.

## Database Setup

### 1. Create Supabase Project
1. Go to [Supabase](https://supabase.com) and create a new project
2. Note your project URL and anon key from the project settings

### 2. Set up Database Tables
1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-setup.sql`
4. Run the SQL script to create tables and sample data

### 3. Configure Environment Variables
1. Copy `.env.example` to `.env`
2. Replace the placeholder values with your actual Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
```

## Application Flow

### For Vendors:
1. Login → Language Selection → User Type Selection (Vendor)
2. Vendor Category Selection → Supplier Recommendations
3. Vendor info saved to Supabase `users` and `vendors` tables

### For Suppliers:
1. Login → Language Selection → User Type Selection (Supplier)
2. Supplier Registration Form → Success/Dashboard
3. Supplier info saved to Supabase `users` and `suppliers` tables

## Database Schema

### Tables Created:
- **users**: Base user information with type (vendor/supplier)
- **vendors**: Vendor-specific business details
- **suppliers**: Comprehensive supplier information with products and certifications

### Key Features:
- UUID primary keys
- Foreign key relationships
- Row Level Security (RLS) enabled
- Proper indexing for performance
- JSON fields for contact info and arrays for products/certifications

## File Changes Made:

### New Files:
- `src/lib/supabase.ts` - Supabase configuration and database operations
- `src/components/UserTypeSelectionPage.tsx` - User type selection component
- `src/components/SupplierRegistrationPage.tsx` - Supplier registration form
- `.env.example` - Environment variables template
- `supabase-setup.sql` - Database setup script

### Updated Files:
- `src/App.tsx` - Added new routes
- `src/components/LanguageSelectionPage.tsx` - Updated navigation flow
- `src/components/VendorSelectionPage.tsx` - Added Supabase integration
- `src/components/SupplierRecommendationsPage.tsx` - Load suppliers from database

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (see above)

3. Start development server:
```bash
npm run dev
```

## Testing

The application includes fallback mechanisms:
- If Supabase is not configured, it uses local storage
- If no suppliers are found in database, it shows static sample data
- Error handling for network issues

## Categories Supported:
- Fresh Fruits & Vegetables
- Packaged Foods & Snacks
- Dairy & Beverages
- Spices & Condiments
- Grains & Cereals
- Bakery & Confectionery
- Meat & Seafood
- Organic Products
- Frozen Foods
- Oils & Ghee