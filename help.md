🧭 LinkBOLD URL Shortener — Docker Setup Guide

A simple and modern URL shortener built with Node.js (Express) and PostgreSQL, fully containerized using Docker Compose.
This guide helps you (and your teammates) run the project from scratch — no manual setup required.

🧱 1. Prerequisites

Make sure you have these installed:

Docker Desktop (with WSL 2 integration enabled)
👉 https://www.docker.com/products/docker-desktop

Git

WSL 2 (e.g. Ubuntu 22.04)

Ports 5000 (for app) and 5432 (for Postgres) must be free.

📦 2. Clone the Repository
git clone https://github.com/<your-org>/linkbold-url-shortener.git
cd linkbold-url-shortener

⚙️ 3. Project Structure Overview
linkbold-url-shortener/
│
├── docker-compose.yml       # Compose setup for app + database
├── Dockerfile               # Node.js app container
├── .env                     # Environment variables
├── src/
│   ├── index.js             # Express app entry point
│   ├── db.js                # PostgreSQL connection pool
│   ├── migrate.js           # Auto table creation
│   ├── utils.js             # Random code generator
│   └── ...
├── views/                   # EJS templates (UI)
├── public/                  # Static assets (logo, CSS)
└── HELP.md                  # This file

⚙️ 4. Environment Variables

All configuration is handled in .env.

Example:

# Server
PORT=5000
BASE_URL=http://linkbold:5000

# Database (inside Docker)
DATABASE_URL=postgres://shortuser:shortpass@postgres:5432/shortener

# Optional
NODE_ENV=production


⚠️ The hostname must remain postgres because it matches the service name in docker-compose.yml.

🐳 5. Running in WSL 2 with Docker Desktop

Recommended setup for Windows developers

Docker Desktop for Windows provides a full Linux Docker Engine through WSL 2 integration —
you run all commands inside your WSL terminal while Docker Desktop hosts the actual engine.

🧱 1️⃣ Install Docker Desktop on Windows

Download and install from 👉 https://www.docker.com/products/docker-desktop

⚙️ 2️⃣ Enable WSL Integration

Open Docker Desktop → Settings → Resources → WSL Integration

Toggle ON your WSL distro (e.g. Ubuntu-22.04)

Click Apply & Restart

Now open your Ubuntu (WSL) terminal and verify:

docker --version
docker compose version


Both should print valid version numbers.

If you see “Cannot connect to the Docker daemon”, re-open Docker Desktop and ensure your distro is toggled ON.

🪟 3️⃣ Project Workflow in WSL

Inside your WSL terminal:

cd ~/linkbold-url-shortener
cp .env.example .env        # or edit .env manually
sudo service postgresql stop   # optional, frees port 5432
sudo docker compose up --build


Docker Desktop handles everything — you just use Docker normally in WSL.

🌐 4️⃣ Access the App from Windows

Since the Node.js app binds to 0.0.0.0, you can open:

http://localhost:5000
 ← always works

http://linkbold:5000
 ← works if you add

127.0.0.1 linkbold


to your Windows hosts file:
C:\Windows\System32\drivers\etc\hosts

🧩 5️⃣ Advanced Option (Without Docker Desktop)

You can install Docker Engine manually inside WSL:

sudo apt install docker-ce
sudo service docker start


…but this method is not recommended for team environments because:

You must manage the daemon manually

File-sharing with Windows is slower

No GUI tools or automatic updates

✅ Preferred: Docker Desktop + WSL Integration.

✅ 6. Expected Logs

If successful, you’ll see:

linkbold-db   | database system is ready to accept connections
linkbold-app  | ✅ Database connected successfully
linkbold-app  | ✅ Migration completed: short_urls table is ready
linkbold-app  | ✅ Database ready & server running on port 5000

🌐 7. Access the App

Open in your browser:
👉 http://localhost:5000

🧩 8. Database Management (Optional)

To connect to PostgreSQL inside the container:

sudo docker exec -it linkbold-db psql -U shortuser -d shortener


Useful commands:

\dt                 -- list tables
SELECT * FROM short_urls;

🔁 9. Rebuilding from Scratch

To reset containers and the database volume:

sudo docker compose down -v
sudo docker compose up --build

🧰 10. Troubleshooting
Issue	Solution
DB error on UI	Table not created → restart containers to trigger migration
connect ECONNREFUSED	DB not ready → wait 5–10s or rebuild
address already in use :5432	Stop local Postgres: sudo service postgresql stop
pg_isready: not found	Safe to ignore; handled by app startup
🧹 11. Stopping Containers

Stop running containers:

sudo docker compose down


To also remove database volume:

sudo docker compose down -v