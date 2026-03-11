## AI Resume Analyzer Backend

This is a production-ready Node.js + Express backend API for the **AI Resume Analyzer** SaaS application.  
It provides authentication, resume upload/parsing, AI-powered resume analysis, job description matching, and PDF report export.

The backend is designed to work with an existing React frontend, which should call the API via an environment variable such as `REACT_APP_API_URL` (or `VITE_API_URL` for Vite).

---

### Tech Stack

- **Node.js + Express.js**
- **MongoDB + Mongoose**
- **JWT** authentication
- **bcryptjs** for password hashing
- **multer** for file uploads
- **pdf-parse** and **mammoth** for PDF/DOCX parsing
- **OpenAI API** (`gpt-4o-mini`) for AI analysis
- **pdfkit** for PDF report generation
- **CORS** enabled for frontend origin

---

### Project Structure

```text
backend/
 ├ config/
 │   └ db.js
 ├ controllers/
 │   ├ analysisController.js
 │   ├ authController.js
 │   ├ reportController.js
 │   └ resumeController.js
 ├ middleware/
 │   ├ authMiddleware.js
 │   ├ errorMiddleware.js
 │   ├ rateLimiter.js
 │   └ uploadMiddleware.js
 ├ models/
 │   ├ Resume.js
 │   └ User.js
 ├ routes/
 │   ├ analysisRoutes.js
 │   ├ authRoutes.js
 │   ├ reportRoutes.js
 │   └ resumeRoutes.js
 ├ services/
 │   ├ aiService.js
 │   └ resumeParser.js
 ├ utils/
 │   ├ generateToken.js
 │   └ validators.js
 ├ uploads/
 │   └ resumes/        # stored resume files (gitignored)
 ├ .env.example
 ├ package.json
 └ server.js
```

---

### Environment Setup

1. **Install dependencies**

```bash
cd backend
npm install
```

2. **Create `.env` file**

Copy `.env.example` to `.env` and adjust values:

```bash
cd backend
cp .env.example .env  # on Windows: copy .env.example .env
```

Required variables:

- **PORT** – API port (default: `5000`)
- **MONGO_URI** – MongoDB connection string (local or Atlas)
- **MONGO_DB_NAME** – Database name
- **JWT_SECRET** – Strong random secret for signing JWTs
- **JWT_EXPIRES_IN** – e.g. `7d`
- **OPENAI_API_KEY** – Your OpenAI API key with access to `gpt-4o-mini`
- **CLIENT_ORIGIN** – URL of the frontend (e.g. `http://localhost:5173`)

3. **Run the server**

```bash
cd backend
npm run dev   # development with nodemon
# or
npm start     # production style
```

The API will be available at `http://localhost:5000` (or your configured `PORT`).

---

### Authentication Endpoints

Base path: `/api/auth`

- **POST `/api/auth/register`**
  - Body: `{ "name": string, "email": string, "password": string }`
  - Creates a user, hashes password with bcrypt, returns JWT and user info.

- **POST `/api/auth/login`**
  - Body: `{ "email": string, "password": string }`
  - Validates credentials and returns JWT and user info.

Use the returned JWT as:

```http
Authorization: Bearer <token>
```

to access protected routes.

---

### Resume Upload & History

Base path: `/api/resume`

- **POST `/api/resume/upload`** (protected)
  - Multipart form-data with field: `resume` (PDF or DOCX).
  - Uses **multer** for storage and validates file type/size.
  - Extracts text with `pdf-parse` or `mammoth`.
  - Stores:
    - `userId`
    - `fileName`
    - `filePath`
    - `extractedText`
    - `createdAt`
  - Response includes the saved `resume` document.

- **GET `/api/resume/history`** (protected)
  - Returns all resumes for the authenticated user, including any saved analysis.

- **DELETE `/api/resume/:id`** (protected)
  - Deletes a specific resume document and removes the uploaded file from disk.

---

### AI Resume Analysis

Base path: `/api/analyze`

- **POST `/api/analyze/resume`** (protected)
  - Body:
    - Required: `resumeText: string`
    - Optional: `resumeId: string` (to attach analysis to a stored resume)
  - Uses OpenAI `gpt-4o-mini` via the official Node SDK.
  - Returns:
    - `resumeScore` (0–100)
    - `atsCompatibility`
    - `keywordOptimization`
    - `skillRelevance`
    - `formattingReadability`
    - `improvementSuggestions`
  - If `resumeId` is provided and belongs to the user, results are stored under `analysisResult.resumeAnalysis` in the `Resume` document.

---

### Job Description Matching

- **POST `/api/analyze/job-match`** (protected)
  - Body:
    - Required: `resumeText: string`, `jobDescription: string`
    - Optional: `resumeId: string` (to persist match against a stored resume)
  - Returns:
    - `matchPercentage` (0–100)
    - `missingKeywords` (string[])
    - `suggestedImprovements`
  - If `resumeId` is provided and valid, each job match is appended to `analysisResult.jobMatches` for that resume.

---

### PDF Report Export

Base path: `/api/report`

- **GET `/api/report/:resumeId/pdf`** (protected)
  - Generates a **downloadable PDF** containing:
    - Resume score
    - ATS compatibility
    - Keyword optimization
    - Skill relevance
    - Formatting & readability
    - Improvement suggestions
    - Any stored job match results (match percentage, missing keywords, suggestions)
  - Uses `pdfkit` to stream the PDF to the client as an attachment.

---

### CORS & Frontend Integration

- CORS is enabled in `server.js` and restricted via `CLIENT_ORIGIN`.
- Set your frontend base URL to use the backend API, for example:
  - In **Create React App**: set `REACT_APP_API_URL=http://localhost:5000`
  - In **Vite**: set `VITE_API_URL=http://localhost:5000`

Your frontend can then call endpoints like:

```ts
const API_URL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;

const res = await fetch(`${API_URL}/api/resume/upload`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});
```

---

### Security Considerations

- **JWT auth** protects all non-public routes via `authMiddleware`.
- **Password hashing** uses `bcryptjs` with a salt.
- **File upload security**
  - Only accepts PDF/DOCX MIME types.
  - Max file size is limited (5 MB by default).
- **Input validation** via `express-validator` for auth and analysis endpoints.
- **CORS** restricted to the configured frontend origin.
- **Rate limiting** via `express-rate-limit` to mitigate abuse.
- **Helmet** is used to set secure HTTP headers.

---

### Deployment Notes

This backend can be deployed to platforms like **Render**, **Railway**, or traditional VPS/containers:

- Ensure environment variables from `.env` are set in the platform's dashboard.
- Configure the start command to `npm start` from the `backend` directory.
- Expose the configured `PORT`.
- Update the frontend `REACT_APP_API_URL` / `VITE_API_URL` to point at the deployed backend URL (e.g. `https://api.yourdomain.com`).

For serverless platforms (e.g. Vercel serverless functions), you would typically:

- Wrap Express using a serverless adapter (or re-implement routes as serverless functions).
- Ensure file uploads and PDF generation are compatible with the platform's filesystem limitations (often requiring S3 or similar storage).

This repository is currently structured for a long-running Node/Express process, which works well on Render/Railway/Heroku-style platforms.

