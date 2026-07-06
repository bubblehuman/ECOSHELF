<!-- Need Provider Project Update v2.1 -->
# 🌿 Need Provider

**Smart, localized marketplace bridging retail surplus and community need.**

Eco Shelf connects local businesses with surplus inventory (groceries, restaurants, furniture, hotels) to NGOs and community buyers — reducing waste and rescuing resources before they expire.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Pages & Routing** | [Astro](https://astro.build) (SSG) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) — Neo-Brutalism theme |
| **Interactivity** | [Alpine.js](https://alpinejs.dev) (CDN) |
| **Backend API** | Node.js with [Express.js](https://expressjs.com) |
| **Database** | [PostgreSQL 16](https://www.postgresql.org) (Dockerized) |
| **Authentication** | Custom JWT + Bcrypt password hashing |

---

## 📁 Project Structure

```
ECOSHELF/
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json            # Frontend package details
├── docker-compose.yml      # Local PostgreSQL configuration
├── supabase/
│   ├── schema.sql          # Original Supabase schema (for reference)
│   └── schema-local.sql    # Local PostgreSQL schema (adapted)
├── server/                 # Express.js REST API
│   ├── package.json
│   ├── index.js            # Server entrypoint
│   ├── db.js               # pg Pool connection
│   ├── middleware/
│   │   └── auth.js         # JWT auth middleware
│   └── routes/
│       ├── auth.js         # Auth routes (signup, login, me)
│       ├── profiles.js     # User profiles CRUD
│       └── listings.js     # Marketplace listings CRUD & claiming
├── public/
│   └── favicon.svg
├── src/
│   ├── styles/
│   │   └── global.css      # Tailwind + Neo-Brutalism tokens
│   ├── layouts/
│   │   └── Layout.astro    # Base layout & API fetch wrapper
│   └── pages/
│       ├── index.astro     # Landing page
│       ├── auth.astro      # Login / Register
│       ├── browse.astro    # Marketplace feed
│       └── dashboard.astro # Retailer / NGO dashboard
```

---

## 🚀 Getting Started (How to Run Locally)

Follow these steps to set up and run the project on your machine.

### Prerequisites & Installation Guide

This project requires **Node.js** (v18+) and either **Docker** (recommended) or a local **PostgreSQL** installation.

#### 1. Installing Node.js
If you don't have Node.js installed, we recommend using [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm):
*   **Linux/macOS:**
    ```bash
    curl -fsSL https://fnm.vercel.app/install | bash
    # Restart your shell, then install node:
    fnm install --lts
    ```
*   **Windows:** Use the installer from the [Node.js Official Website](https://nodejs.org/).

#### 2. Option A: Running with Docker (Recommended)
Docker runs PostgreSQL automatically in a container without manual system setup.
*   **Fedora/RHEL:**
    ```bash
    sudo dnf install dnf-plugins-core -y
    sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
    sudo dnf install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
    sudo systemctl enable --now docker
    sudo usermod -aG docker $USER # Logout and log back in for changes to apply
    ```
*   **Ubuntu/Debian:**
    ```bash
    sudo apt update
    sudo apt install docker.io docker-compose-v2 -y
    sudo systemctl enable --now docker
    sudo usermod -aG docker $USER # Logout and log back in
    ```
*   **macOS / Windows:** Install [Docker Desktop](https://www.docker.com/products/docker-desktop/).

#### 3. Option B: Running with a Bare-metal PostgreSQL (Alternative)
If you prefer not to use Docker and install PostgreSQL directly on your host:
*   **Fedora:**
    ```bash
    sudo dnf install postgresql-server postgresql-contrib -y
    sudo postgresql-setup --initdb
    sudo systemctl enable --now postgresql
    ```
*   **Ubuntu/Debian:**
    ```bash
    sudo apt update
    sudo apt install postgresql postgresql-contrib -y
    sudo systemctl enable --now postgresql
    ```
*   **Create Local Database & User:**
    1. Open the postgres console: `sudo -u postgres psql`
    2. Create user, set password, and create database:
       ```sql
       CREATE USER ecoshelf_user WITH PASSWORD 'ecoshelf_dev_pass';
       CREATE DATABASE ecoshelf OWNER ecoshelf_user;
       \q
       ```
    3. Import the local schema:
       ```bash
       psql -U ecoshelf_user -d ecoshelf -h localhost -f supabase/schema-local.sql
       ```

---

### 1. Setup the Database

Spin up the local PostgreSQL database using Docker Compose. On systems with SELinux (like Fedora), the `:z` flag is automatically configured to handle file permissions.

```bash
docker compose up -d
```

*Note: This automatically initializes the database schema from `supabase/schema-local.sql` on the first run.*

---

### 2. Configure Environment Variables

The backend relies on the configuration inside `server/.env`. By default, it comes preconfigured with:

```env
DATABASE_URL=postgresql://ecoshelf_user:ecoshelf_dev_pass@localhost:5432/ecoshelf
JWT_SECRET=ecoshelf-dev-jwt-secret-change-me-in-production
PORT=3001
CORS_ORIGIN=http://localhost:4321
```

---

### 3. Start the Backend API

Install backend dependencies and start the API server:

```bash
cd server
npm install
npm run dev # Runs server at http://localhost:3001
```

---

### 4. Start the Frontend (Astro)

In a new terminal window, return to the root folder, install the frontend dependencies, and start the development server:

```bash
cd ..
npm install
npm run dev # Runs app at http://localhost:4321
```

Open [http://localhost:4321](http://localhost:4321) in your browser to interact with the application.

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
