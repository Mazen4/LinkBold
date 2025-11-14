# LinkBold

![LinkBold Logo](https://github.com/Mazen4/LinkBold/blob/main/assets/A_two-dimensional_digital_vector_logo_for_the_serv.png?raw=true)

LinkBold is a containerized URL shortener with built-in monitoring, visualization, and alerting. This project was built to satisfy all requirements of a 4-week DevOps challenge, from initial development to a fully persistent and monitored production-ready stack.

---

## 🛠️ Technology Stack

This project uses a modern, container-based architecture:

* **Application:** Node.js, Express
* **Database:** PostgreSQL
* **Containerization:** Docker, Docker Compose
* **Metrics Collection:** Prometheus
* **Visualization & Alerting:** Grafana

---

## ✨ Features

* **URL Shortener:** Core API for shortening URLs and handling redirects.
* **Custom Prometheus Metrics:**
  * `linkbold_urls_shortened_total`
  * `linkbold_redirects_total`
  * `linkbold_not_found_total`
  * `linkbold_request_latency_seconds`
* **Grafana Dashboard:** Real-time visualization of redirects, errors, and latency.
* **Proactive Alerting:** Grafana alert triggers when 404 errors exceed threshold.
* **Persistence:** Docker named volumes (`pgdata`, `prometheus_data`, `grafana_data`) preserve all data.

---

## 🚀 How to Run (Local or EC2)

This stack runs on any machine with Docker and Docker Compose.

### 1. Prerequisites
* Git
* Docker
* Docker Compose

### 2. Clone the Repository

```bash
git clone https://github.com/Mazen4/LinkBold.git
cd LinkBold
```

### 3. Launch the Stack

This builds the app image and starts all services. Named volumes are created automatically.

```bash
sudo docker compose up -d --build
```

### 4. Stopping

Stop containers only (data persists):

```bash
sudo docker compose down
```

---

## 🖥️ Accessing the Services

| Service       | URL (replace `<YOUR_IP>`)           | Purpose                                   |
|--------------|--------------------------------------|-------------------------------------------|
| LinkBold App | http://<YOUR_IP>:5000             | URL shortener web UI                     |
| Grafana      | http://<YOUR_IP>:3000             | Visualization dashboard (admin, admin)    |
| Prometheus   | http://<YOUR_IP>:9090             | Metrics interface                         |

---

## 📖 API Documentation

### 1. Create a Short URL

**Endpoint:** `/shorten`  
**Method:** `POST`  
**Description:** Creates a new short link.

**Request Body (JSON):**

```json
{
  "url": "https://www.google.com",
  "custom": "my-google-link"
}
```

`url`: required, the original link  
`custom`: optional, custom code  

**Success Response (201):**

```json
{
  "short_url": "http://<YOUR_IP>:5000/my-google-link",
  "code": "my-google-link",
  "target": "https://www.google.com"
}
```

**Error Response (409):**  
Returned when the custom code already exists.

---

### 2. Redirect to Long URL

**Endpoint:** `/:code`  
**Method:** `GET`  

Redirects to the original URL with HTTP 302.  
If not found, returns **404**.

Example:  
Accessing  
`http://<YOUR_IP>:5000/my-google-link`  
redirects to  
`https://www.google.com`.

---

## 👥 Team Members

* Mazen Magdy Ahmed Abdelsalam
* Mostafa Abd Elrahman Mostafa
* Ahmed Khaled AbdelRahman Darwish
* Rawan Mohamed Ahmed Elsherbiny
* Feryal AbdElMaksoud Hammed AbdElMaksoud
