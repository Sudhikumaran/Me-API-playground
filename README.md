# Me-API Playground

A production-ready demo application showcasing a candidate profile API with MongoDB backend and React frontend.

## 🎯 Project Overview

This application demonstrates backend API development skills by building a RESTful API to manage a candidate profile, with endpoints for querying, searching, and filtering data. It includes a minimal frontend for testing the API endpoints.

**Live Demo:**

- Backend API: https://me-api-playground-backend-ucwi.onrender.com/
- Frontend: https://me-api-playground-olive.vercel.app/
- Resume:https://drive.google.com/file/d/1fn8gaPyLw6MRVHCLhbB3lh9f7w1Zn2aa/view?usp=sharing

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                         │
│                  React Frontend (Vercel)                     │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP REST API
                         │
┌────────────────────────▼────────────────────────────────────┐
│                  BACKEND SERVER                              │
│          Node.js + Express (Render/Railway)                  │
│                                                              │
│  Routes:                                                     │
│  ├─ GET  /api/health                                        │
│  ├─ GET  /api/profile                                       │
│  ├─ POST /api/profile                                       │
│  ├─ PUT  /api/profile                                       │
│  ├─ GET  /api/projects?skill={skill}                        │
│  ├─ GET  /api/skills/top?limit={n}                          │
│  └─ GET  /api/search?q={query}                              │
│                                                              │
└────────────────────────┬────────────────────────────────────┘
                         │ Mongoose ODM
                         │
┌────────────────────────▼────────────────────────────────────┐
│                 DATABASE (MongoDB)                           │
│              MongoDB Atlas (Free Tier)                       │
│                                                              │
│  Collection: profiles                                        │
│  ├─ name, email, skills[]                                   │
│  ├─ education[], work[]                                     │
│  ├─ projects[{title, description, links[]}]                 │
│  └─ links{github, linkedin, portfolio}                      │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Database Schema

### Profile Model

```javascript
{
  name: String (required),
  email: String (required, unique),
  education: [String],
  skills: [String],
  projects: [{
    title: String (required),
    description: String (required),
    links: [String]
  }],
  work: [String],
  links: {
    github: String,
    linkedin: String,
    portfolio: String
  },
  timestamps: true
}
```

**Indexes:**

- Unique index on `email`
- Text index on `name`, `projects.title`, `projects.description`, `skills` (for search)

## 🚀 API Endpoints

### Core Endpoints

#### GET /api/health

Health check endpoint.

**Response:**

```json
{
  "status": "ok"
}
```

#### GET /api/profile

Fetch the candidate profile.

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Alex Rivera",
    "email": "alex.rivera@example.com",
    "skills": ["JavaScript", "Python", "React", ...],
    "projects": [...],
    "education": [...],
    "work": [...],
    "links": {...}
  }
}
```

#### POST /api/profile

Create a new profile (one profile per database).

**Request Body:**

```json
{
  "name": "Your Name",
  "email": "you@example.com",
  "skills": ["skill1", "skill2"],
  "education": ["degree info"],
  "projects": [
    {
      "title": "Project Name",
      "description": "Description",
      "links": ["url1", "url2"]
    }
  ],
  "work": ["work experience"],
  "links": {
    "github": "https://github.com/username",
    "linkedin": "https://linkedin.com/in/username",
    "portfolio": "https://yoursite.com"
  }
}
```

**Response:** `201 Created` with profile data

#### PUT /api/profile

Update existing profile.

**Request Body:** Same as POST (partial updates supported)

**Response:** `200 OK` with updated profile data

### Query Endpoints

#### GET /api/projects?skill={skill}

Filter projects by skill.

**Example:** `/api/projects?skill=python`

**Response:**

```json
{
  "success": true,
  "skill": "python",
  "hasSkill": true,
  "count": 2,
  "data": [...]
}
```

#### GET /api/skills/top?limit={n}

Get top N skills (defaults to all).

**Example:** `/api/skills/top?limit=5`

**Response:**

```json
{
  "success": true,
  "total": 15,
  "count": 5,
  "data": ["JavaScript", "TypeScript", "Python", "React", "Node.js"]
}
```

#### GET /api/search?q={query}

Full-text search across profile.

**Example:** `/api/search?q=react`

**Response:**

```json
{
  "success": true,
  "query": "react",
  "totalMatches": 5,
  "data": {
    "skills": ["React"],
    "projects": [{...}],
    "education": [],
    "work": []
  }
}
```

## 🛠️ Local Development Setup

### Prerequisites

- Node.js (v18+)
- MongoDB (local or MongoDB Atlas account)
- Git

### Backend Setup

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd me-api-playground
```

2. **Install backend dependencies**

```bash
cd backend
npm install
```

3. **Configure environment variables**

```bash
# Copy example file
cp .env.example .env

# Edit .env with your values
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/me-api-playground

# For local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/me-api-playground
```

4. **Seed the database**

```bash
npm run seed
```

5. **Start the development server**

```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Install frontend dependencies**

```bash
cd frontend
npm install
```

2. **Configure environment variables**

```bash
# Copy example file
cp .env.example .env

# Edit .env
REACT_APP_API_URL=http://localhost:5000/api
```

3. **Start the development server**

```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 🌐 Production Deployment

### Backend Deployment (Render/Railway)

#### Using Render:

1. Create account at [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Environment Variables:**
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `NODE_ENV`: `production`
     - `FRONTEND_URL`: Your Vercel URL

#### Using Railway:

1. Create account at [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables (same as above)
5. Railway will auto-detect Node.js and deploy

### Frontend Deployment (Vercel)

1. Create account at [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Environment Variables:**
     - `REACT_APP_API_URL`: Your backend URL (e.g., `https://your-app.onrender.com/api`)
5. Deploy!

### MongoDB Setup (MongoDB Atlas - Free Tier)

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (M0)
3. Create a database user
4. Whitelist IP addresses (0.0.0.0/0 for all - or specific IPs)
5. Get connection string: Click "Connect" → "Connect your application"
6. Copy connection string and add to backend environment variables

## 📝 Sample API Requests

### Using cURL

```bash
# Health check
curl https://your-backend.onrender.com/api/health

# Get profile
curl https://your-backend.onrender.com/api/profile

# Filter projects by skill
curl "https://your-backend.onrender.com/api/projects?skill=python"

# Get top 5 skills
curl "https://your-backend.onrender.com/api/skills/top?limit=5"

# Search
curl "https://your-backend.onrender.com/api/search?q=react"

# Create profile (POST)
curl -X POST https://your-backend.onrender.com/api/profile \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","skills":["JavaScript"]}'

# Update profile (PUT)
curl -X PUT https://your-backend.onrender.com/api/profile \
  -H "Content-Type: application/json" \
  -d '{"skills":["JavaScript","Python","React"]}'
```

### Using Postman

Import collection:

1. Create new collection
2. Add requests for each endpoint
3. Set base URL variable: `{{baseUrl}}/api`
4. Test all endpoints

## 🧪 Testing

### Manual Testing Checklist

- [ ] GET /api/health returns 200
- [ ] GET /api/profile returns profile data
- [ ] POST /api/profile creates new profile
- [ ] PUT /api/profile updates profile
- [ ] GET /api/projects?skill=python filters correctly
- [ ] GET /api/skills/top returns skills
- [ ] GET /api/search?q=react finds relevant results
- [ ] All endpoints handle errors gracefully
- [ ] CORS is enabled for frontend
- [ ] Frontend displays profile correctly
- [ ] Frontend search/filter works

## 📋 Technology Stack

### Backend

- **Runtime:** Node.js v18+
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Middleware:** CORS, Morgan (logging)
- **Environment:** dotenv for config

### Frontend

- **Library:** React 18
- **Build Tool:** Create React App
- **HTTP Client:** Fetch API
- **Styling:** Inline styles (minimal)

### DevOps

- **Version Control:** Git
- **Backend Hosting:** Render / Railway (free tier)
- **Frontend Hosting:** Vercel (free tier)
- **Database Hosting:** MongoDB Atlas (free M0 tier)

## 🔍 Remarks & Trade-offs

### Design Decisions

1. **Single Profile Design**
   - Simplified to one profile per database (suitable for personal portfolio)
   - Could extend to multi-user with authentication in future

2. **Minimal Frontend**
   - Focused on functionality over design per requirements
   - No styling framework to keep bundle small
   - Easy to enhance with Tailwind/Material-UI later

3. **Search Implementation**
   - Basic string matching for simplicity
   - Could upgrade to MongoDB text search or Elasticsearch for production scale

4. **Error Handling**
   - Comprehensive try-catch blocks on all endpoints
   - Proper HTTP status codes
   - User-friendly error messages

### Production Considerations

**Implemented:**

- ✅ Environment variables for secrets
- ✅ CORS configuration
- ✅ Request logging
- ✅ Async/await error handling
- ✅ Database connection error handling
- ✅ Graceful shutdown handlers
- ✅ Input validation via Mongoose schemas

**Future Improvements:**

- Add rate limiting (express-rate-limit)
- Implement authentication (JWT)
- Add automated tests (Jest, Supertest)
- Set up CI/CD pipeline (GitHub Actions)
- Add API documentation (Swagger/OpenAPI)
- Implement pagination for large datasets
- Add caching layer (Redis)
- Set up monitoring/logging (Sentry, LogRocket)
- Add request validation (Joi, express-validator)

### Known Limitations

1. **No Authentication:** API is publicly accessible
2. **No Pagination:** All projects/skills returned at once
3. **Basic Search:** Simple substring matching
4. **Single Profile:** One profile per database instance
5. **No File Uploads:** Project images/documents not supported

### Scalability Notes

Current setup handles:

- Small to medium traffic (free tier limits)
- Single candidate profile
- Up to ~100 projects without performance issues

For production scale:

- Add Redis caching
- Implement pagination
- Use connection pooling
- Add CDN for static assets
- Consider microservices for larger apps

## 📞 Contact

**Candidate:** Alex Rivera  
**Email:** alex.rivera@example.com  
**GitHub:** [github.com/alexrivera](https://github.com/alexrivera)  
**LinkedIn:** [linkedin.com/in/alexrivera](https://linkedin.com/in/alexrivera)  
**Portfolio:** [alexrivera.dev](https://alexrivera.dev)

---

**Built with ❤️ for internship assessment**
