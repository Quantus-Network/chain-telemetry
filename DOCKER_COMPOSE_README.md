# Docker Compose Files

This project includes three docker-compose configuration files:

## Files Overview

### 1. `docker-compose.yml` (Default - ARM64)
- **For:** ARM64/Apple Silicon (M1/M2/M3) systems
- **Usage:** `docker compose up --build`
- **Platform:** Automatically uses `linux/amd64` emulation for backend (via Rosetta 2)

### 2. `docker-compose.arm64.yml`
- **For:** ARM64/Apple Silicon (M1/M2/M3) systems
- **Usage:** `docker compose -f docker-compose.arm64.yml up --build`
- **Platform:** Same as default, explicitly named for clarity
- **Note:** Backend uses `platform: linux/amd64` for compatibility

### 3. `docker-compose.x86.yml`
- **For:** x86-64/AMD64 Linux systems
- **Usage:** `docker compose -f docker-compose.x86.yml up --build`
- **Platform:** Native x86-64, no emulation required

## Why Different Files?

The Rust backend is built using Parity's `ci-unified` Docker image which is x86-64 only. On ARM systems (Apple Silicon), we need to specify `platform: linux/amd64` to enable Rosetta 2 emulation. On native x86-64 systems, this isn't needed and may actually cause issues.

## Quick Start

**Apple Silicon (M1/M2/M3):**
```bash
docker compose up --build
# or explicitly:
docker compose -f docker-compose.arm64.yml up --build
```

**x86-64 Linux:**
```bash
docker compose -f docker-compose.x86.yml up --build
```

## Services

All configurations run three services:
- **telemetry-frontend** (port 3000) - Quantus branded UI
- **telemetry-backend-core** (port 8000) - WebSocket feed server
- **telemetry-backend-shard** (port 8001) - Node data collection

## More Information

See [DOCKER_QUICKSTART.md](./DOCKER_QUICKSTART.md) for detailed instructions.

