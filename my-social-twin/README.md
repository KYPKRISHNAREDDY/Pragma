# My Social Twin - AI-Powered Social Stories for Autistic Children

## 📖 Overview

**My Social Twin** is a Progressive Web App (PWA) that generates personalized, interactive social stories for autistic children using AI. It creates engaging, visual narratives with familiar faces and scenarios to help children learn and practice social situations.

### ✨ Key Features

- **AI Story Generation**: Powered by Anthropic's Claude AI to create personalized social stories
- **Progressive Web App**: Works on mobile, tablet, and desktop - install like a native app
- **Offline Support**: Stories are cached for offline viewing
- **Child Profiles**: Manage multiple children with customized sensory preferences
- **Character Library**: Upload photos of family, friends, and teachers for personalized stories
- **Interactive Choices**: Children can make decisions and learn from feedback
- **Sensory Controls**: Adjustable volume, brightness, and pacing for individual needs
- **Story Templates**: Pre-built templates for school, medical, social, and routine situations
- **Progress Tracking**: Monitor completion rates and choice accuracy
- **Collaboration**: Parents and teachers can share access to children's profiles

---

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI**: Anthropic Claude API
- **PWA**: Vite PWA Plugin with Workbox
- **Routing**: React Router v6
- **Deployment**: Vercel / Netlify

---

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ and npm installed
- A Supabase account ([supabase.com](https://supabase.com))
- An Anthropic API key ([anthropic.com](https://anthropic.com))
- Git installed

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/my-social-twin.git
cd my-social-twin
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be set up (takes ~2 minutes)

#### Run the Database Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL script to create all tables, policies, and templates

#### Create Storage Buckets
1. Go to **Storage** in the Supabase dashboard
2. Create three public buckets:
   - `children_photos`
   - `character_photos`
   - `story_backgrounds`

3. Make them publicly accessible:
   - Click on each bucket
   - Go to "Policies"
   - Add a policy allowing public reads

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_ANTHROPIC_API_KEY=your-anthropic-api-key-here
VITE_APP_URL=http://localhost:5173
```

**Where to find these values:**
- **Supabase URL & Anon Key**: Supabase Dashboard → Settings → API
- **Anthropic API Key**: [Anthropic Console](https://console.anthropic.com/)

### 5. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 📱 Using the Application

### First Time Setup

1. **Register an Account**
   - Click "Sign Up"
   - Choose "Parent" or "Teacher" role
   - Verify your email (check Supabase inbox settings)

2. **Add a Child Profile**
   - Click "Add Child"
   - Upload a photo
   - Set name, age, and sensory preferences
   - Click "Add Child"

3. **Add Characters** (Optional but Recommended)
   - Go to the child's profile
   - Click "Characters" tab
   - Add family members, friends, and teachers with photos

4. **Create Your First Story**
   - Click "Create New Story"
   - Choose a template (e.g., "Morning Arrival at School")
   - Select characters to include
   - Add scenario details (optional)
   - Click "Generate Story with AI"

5. **View the Story**
   - Navigate through frames using arrow buttons
   - Make choices at decision points
   - Adjust sensory controls (brightness, volume) using the ⚙️ button
   - Complete the story to save progress

---

## 🏗️ Project Structure

```
my-social-twin/
├── public/                 # Static assets
│   └── manifest.json       # PWA manifest
├── src/
│   ├── components/         # React components
│   │   ├── AddChildModal.tsx
│   │   ├── ChildCard.tsx
│   │   └── SensoryControls.tsx
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx
│   ├── pages/              # Page components
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── ChildView.tsx
│   │   ├── StoryCreator.tsx
│   │   └── StoryViewer.tsx
│   ├── services/           # API services
│   │   ├── supabase.ts
│   │   └── claude.ts
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── supabase-schema.sql     # Database schema
├── .env.example            # Environment variables template
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## 🎨 Accessibility Features

The app is designed with accessibility in mind:

- **High Contrast**: Large, clear text with high contrast colors
- **Touch Targets**: All buttons are minimum 60x60px for easy tapping
- **Sensory Controls**: Adjustable volume and brightness
- **Simple Language**: AI generates age-appropriate, literal language
- **Visual Feedback**: Clear icons, emojis, and color coding
- **Reduced Motion**: Respects `prefers-reduced-motion` setting

---

## 🚢 Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env`

### Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to Netlify

3. Set environment variables in Netlify dashboard

---

## 🔒 Security Notes

⚠️ **Important**: The current implementation uses `dangerouslyAllowBrowser: true` for the Anthropic SDK. This is for development only.

**For production**, you should:
1. Create a backend API endpoint
2. Call Claude API from your server (not the browser)
3. Remove `dangerouslyAllowBrowser` flag

Example backend endpoint structure:
```
POST /api/generate-story
Body: { childId, templateId, characters, scenarioDetails }
Server calls Claude API → Returns story frames
```

---

## 📝 Database Schema

The app uses the following main tables:
- `users` - User accounts (parents/teachers)
- `children` - Child profiles with sensory settings
- `characters` - Family, friends, teachers
- `story_templates` - Pre-built story templates
- `stories` - Generated stories
- `progress` - Completion tracking
- `collaborations` - Shared access between users

See `supabase-schema.sql` for complete schema with RLS policies.

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **Anthropic Claude** for AI story generation
- **Supabase** for backend infrastructure
- **React** and **Vite** for the frontend framework
- The autism community for inspiration and guidance

---

## 📞 Support

For issues or questions:
- Open a GitHub issue
- Contact: [your-email@example.com]

---

## 🗺️ Roadmap

Future enhancements planned:
- [ ] Digital twin avatar generation
- [ ] Text-to-speech for stories
- [ ] Sound effects library
- [ ] Story sharing between families
- [ ] Analytics dashboard for therapists
- [ ] Multi-language support
- [ ] Mobile app versions (iOS/Android)

---

Made with ❤️ for children and families affected by autism
