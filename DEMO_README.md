# My Social Twin - SIMPLE LOCAL DEMO

🎉 **No external setup needed! Everything runs locally!**

## Quick Start (Just 2 Steps!)

### Step 1: Install Dependencies

```bash
cd my-social-twin
npm install
```

Wait for all packages to install (~1-2 minutes).

### Step 2: Run the App

```bash
npm run dev
```

Open your browser to: **http://localhost:5173**

## That's It! 🚀

No API keys needed!
No database setup needed!
No cloud accounts needed!

Everything runs in your browser using localStorage!

---

## Using the Demo

### 1. Create an Account
- Click **"Sign Up"**
- Enter any email (e.g., `demo@test.com`)
- Enter any password (e.g., `password123`)
- Select **"Parent"** role
- Click **"Create Account"**

### 2. Add a Child
- Click **"Add Child"**
- Enter name (e.g., "Alex")
- Enter age (e.g., 7)
- Upload a photo (optional - or use placeholder)
- Adjust sensory settings with sliders
- Click **"Add Child"**

### 3. Create a Story
- Click on the child card
- Click **"Create New Story"**
- **Step 1**: Choose a template (e.g., "Morning Arrival at School")
- **Step 2**: Skip or add characters (optional)
- **Step 3**: Click **"Generate Story with AI"**
- Wait 2 seconds for mock AI to generate

### 4. View the Story
- Navigate through frames using arrow buttons
- Make choices when prompted
- Adjust brightness/volume using ⚙️ button (bottom-right)
- Complete the story!

---

## Features in This Demo

✅ User registration & login (stored locally)
✅ Child profile management
✅ Sensory preferences customization
✅ 6 pre-built story templates
✅ Mock AI story generation (no API needed!)
✅ Interactive story viewing
✅ Choice-based learning
✅ Sensory controls
✅ Progress tracking
✅ Offline PWA support

---

## Technical Details

- **Data Storage**: Browser localStorage (persists between sessions)
- **AI Stories**: Pre-written templates (no external API)
- **Photos**: Stored as base64 in localStorage
- **No Backend**: Everything runs client-side

---

## Demo Data

The app comes with 6 story templates:
1. Morning Arrival at School
2. Birthday Party
3. Visit to the Dentist
4. Bedtime Routine
5. Fire Drill at School
6. Lunch in the Cafeteria

---

## Clearing Demo Data

To start fresh, open browser console (F12) and run:
```javascript
localStorage.clear()
```
Then refresh the page.

---

## Known Limitations (Demo Version)

- Photos stored in browser (can fill up storage with many large photos)
- AI stories are pre-written, not truly generated
- No cloud sync - data only on this browser
- No real collaboration features

---

## Building for Production

```bash
npm run build
```

Output will be in `dist/` folder.

---

## Need Help?

This is a demo version for local testing only.
For production deployment with real database and AI:
- See full README.md
- Set up Supabase account
- Get Anthropic API key
- Follow production deployment guide

---

Made with ❤️ for children and families
