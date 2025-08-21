# LinkBold

**LinkBold is a containerized URL shortener with built-in monitoring,
visualization, and alerting powered by Prometheus and Grafana.**

![LinkBold Logo](assets/A_two-dimensional_digital_vector_logo_for_the_serv.png)

------------------------------------------------------------------------

### Team members

-   Mazen Magdy Ahmed Abdelsalam\
-   Mostafa Abd Elrahman Mostafa\
-   Ahmed Khaled AbdelRahman Darwish\
-   Rawan Mohamed Ahmed Elsherbiny\
-   Feryal AbdElMAksoud Hammed AbdElMAksoud

------------------------------------------------------------------------

### Project Overview

The LinkBold project focuses on building a containerized URL shortener
webservice and monitoring its performance.\
The service will be developed using a lightweight web framework
(Flask/Express) with SQLite for storage, containerized with Docker, and
monitored using Prometheus and Grafana.\
The project will enable shortening URLs, redirecting, tracking
performance metrics, and visualizing insights through dashboards and
alerts.

Technologies: **Docker, Docker Compose, Prometheus, Grafana, SQLite,
Flask/Express**

------------------------------------------------------------------------

### Project Objectives

-   Develop a fully functional URL shortener with API endpoints for
    shorten and redirect.\
-   Containerize the application and run it locally with Docker
    Compose.\
-   Instrument the service with Prometheus custom metrics (URL creation,
    redirects, errors, latency).\
-   Build a Grafana dashboard to visualize service health and usage
    trends.\
-   Configure alerts and persistence to ensure reliability.\
-   Document the entire setup and API endpoints.

------------------------------------------------------------------------

### Project Scope

-   **Service Development**: Build a webservice with API endpoints
    (`/shorten`, `/<code>`).\
-   **Containerization**: Package the service with Docker & manage with
    Docker Compose.\
-   **Monitoring**: Add Prometheus metrics and visualize with Grafana
    dashboards.\
-   **Alerting & Persistence**: Configure alerts and enable data
    persistence with Docker volumes.\
-   **Documentation**: Provide API docs and project usage guide.

------------------------------------------------------------------------

### Project Plan

The project will be executed over **4 weeks**.

**Week 1: Service Development & Containerization**\
- Tasks: Build URL shortener, SQLite storage, Dockerfile, docker-compose
setup.\
- Deliverables: Running service container with shorten/redirect
endpoints.

**Week 2: Prometheus Integration**\
- Tasks: Add custom metrics, configure Prometheus scraping.\
- Deliverables: Updated service with `/metrics`, prometheus.yml config.

**Week 3: Grafana Dashboard**\
- Tasks: Integrate Grafana, build custom dashboard (URL counts, latency,
errors).\
- Deliverables: Grafana dashboard with actionable insights.

**Week 4: Alerting & Documentation**\
- Tasks: Configure alerts, add persistence, write README/API docs.\
- Deliverables: Stable stack with persistence, Grafana alerts, project
documentation.
