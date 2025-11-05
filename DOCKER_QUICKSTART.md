# 🚀 Quantus Telemetry - Docker Quick Start

## Running with Docker Compose

### Architecture Selection

Choose the appropriate docker-compose file for your system:

**For x86-64/AMD64 Linux:**
```bash
docker compose -f docker-compose.x86.yml up --build
```

**For ARM64/Apple Silicon (M1/M2/M3):**
```bash
docker compose -f docker-compose.arm64.yml up --build
```

**Default (uses docker-compose.yml = ARM64 config):**
```bash
docker compose up --build
```

This command will:
- Build images for frontend and backend
- Start all 3 services
- Frontend will be available at: **http://localhost:3000**

### Running in Background

```bash
docker compose -f docker-compose.arm64.yml up -d --build
# or for x86-64:
docker compose -f docker-compose.x86.yml up -d --build
```

### View Logs

```bash
# All logs
docker compose logs -f

# Frontend only
docker compose logs -f telemetry-frontend

# Backend only
docker compose logs -f telemetry-backend-core
docker compose logs -f telemetry-backend-shard
```

### Stop Services

```bash
docker compose down
```

### Stop and Remove Volumes

```bash
docker compose down -v
```

## 📦 Services

Docker Compose runs 3 containers:

| Service | Port | Description |
|---------|------|-------------|
| **telemetry-frontend** | 3000 | Frontend with Quantus branding (Nginx) |
| **telemetry-backend-core** | 8000 | Core backend (WebSocket feed) |
| **telemetry-backend-shard** | 8001 | Shard backend (collects data from nodes) |

## 🔧 Configuration

### Change WebSocket URL

To change the backend URL, edit in your `docker-compose.yml`:

```yaml
services:
  telemetry-frontend:
    environment:
      SUBSTRATE_TELEMETRY_URL: ws://localhost:8000/feed  # ← change here
```

### Build Single Service

```bash
# Frontend only
docker compose build telemetry-frontend

# Backend only
docker compose build telemetry-backend-core
```

## 🍎 Mac Apple Silicon (M1/M2/M3)

**Important:** This project includes a fix for Apple Silicon!

Backend is automatically built for `linux/amd64` platform in `docker-compose.arm64.yml`:
```yaml
platform: linux/amd64
```

If you still experience backend restart issues (error 133), ensure:
1. Docker Desktop is up to date
2. Rosetta 2 is installed: `softwareupdate --install-rosetta`
3. In Docker Desktop Settings → Features → "Use Rosetta for x86_64/amd64 emulation" is enabled

## 🐛 Troubleshooting

### Problem: Port is Already in Use

If port 3000, 8000, or 8001 is occupied, change in your `docker-compose.yml`:

```yaml
ports:
  - "3001:8000"  # change first number (host port)
```

### Problem: Build Fails

```bash
# Clean everything and rebuild
docker compose down -v
docker system prune -af
docker compose up --build
```

### Problem: Frontend Shows "Waiting for telemetry..."

This is normal! You need to connect a Substrate/Polkadot node with the flag:

```bash
# Example for Polkadot node
./polkadot \
  --telemetry-url 'ws://localhost:8001/submit 0' \
  --chain polkadot
```

## 📝 Notes

- **First build** may take 10-20 minutes (especially Rust backend)
- Backend requires significant RAM during build (minimum 4GB)
- Frontend uses **Node 18** for building
- Backend uses **Rust 1.88.0**

## 🔗 Links

- Frontend: http://localhost:3000
- Backend Core WebSocket: ws://localhost:8000/feed
- Backend Shard (for nodes): ws://localhost:8001/submit
- Prometheus Metrics: http://localhost:8000/metrics

## 🎨 Quantus Branding

Frontend includes complete Quantus rebranding:
- ✅ Quantus Logo
- ✅ Quantus colors and gradients
- ✅ Prompt font
- ✅ Modern UI with glassmorphism

Enjoy! 🎉

