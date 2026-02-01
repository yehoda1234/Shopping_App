# 🛒 Shopping App

אפליקציית קנייה אונליין מודרנית וממלאת פעולות עם React ו-NestJS

## 🌟 תכונות ראשיות

- 🏪 **ממשק חנות** - הצגת מוצרים עם עיצוב רספונסיבי
- 🛍️ **עגלת קניות** - ניהול מוצרים בעגלה בזמן אמת
- 👤 **אימות משתמשים** - הרשמה והתחברות עם JWT
- 📦 **ניהול הזמנות** - יצירה וביצוע הזמנות
- 👨‍💼 **ממשק מנהל** - ניהול מוצרים וקטגוריות
- ☁️ **העלאת תמונות** - עם Cloudinary
- 🌐 **תמיכה בעברית** - RTL support מלא

## 🚀 התחלה מהירה

### דרישות מערכת

- Node.js 18+
- npm 9+
- PostgreSQL 12+

### Setup

#### 1. Clone הפרויקט

```bash
git clone <repo-url>
cd Shopping_App
```

#### 2. Backend Setup

```bash
cd server

# התקן dependencies
npm install

# יצור .env file
cp .env.example .env

# עדכן את הנתונים בקובץ .env שלך
# (database credentials, JWT secret, Cloudinary keys)

# הפעל את ה-development server
npm run start:dev
```

Server ירוץ על `http://localhost:3000`

#### 3. Frontend Setup

```bash
cd client

# התקן dependencies
npm install

# הפעל את ה-dev server
npm run dev
```

Client ירוץ על `http://localhost:5173`

## 📋 Environment Variables

### Server (.env)

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=shopping_app_db

# JWT
JWT_SECRET=your_secret_key_here

# Server
PORT=3000
NODE_ENV=development

# Cloudinary
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### Client (.env.local)

```env
VITE_API_URL=http://localhost:3000
```

## 🛠️ Available Scripts

### Backend

```bash
npm run start:dev          # Development mode (with watch)
npm run start              # Production mode
npm run build              # Build for production
npm run lint               # Run ESLint
npm run format             # Format code with Prettier
npm run test               # Run tests
npm run test:cov           # Test coverage
```

### Frontend

```bash
npm run dev                # Development server
npm run build              # Production build
npm run preview            # Preview production build
npm run lint               # Run ESLint
```

## 📁 Project Structure

```
Shopping_App/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── features/       # Redux slices
│   │   ├── services/       # API calls
│   │   ├── types/          # TypeScript types
│   │   └── App.tsx
│   └── package.json
│
└── server/                 # NestJS Backend
    ├── src/
    │   ├── auth/           # Authentication module
    │   ├── users/          # User management
    │   ├── products/       # Product CRUD
    │   ├── orders/         # Order management
    │   ├── cart/           # Shopping cart
    │   ├── categories/     # Categories
    │   ├── cloudinary/     # Image upload
    │   └── main.ts         # Entry point
    └── package.json
```

## 🔌 API Endpoints

### Authentication

```
POST /auth/login              # Login
POST /users                   # Register
```

### Products

```
GET /products                 # Get all products
GET /products/:id             # Get product by ID
POST /products                # Create (Admin only)
PATCH /products/:id           # Update (Admin only)
DELETE /products/:id          # Delete (Admin only)
```

### Orders

```
POST /orders                  # Create order
GET /orders                   # Get user's orders
PATCH /orders/:id             # Update status (Admin only)
```

### Cart

```
GET /cart                     # Get cart
POST /cart                    # Add to cart
PATCH /cart/:itemId           # Update quantity
DELETE /cart/:itemId          # Remove item
```

## 🗄️ Database

### Tables

- **users** - משתמשים
- **products** - מוצרים
- **categories** - קטגוריות
- **orders** - הזמנות
- **order_items** - פריטים בהזמנה
- **cart** - עגלה
- **cart_items** - פריטים בעגלה

## 🔐 Security

- ✅ Password hashing with bcrypt
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Input validation with DTOs
- ⚠️ CORS configured (update for production)

## 🏗️ Technology Stack

### Frontend
- React 19
- TypeScript
- Redux Toolkit
- React Router
- Bootstrap 5
- Axios

### Backend
- NestJS
- PostgreSQL
- TypeORM
- Passport.js
- JWT
- Cloudinary

## 📝 Notes

- זה פרויקט בפיתוח
- יש בעיות הידועות - ראה CODE_REVIEW_REPORT_HE.md
- לא מוכן לproduction ללא תיקונים

## 📚 More Info

- [Code Review Report](./CODE_REVIEW_REPORT_HE.md) - דוח ביקורת קוד מלא
- [Quick Fix Guide](./QUICK_FIX_GUIDE.md) - תיקונים מהירים
- [Best Practices](./BEST_PRACTICES.md) - נושאים

## 📄 License

MIT License
