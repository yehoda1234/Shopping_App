# 🛒 Shopping App - חנות אונליין מלאה

אפליקציית קנייה מודרנית וחזקה שנבנתה עם React ו-NestJS

## 🌟 תכונות ראשיות

- 🏪 **ממשק חנות** - עיסקה מרחקית של מוצרים עם עיצוב רেספונסיבי
- 🛍️ **עגלה קניות** - ניהול פריטים בזמן אמת עם Redux
- 👤 **ניהול משתמשים** - הרשמה, התחברות, פרופיל
- 📦 **ניהול הזמנות** - עקיבה אחרי הזמנות וסטטוס
- 🔐 **התחברות מאובטחת** - JWT Token authentication
- 👨‍💼 **ניהול מנהלים** - ממשק לעריכת מוצרים ודיווח
- ☁️ **העלאת תמונות** - אינטגרציה עם Cloudinary
- 📱 **Mobile-First Design** - עיצוב מותאם לנייד וטאבלט
- 🌐 **תמיכה בעברית** - RTL support מלא

## 🏗️ מבנה הפרויקט

```
Shopping_App/
├── client/                    # Front-end (React + Vite)
│   ├── src/
│   │   ├── components/        # רכיבים מחדשים (Navbar, ProductCard, CartDrawer)
│   │   ├── pages/            # עמודים (Store, Login, Checkout, AdminDashboard)
│   │   ├── features/         # Redux store & slices
│   │   ├── services/         # API integration
│   │   ├── types/            # TypeScript types
│   │   └── App.tsx           # Root component
│   └── package.json
│
└── server/                    # Back-end (NestJS)
    ├── src/
    │   ├── auth/             # Authentication (JWT, Strategy)
    │   ├── users/            # User management
    │   ├── products/         # Product CRUD
    │   ├── orders/           # Order management
    │   ├── cart/             # Shopping cart logic
    │   ├── categories/       # Product categories
    │   ├── cloudinary/       # Image upload service
    │   ├── common/           # Decorators, Guards, Transformers
    │   └── main.ts           # Entry point
    └── package.json
```

## 💻 דרישות מערכת

- **Node.js** 18+ 
- **npm** 9+
- **PostgreSQL** 12+
- **Cloudinary Account** (לעלאת תמונות)

## 🚀 התחלה מהירה

### 1️⃣ Setup Database

```bash
# יוצר מסד נתונים PostgreSQL
createdb shopping_app_db

# שים את credentials ב-.env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_NAME=shopping_app_db
```

### 2️⃣ התקן את הServer

```bash
cd server

# התקן dependencies
npm install

# הפעל את ה-server בmode development
npm run start:dev
```

Server ירוץ על `http://localhost:3000`

### 3️⃣ התקן את ה-Client

```bash
cd client

# התקן dependencies
npm install

# הפעל את ה-dev server
npm run dev
```

Client ירוץ על `http://localhost:5173`

## 📋 Variables סביבה (.env)

### Server (.env)

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=shopping_app_db

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Server
PORT=3000
NODE_ENV=development

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Client (.env)

```env
VITE_API_URL=http://localhost:3000
```

## 📖 שימוש בAPI

### Authentication

```bash
# הרשמה
POST /users
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "יוסי",
  "lastName": "כהן"
}

# התחברות
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

# תגובה
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "USER"
  }
}
```

### Products (דוגמאות)

```bash
# קבל את כל המוצרים
GET /products

# קבל מוצר אחד
GET /products/:id

# יצירת מוצר (Admin only)
POST /products
Authorization: Bearer <token>
{
  "name": "Laptop",
  "price": 1299.99,
  "stock": 5,
  "description": "High-performance laptop",
  "categoryId": 1
}

# עדכון מוצר (Admin only)
PATCH /products/:id
{
  "price": 999.99,
  "stock": 10
}

# מחיקת מוצר (Admin only)
DELETE /products/:id
```

### Orders

```bash
# יצירת הזמנה
POST /orders
Authorization: Bearer <token>
{
  "shippingAddress": "123 Main St, City",
  "phone": "0501234567",
  "comment": "Please deliver between 9-17"
}

# קבל את ההזמנות שלי
GET /orders
Authorization: Bearer <token>

# עדכון סטטוס הזמנה (Admin only)
PATCH /orders/:id
{
  "status": "SHIPPED"
}
```

### Cart

```bash
# קבל את העגלה
GET /cart
Authorization: Bearer <token>

# הוסף לעגלה
POST /cart
{
  "productId": 1,
  "quantity": 2
}

# עדכן כמות
PATCH /cart/:itemId
{
  "quantity": 5
}

# הסר מעגלה
DELETE /cart/:itemId
```

## 🎨 טכנולוגיות בשימוש

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **Vite** - Build tool
- **React Bootstrap** - UI Components
- **Axios** - HTTP client
- **React Router** - Navigation
- **Notistack** - Notifications

### Backend
- **NestJS** - Framework
- **TypeORM** - ORM
- **PostgreSQL** - Database
- **Passport.js** - Authentication
- **JWT** - Token-based auth
- **Bcrypt** - Password hashing
- **Cloudinary** - Image hosting
- **Class Validator** - DTO validation

## 🔐 אבטחה

- ✅ **Password Hashing** - bcrypt עם salt
- ✅ **JWT Authentication** - Token-based auth
- ✅ **Role-Based Access** - Admin/User roles
- ✅ **CORS** - Cross-origin protection
- ✅ **DTO Validation** - Input validation
- ⚠️ **Rate Limiting** - צריך להוסיף
- ⚠️ **Input Sanitization** - צריך להוסיף

## 📚 Scripts עיקריים

### Server

```bash
npm run start:dev        # Run בmode watch
npm run start:prod       # Production build
npm run build           # Build only
npm run test            # Run tests
npm run test:cov        # Test coverage
npm run lint            # Lint code
npm run format          # Format code
```

### Client

```bash
npm run dev             # Development server
npm run build           # Production build
npm run preview         # Preview build
npm run lint            # Lint TypeScript
```

## 🗂️ מבנה Database

### Users Table
```
users:
  - id (PK)
  - email (UNIQUE)
  - password (hashed)
  - firstName
  - lastName
  - role (ENUM: ADMIN, USER)
  - createdAt
  - updatedAt
```

### Products Table
```
products:
  - id (PK)
  - name
  - price (DECIMAL)
  - description
  - stock (INT)
  - imageUrl
  - categoryId (FK)
  - createdAt
  - updatedAt
```

### Orders Table
```
orders:
  - id (PK)
  - userId (FK)
  - status (ENUM)
  - totalAmount
  - shippingAddress
  - phone
  - comment
  - createdAt
  - updatedAt
```

### Cart Table
```
cart:
  - id (PK)
  - userId (FK)
  - createdAt
  - updatedAt

cart_items:
  - id (PK)
  - cartId (FK)
  - productId (FK)
  - quantity
```

## 🐛 Troubleshooting

### Connection Error to Database
```
Solution: בדוק ש-PostgreSQL רץ ו-credentials נכונים
```

### Token Expired
```
Solution: התחבר שוב לקבל token חדש
```

### CORS Error
```
Solution: ודא שה-client ו-server בו-זמנית בطלא שנויי endpoints
```

### File Upload Failed
```
Solution: בדוק Cloudinary credentials ו-network connection
```

## 🚀 Deployment

### Backend (Heroku / Railway)

```bash
# יצור .env בProduction
NODE_ENV=production
DB_HOST=<production_db_host>
JWT_SECRET=<strong_secret>

# Deploy
git push heroku main
```

### Frontend (Vercel / Netlify)

```bash
# Build
npm run build

# Deploy
vercel deploy
```

## 📊 أداء Optimization

- [ ] Add pagination to products
- [ ] Add caching (Redis)
- [ ] Image optimization (WebP)
- [ ] Code splitting for React
- [ ] Database indexing
- [ ] CDN for static assets

## 🤝 תרומה

רוצה לתרום? בואו בואו!

1. Fork את הrepo
2. יוצר branch (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file

## 👨‍💻 מידע יצירה

- **Platform:** E-Commerce
- **Stack:** React + NestJS + PostgreSQL
- **Status:** Under Development 🚧
- **Updated:** January 2026

## 📞 Contact & Support

עם שאלות או בעיות, אנא פתח Issue בGitHub

---

**Made with ❤️ by your development team**
