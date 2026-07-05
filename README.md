# 🌿 Eco Shelf

**Smart, localized marketplace bridging retail surplus and community need.**

Eco Shelf connects local businesses with surplus inventory (groceries, restaurants, furniture, hotels) to NGOs and community buyers — reducing waste and rescuing resources before they expire.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Pages & Routing** | [Astro](https://astro.build) (SSG) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) — Neo-Brutalism theme |
| **Interactivity** | [Alpine.js](https://alpinejs.dev) (CDN) |
| **Backend** | [Supabase](https://supabase.com) (Auth + Postgres + RLS) |
| **Deploy** | Netlify / Vercel (Static) |

---

## 📁 Project Structure

```
ECOSHELF/
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
├── supabase/
│   └── schema.sql          # SQL schema + RLS policies
├── public/
│   └── favicon.svg
├── src/
│   ├── styles/
│   │   └── global.css      # Tailwind + Neo-Brutalism tokens
│   ├── layouts/
│   │   └── Layout.astro    # Base layout, navbar, footer
│   └── pages/
│       ├── index.astro     # Landing page
│       ├── auth.astro      # Login / Register
│       ├── browse.astro    # Marketplace feed
│       └── dashboard.astro # Retailer / NGO dashboard
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a [Supabase](https://supabase.com) project.
2. Run the SQL in `supabase/schema.sql` in the Supabase SQL Editor.
3. Update `src/layouts/Layout.astro` with your **Supabase URL** and **Anon Key**:

```js
window.SUPABASE_URL = 'https://your-project.supabase.co';
window.SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### 3. Start development server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

---

## 📄 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — hero, live counters, category grid |
| `/auth` | Login & registration (Retailer / NGO) |
| `/browse` | Marketplace feed with category filters & claim flow |
| `/dashboard` | Split dashboard — listing form (retailers) / claimed rescues (NGOs) |

---

## 🎨 Design System: Neo-Brutalism

- **Thick black borders**: `border-4 border-black`
- **Harsh drop shadows**: `shadow-[6px_6px_0px_#000]`
- **Vibrant accents**: Lime `#ADFF2F`, Yellow `#FFD700`, Orange `#FF6B35`, Pink `#FF6EC7`, Cyan `#7DF9FF`
- **Interactive hover shifts**: `hover:translate-x-[2px] hover:translate-y-[2px]` and custom keyframes (`animate-wobble`, `animate-bounceIn`)
- **Page Transitions**: Fullscreen colored radial wipe from the clicked button.
- **Story-driven Comics**: Homepage is structured as comic panels with speech bubbles and cartoon-style layout.
- **Font**: Space Grotesk (Google Fonts) with thick `-webkit-text-stroke` styling on headings.

---

## 📜 License

MIT