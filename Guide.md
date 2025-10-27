# 🚀 Node.js + PostgreSQL URL Shortener (WSL Local Setup)

A simple, fully functional **URL shortener** built with **Node.js (Express)** and **PostgreSQL**.  
This guide explains how to install, configure, and run it locally using **WSL (Windows Subsystem for Linux)** — including all solutions to the errors you may encounter.

---

## 🧩 Features

- Shorten long URLs with optional custom codes  
- Redirect users via generated short links  
- Web UI + REST API  
- PostgreSQL database for persistence  
- Easy `.env` configuration  
- Ready for containerization (Dockerfile + Compose included)

---

## 🧱 1. Prerequisites

Make sure you have these installed inside your WSL environment:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nodejs npm postgresql postgresql-contrib unzip
Check versions:

bash
Copy code
node -v
npm -v
psql --version
✅ Expected:

Node.js ≥ 18

npm ≥ 9

PostgreSQL ≥ 14

🗄️ 2. PostgreSQL Setup
Start the PostgreSQL service:

bash
Copy code
sudo service postgresql start
Enter the PostgreSQL shell:

bash
Copy code
sudo -u postgres psql
Create your database and user (one command per line):

sql
Copy code
CREATE DATABASE shortener;
CREATE USER shortuser WITH ENCRYPTED PASSWORD 'shortpass';
GRANT ALL PRIVILEGES ON DATABASE shortener TO shortuser;
\q
📦 3. Project Setup
Move the project from your Windows folder to WSL:

bash
Copy code
cd ~
unzip /mnt/c/Users/<your-username>/Downloads/node-url-shortener.zip -d ~/node-url-shortener
cd ~/node-url-shortener
Install Node dependencies:

bash
Copy code
npm install
Create .env in the project root:

bash
Copy code
nano .env
Paste:

env
Copy code
PORT=5000
BASE_URL=http://localhost:5000
DATABASE_URL=postgres://shortuser:shortpass@localhost:5432/shortener
Save and exit (Ctrl+O, Enter, Ctrl+X).

🚀 4. Verify Database Access
Test your credentials:

bash
Copy code
psql "postgres://shortuser:shortpass@localhost:5432/shortener"
You should see:

makefile
Copy code
shortener=#
If not, reset the password:

bash
Copy code
sudo -u postgres psql
ALTER USER shortuser WITH PASSWORD 'shortpass';
\q
⚙️ 5. Run the App
bash
Copy code
npm start
If everything is correct, you’ll see:

pgsql
Copy code
✅ Database migrated successfully
Server running on port 5000
Then open:
👉 http://localhost:5000

🌐 6. API & Web UI
Shorten a URL (Web Form)
Visit http://localhost:5000 and enter a URL.

List all shortened URLs
Visit http://localhost:5000/admin/list

Shorten via API
bash
Copy code
curl -X POST -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}' \
  http://localhost:5000/shorten
Example Response:

json
Copy code
{
  "short_url": "http://localhost:5000/Ab3X9c",
  "code": "Ab3X9c",
  "target": "https://example.com"
}
🧠 7. Common Errors & Fixes
Error	Cause	Fix
cannot stat '/mnt/c/Users/you/Downloads'	Wrong Windows path	Use your real username, e.g. /mnt/c/Users/akhal/Downloads
SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string	.env not loaded before DB connection	Added dotenv.config() before creating the pg.Pool()
permission denied for schema public	PostgreSQL user lacks privileges	Granted ownership & privileges to shortuser
npm start inside psql (prompt shortener=>)	Ran command in wrong shell	Type \q to exit psql before running Node commands

🧰 8. Database Privileges Fix (if needed)
If you ever see:

Migration failed: permission denied for schema public

Run:

bash
Copy code
sudo -u postgres psql
Then inside psql:

sql
Copy code
\c shortener
ALTER SCHEMA public OWNER TO shortuser;
GRANT ALL PRIVILEGES ON DATABASE shortener TO shortuser;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO shortuser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO shortuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO shortuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO shortuser;
\q
🧾 9. Useful Commands
Task	Command
Start PostgreSQL	sudo service postgresql start
Stop PostgreSQL	sudo service postgresql stop
Restart PostgreSQL	sudo service postgresql restart
Connect to DB	psql -U shortuser -d shortener
Start App	npm start
Stop App	Ctrl + C
Check .env variables	cat .env

🧩 10. Project Structure
pgsql
Copy code
node-url-shortener/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── .env
├── src/
│   ├── index.js
│   ├── db.js
│   ├── utils.js
│   └── migrations/001_create_table.sql
├── views/
│   ├── index.ejs
│   └── list.ejs
└── README.md
✅ 11. Expected Output
On startup:

pgsql
Copy code
✅ Database migrated successfully
Server running on port 5000
Browser:
👉 http://localhost:5000

API:

bash
Copy code
curl -X POST -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}' \
  http://localhost:5000/shorten
Response:

json
Copy code
{"short_url":"http://localhost:5000/Ab3X9c","code":"Ab3X9c","target":"https://example.com"}
📜 License
MIT — Free to use and modify.

👨‍💻 Author
Akhal — DevOps Engineer Practice Project (Node.js + PostgreSQL Version)

yaml
Copy code

---

✅ **Next steps:**
1. Copy everything above.  
2. In WSL, run:
   ```bash
   cd ~/node-url-shortener
   nano README.md
Paste and save (Ctrl + O, Enter, Ctrl + X).