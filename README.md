# Buy, Sell @ IIITH

A marketplace platform for IIIT Hyderabad community developed using MERN Stack.

## Features

### User Authentication
- **Email/Password Login**
  - Secure authentication with JWT tokens
  - CAPTCHA verification with custom image generation
  - Password encryption using bcrypt
  
- **CAS Integration**
  - Single Sign-On with IIIT Hyderabad's CAS
  - Automatic profile creation for first-time CAS users
  - Seamless authentication flow

- **Profile Management**
  - Update personal information (name, email, contact)
  - View listed items and order history
  - Secure password updates

### Item Management
- **Listing Items**
  - Image upload with Cloudinary integration
  - Multiple category support (clothing, electronics, books, etc.)
  - Rich text description and pricing
  
- **Search & Discovery**
  - Real-time search functionality
  - Category-based filtering
  - Grid view with item cards
  
- **Item Details**
  - Detailed item view with images
  - Seller information and contact details
  - Direct add-to-cart functionality

### Shopping Cart
- **Cart Management**
  - Add/remove items with quantity control
  - Persistent cart storage
  - Prevents adding self-listed items
  - Total price calculation

- **Checkout Process**
  - Order summary view
  - Multiple items checkout
  - Clear cart after successful order

### Order Management
- **Order Tracking**
  - Separate views for bought and sold items
  - Order status updates (pending, OTP generated, completed)
  - Order history with item details

- **OTP System**
  - Secure 6-digit OTP generation
  - 24-hour OTP validity
  - Regeneration capability

### Delivery System
- **Delivery Management**
  - Pending deliveries dashboard
  - OTP-based verification
  - Real-time status updates

- **Verification Process**
  - Secure OTP verification
  - Order completion confirmation
  - Automatic status updates

### AI Support Assistant
- **Chat Interface**
  - Real-time conversation with Gemini Pro AI
  - Context-aware responses
  - Persistent chat history
  - Typing indicators and animations

### Security Features
- **Data Protection**
  - JWT-based authentication
  - Password encryption
  - CORS protection
  - Secure file uploads

### User Experience
- **Responsive Design**
  - Mobile-friendly interface
  - Real-time updates
  - Loading states and error handling
  - Toast notifications for actions

## Tech Stack

### Frontend
- React with Vite
- TailwindCSS for styling
- React Router for navigation
- Axios for API requests
- Google Generative AI for chat support

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for image storage
- CORS and security middleware

## Setup Instructions

### Prerequisites
- Node.js 16+
- MongoDB
- Cloudinary account
- Google Gemini API Key

### Backend Setup
```bash
cd backend
cp .env.example .env    # Update with your credentials
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
cp .env.example .env    # Update with your credentials  
npm install
npm run dev
```
### Required environment variables for backend:
```env
MONGO_URI=<your_mongodb_uri>
CLOUDINARY_API_KEY=<your_key>
CLOUDINARY_SECRET_KEY=<your_secret>
CLOUDINARY_NAME=<your_cloud_name>
JWT_SECRET=<your_jwt_secret>
```

### Required environment variables for frontend:
```env
VITE_GEMINI_API_KEY=<your_gemini_api_key>
```

### Development
- Frontend runs on http://localhost:5173
- Backend runs on http://localhost:4000

