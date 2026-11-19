# 🚀 Deployment Guide - Anti-Cheating Exam System

This guide provides step-by-step instructions to deploy the full **Anti-Cheating Examination System** to production.

---

## 📋 Architecture & Prerequisites

- **Frontend**: React 18 + Vite (Client SPA)
- **Backend**: Node.js + Express (REST API)
- **Database**: MongoDB (MongoDB Atlas cloud or self-hosted)
- **File Storage**: User profile pictures stored in `/server/uploads/profile`

---

## 🌐 Deployment Options

Choose the deployment method that fits your needs:

| Option | Best For | Cost | Difficulty |
| :--- | :--- | :--- | :--- |
| **[Method 1: Unified Cloud (Render)](#method-1-unified-monorepo-on-render-recommended)** | Fastest 1-click cloud deploy (Frontend + Backend in 1 service) | Free | ⭐ Easy |
| **[Method 2: Separated Cloud (Vercel + Render)](#method-2-separated-frontend-on-vercel--backend-on-render)** | High performance CDN frontend + dedicated API | Free | ⭐⭐ Medium |
| **[Method 3: Docker & Docker Compose](#method-3-docker--docker-compose-production--vps)** | Self-hosted VPS, DigitalOcean, AWS, local server | Server cost | ⭐ Easy |
| **[Method 4: Ubuntu Linux VPS (PM2 + Nginx)](#method-4-traditional-linux-vps-pm2--nginx)** | Traditional custom server with custom domain & SSL | Server cost | ⭐⭐⭐ Advanced |

---

## 🗄️ Step 0: Set Up Free Cloud MongoDB (Atlas)
*(Required for Method 1 and Method 2)*

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free account.
2. Create a free **M0 Sandbox** cluster.
3. In **Database Access**, create a database user (e.g., `exam_admin`) and password.
4. In **Network Access**, click **Add IP Address** -> Choose **Allow Access from Anywhere** (`0.0.0.0/0`).
5. Click **Connect** -> **Connect your application** (Drivers) and copy the URI string:
   ```
   mongodb+srv://exam_admin:<password>@cluster0.xxxxx.mongodb.net/onlineexam?retryWrites=true&w=majority
   ```

---

## Method 1: Unified Monorepo on Render (Recommended)
*Deploys Frontend & Backend together under a single domain. Zero CORS issues!*

1. Push your repository to **GitHub** or **GitLab**.
2. Sign in to [Render.com](https://render.com) and click **New +** -> **Web Service**.
3. Select your GitHub repository.
4. Fill in the deployment settings:
   - **Name**: `anti-cheating-exam`
   - **Environment**: `Node`
   - **Region**: Nearest to your users
   - **Branch**: `main`
   - **Root Directory**: *(Leave empty)*
   - **Build Command**:
     ```bash
     npm run install:all && npm run build
     ```
   - **Start Command**:
     ```bash
     npm start
     ```
5. In **Environment Variables**, add:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `MONGODB_URI` = *(Your MongoDB Atlas connection URI)*
   - `JWT_SECRET` = *(Any secure 32+ character random string)*
   - *(Optional for OTP/Email)*:
     - `EMAIL_USER` = `your-gmail@gmail.com`
     - `EMAIL_PASS` = `your-gmail-app-password`
6. Click **Create Web Service**.
7. Render will build both client and server and launch the app at `https://your-app.onrender.com`.

---

## Method 2: Separated (Frontend on Vercel + Backend on Render)

### 2A. Deploy Backend on Render
1. In Render, create a **Web Service**.
2. Settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
3. Environment Variables:
   - `PORT` = `5000`
   - `MONGODB_URI` = *(Your MongoDB Atlas connection URI)*
   - `JWT_SECRET` = *(Your secret key)*
4. Copy your backend URL once deployed: `https://your-backend.onrender.com`

### 2B. Deploy Frontend on Vercel
1. Go to [Vercel](https://vercel.com) -> **Add New** -> **Project**.
2. Select your repository.
3. Configure settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
4. In **Environment Variables**:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api`
5. Click **Deploy**. Vercel will build the frontend with SPA route rewrites configured automatically via `client/vercel.json`.

---

## Method 3: Docker & Docker Compose (Production / VPS)

If you have Docker and Docker Compose installed on your machine or VPS:

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd Anti_Cheating_System-main
   ```
2. Start the entire stack (MongoDB + Node API + Built Frontend):
   ```bash
   docker compose up -d --build
   ```
3. Check running status:
   ```bash
   docker compose ps
   ```
4. Access the application in your browser:
   ```
   http://localhost:5000
   ```
   *(Or `http://your-server-ip:5000` on a cloud VPS)*.

To view logs:
```bash
docker compose logs -f app
```
To stop the stack:
```bash
docker compose down
```

---

## Method 4: Traditional Linux VPS (PM2 + Nginx)

For Ubuntu 22.04 / 24.04 LTS:

### 1. Install Node.js, MongoDB & PM2
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx git
sudo npm install -g pm2
```

### 2. Setup Project
```bash
cd /var/www
git clone <your-repo-url> anticheat
cd anticheat

# Install dependencies and build frontend
npm run install:all
npm run build

# Setup production environment
cp server/.env.example server/.env
nano server/.env  # Enter your MONGODB_URI and JWT_SECRET
```

### 3. Start Backend with PM2
```bash
pm2 start server/index.js --name "anticheat-api"
pm2 save
pm2 startup
```

### 4. Configure Nginx Reverse Proxy
Create `/etc/nginx/sites-available/anticheat`:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Enable the site and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/anticheat /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Install SSL Certificate (HTTPS)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

---

## 🔑 Default Accounts (Initial Seed)

When the server starts with an empty database, it automatically seeds the initial Super Admin:
- **Email**: `superadmin1@gmail.com`
- **Password**: `superadmin`
- **Role**: `superadmin`

> ⚠️ **Important Security Note**: After your initial login in production, navigate to your Profile or Admin page and update the default password immediately!
