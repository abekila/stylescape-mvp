# StyleScape MVP

AI-Powered Fashion Content Generation Platform

## Overview

StyleScape is a revolutionary SaaS platform that empowers e-commerce clothing brands to create professional marketing content using AI. Upload your garment images, select AI models and scenes, and generate high-quality fashion photography without expensive photoshoots.

## Features

- **Product Upload**: Upload garment images with fabric and fit specifications
- **AI Model Library**: Choose from diverse AI models representing different demographics
- **Scene Selection**: Select from professional backgrounds and lighting setups
- **Content Generation**: Generate high-quality images and videos using Gemini AI
- **Responsive Design**: Modern, mobile-friendly interface built with React and Tailwind CSS

## Technology Stack

### Backend
- Flask (Python)
- SQLAlchemy for database management
- Google Gemini AI for content analysis and generation
- Flask-CORS for cross-origin requests

### Frontend
- React with Vite
- Tailwind CSS for styling
- shadcn/ui components
- Lucide icons

## Getting Started

### Prerequisites
- Python 3.8+ (for backend)
- Node.js 16+ (for frontend)
- Git

### Backend Setup
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
python src/main.py
```
The backend will start on **http://localhost:4000**

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will start on **http://localhost:3000**

### Important Notes
- The frontend uses Vite proxy to route `/api` requests to the backend on port 4000
- Make sure both servers are running for full functionality
- The uploads directory is automatically created for image uploads
- File uploads are handled at `/api/products/upload`

### Testing the Application
1. Open http://localhost:3000 in your browser
2. Click "Try Now" to start the workflow
3. Upload a product image (PNG, JPG up to 10MB)
4. Fill in product details and proceed through the workflow

## API Endpoints

- `POST /api/products` - Create new product
- `GET /api/avatars` - Get available AI models
- `GET /api/scenes` - Get available scenes
- `POST /api/generate/content` - Generate fashion content
- `POST /api/init/database` - Initialize database with preset data

## MVP Features Implemented

✅ Product upload and management
✅ AI model selection
✅ Scene selection
✅ Content generation workflow
✅ Responsive UI design
✅ Database initialization
✅ Gemini AI integration

## Future Enhancements

- Real image upload and processing
- Advanced AI model customization
- Video generation capabilities
- User authentication and accounts
- Payment integration
- API access for enterprise users

## License

MIT License

