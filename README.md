          # 🎬 MemeStream AI Platform

A modern, AI-powered meme sharing platform built with Next.js, Supabase, and Google AI. Upload, share, and discover viral memes with built-in AI analysis and virality scoring.

![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat-square&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwindcss)

## ✨ Features

### Core Functionality
- 📤 **Upload Media** - Support for images and videos (MP4, WEBM, JPG, PNG, GIF)
- 🎨 **AI-Powered Captions** - Automatically generate funny captions using Google AI
- 📊 **Virality Prediction** - AI analyzes and scores meme potential (0-100)
- ❤️ **Like System** - Real-time likes with instant feedback
- 🔔 **Notifications** - Get notified about likes and new followers
- 👥 **Follow System** - Subscribe to your favorite creators
- 🔗 **Share** - Native share API with clipboard fallback
- 🗑️ **Delete** - Professional confirmation modal for owned content

### User Experience
- 🌙 **Dark Luxury Theme** - Premium glassmorphism design
- ⚡ **Real-time Updates** - Instant feed updates via Supabase Realtime
- 📱 **Responsive Design** - Mobile-first, works on all devices
- 🎭 **Video Autoplay** - Hover to preview videos
- ♾️ **Infinite Scroll** - Load more functionality with pagination
- 🎯 **Smart Search** - Find memes easily

### AI Features
- 🤖 **Caption Generation** - AI creates viral-worthy captions
- 🧠 **Virality Analysis** - Predicts meme success with reasoning
- 💡 **Smart Recommendations** - AI-powered content suggestions

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion (animations)
- NextAuth.js (authentication)

**Backend:**
- Supabase (PostgreSQL database)
- Supabase Storage (media files)
- Supabase Realtime (live updates)
- Google AI (Gemini) for captions & analysis

**UI Components:**
- Custom animated buttons
- Professional modals
- Glass-morphism cards
- Toast notifications (Sonner)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Google AI API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Brahmajyot/meme-_platform.git
cd meme-_platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key

# Google AI
GOOGLE_AI_API_KEY=your_google_ai_api_key

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

4. **Set up Supabase database**

Run these SQL scripts in your Supabase SQL Editor (in order):

```bash
# 1. Create tables and initial policies
supabase/supabase_schema.sql

# 2. Migrate to email-based user IDs (for NextAuth)
supabase/migration_text_user_id.sql

# 3. Add DELETE policy for meme management
supabase/add_memes_delete_policy.sql
```

5. **Configure Supabase Storage**

In your Supabase dashboard:
- Create a bucket named `meme-media`
- Set it to **public**
- Policies are already included in the schema

6. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
meme-platform/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   └── ai/              # AI endpoints (generate, analyze)
│   ├── meme/[id]/           # Individual meme page
│   ├── upload/              # Upload page
│   └── page.tsx             # Homepage
├── components/
│   ├── ai/                  # AI-related components
│   ├── layout/              # Header, Sidebar, etc.
│   ├── meme/                # MemeCard, MemeGrid
│   ├── providers/           # Context providers
│   │   └── MemeProvider.tsx # State management
│   ├── ui/                  # Reusable UI components
│   └── upload/              # FileUploader
├── lib/
│   ├── supabase/            # Supabase client configs
│   ├── google-ai.ts         # Google AI integration
│   └── utils.ts             # Utility functions
├── supabase/                # Database migrations
└── public/                  # Static assets
```

## 🗄️ Database Schema

### Tables

**memes**
- `id` (uuid, primary key)
- `title` (text)
- `category` (text)
- `thumbnail` (text, URL)
- `video_url` (text, optional)
- `user_id` (text, creator's email)
- `creator_name` (text)
- `creator_avatar` (text, URL)
- `views` (text)
- `trending_score` (numeric)
- `virality_score` (numeric, optional)
- `ai_reasoning` (text, optional)
- `created_at` (timestamp)

**likes**
- `id` (uuid, primary key)
- `user_id` (text, liker's email)
- `meme_id` (uuid, foreign key)
- `created_at` (timestamp)

**subscriptions**
- `id` (uuid, primary key)
- `subscriber_id` (text)
- `publisher_id` (text)
- `created_at` (timestamp)

**notifications**
- `id` (uuid, primary key)
- `user_id` (text)
- `type` (text: 'like', 'subscribe', 'upload')
- `content` (text)
- `related_id` (uuid)
- `is_read` (boolean)
- `created_at` (timestamp)

## 🔐 Authentication

This app uses **NextAuth.js** with email-based user identification:
- User IDs are stored as email addresses (not UUIDs)
- Supports Google and GitHub OAuth
- Session management with JWT

## 🎯 Key Features Implementation

### Delete Functionality
Users can delete their own memes:
1. Delete button appears only on owned content
2. Professional confirmation modal
3. Permanent deletion from database
4. Real-time UI update

### AI Integration
- **Caption Generation**: Send image to Google AI for funny captions
- **Virality Analysis**: AI predicts viral potential with reasoning
- Scores displayed as badges on meme cards

### Real-time Updates
- New memes appear instantly via Supabase Realtime
- Like counts update in real-time
- Notifications pushed instantly

### Pagination
- Initial load: 20 items
- "Load More" button for additional pages
- Smooth loading states

## 🐛 Troubleshooting

### Delete not working?
Make sure you've run the `add_memes_delete_policy.sql` migration.

### Old memes missing user_id?
Run the `fix_existing_memes_user_id.sql` script to update old records.

### Videos not playing?
Check Supabase storage bucket is public and CORS is configured.

### WebSocket errors?
These are development warnings and safe to ignore - realtime features still work.

## 📝 License

MIT License - feel free to use this project for learning or building your own meme platform!

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 👨‍💻 Author

Built with ❤️ by Brahmajyot

---

**Live Demo:** Coming soon!  
**Repository:** [github.com/Brahmajyot/meme-_platform](https://github.com/Brahmajyot/meme-_platform)