# Get Berg Restaurant - New Features

## Authentication & User Management

### Customer Authentication
- **Social Login**: Sign in with Google or Facebook
- **Email/Password**: Traditional authentication with Supabase
- **User Profile**: Automatic profile creation with full name

### Admin Authentication
- **Dual Login Methods**:
  - Quick Login: Legacy password-based access (password: x1shubh@123)
  - Admin Account: Supabase-based authentication with role verification
- **Role-Based Access**: Only users in the `admin_users` table can access admin features

## Customer Features

### Order Tracking
- **My Orders Page**: View all your orders in one place
- **Real-Time Status**: Track order progression
  - Pending → Preparing → Delivered
- **Visual Progress**: See order status with progress bars and icons
- **Order History**: Complete history with timestamps and details
- **Payment Status**: View payment status for each order

### Enhanced Ordering
- Orders automatically linked to user accounts when logged in
- Guest ordering still available (orders won't be tracked)
- Order details include delivery information

## Admin Features

### Enhanced Invoice Generation
- **Professional PDF Invoices**:
  - Branded header with restaurant logo
  - Detailed order information
  - Itemized billing
  - Payment status indicators
  - Footer with thank you message
- **Automatic Generation**: Generate invoices for paid orders
- **Downloadable**: Save as PDF files

### Order Management
- View all customer orders
- Update order status
- Manage payment status
- Generate professional invoices

## Database Enhancements

### New Tables
- `admin_users`: Manages admin roles and permissions
- Orders table enhanced with:
  - `user_id`: Links orders to customers
  - `delivery_address`: Delivery location
  - `delivery_lat/lng`: GPS coordinates (for future map integration)

### Security
- Row Level Security (RLS) policies
- Users can only view their own orders
- Admins can view all orders
- Protected admin routes

## Technical Stack

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Supabase client for authentication
- jsPDF for invoice generation
- Sonner for toast notifications

### Backend
- Supabase Auth (Google & Facebook OAuth)
- Supabase Database (PostgreSQL)
- RLS policies for data security

## Environment Variables

Required in `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_PASSWORD=x1shubh@123
```

## Future Enhancements Ready

### Map Integration
The database is already prepared for map features:
- Delivery coordinates stored in orders
- Ready to integrate with Mapbox, Google Maps, or Leaflet
- Can show delivery locations and restaurant location

### Social Features
- Customer ratings and reviews
- Favorite items
- Order recommendations

## Getting Started

### For Customers
1. Visit the website
2. Sign in with Google/Facebook or create an account
3. Browse menu and place orders
4. Track orders in "My Orders" page

### For Admins
1. Go to Admin Login
2. Use Quick Login (password) or Admin Account (email/password)
3. Manage menu items, orders, and content
4. Generate invoices for paid orders

## Deployment

The app is ready for deployment on Netlify:
1. Push to GitHub
2. Connect to Netlify
3. Set environment variables in Netlify dashboard
4. Deploy automatically

## Supabase Setup

### Enable Auth Providers
In Supabase Dashboard:
1. Go to Authentication → Providers
2. Enable Google (add OAuth credentials)
3. Enable Facebook (add OAuth credentials)
4. Set redirect URLs

### Create Admin Users
To add admins, insert into `admin_users` table:
```sql
INSERT INTO admin_users (user_id, email, role)
VALUES ('user-uuid-from-auth-users', 'admin@example.com', 'admin');
```
