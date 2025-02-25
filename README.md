# urlShortener

# URL Shortener Service 🚀

A simple URL shortening service with advanced analytics, Google authentication, and Redis caching. Dockerized for easy deployment.


## Features ✨

- 🔑 Google OAuth 2.0 Authentication
- 🔗 URL shortening with custom aliases
- 📊 Detailed analytics (clicks, devices, OS, locations)
- 🗂️ URL grouping by topics
- ⚡ Redis caching for fast redirects
- 🐳 Docker containerization
- 📈 Rate limiting (100 requests/hour)
- 📚 Swagger API documentation

## Tech Stack 🛠️

- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Cache**: Redis
- **Auth**: Google OAuth 2.0
- **Analytics**: GeoIP, User Agent parsing
- **Deployment**: Docker, AWS

## Installation 💻

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Google OAuth credentials
- Redis server

```bash
# Clone repository
git clone https://github.com/abhitachi/urlShortener.git
cd urlShortener

# Create .env file
cp .env .env

# docker hub repository
https://hub.docker.com/r/abhitachi/urlshortener
