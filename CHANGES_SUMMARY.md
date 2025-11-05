# Quantus Telemetry - Changes Summary

## What Was Done

This repository is a complete rebrand of [Parity's Substrate Telemetry](https://github.com/paritytech/substrate-telemetry) for Quantus Network.

### Branding Changes

#### Visual Identity
- ✅ Replaced Polkadot branding with Quantus branding
- ✅ Added Quantus logo and brand name in header
- ✅ Applied Quantus color scheme (pink, blue, yellow gradients)
- ✅ Changed font from Roboto to Prompt (Quantus brand font)
- ✅ Updated favicon to Quantus logo

#### Colors & Design
- Background: `#0c1014` (Quantus dark)
- Primary Pink: `#ed4cce`
- Primary Blue: `#0000ff`
- Dark Blue: `#1f1fa3`
- Yellow: `#ffe91f`
- Modern glassmorphism UI effects
- Subtle gradients (refined from initial aggressive version)
- Lighter font weights for elegance

#### Code Changes
- Updated GitHub links to point to `Quantus-Network/chain-telemetry`
- Changed package name to `@quantus/telemetry-frontend`
- Updated page title to "Quantus Telemetry"
- All code and comments in English (no Polish text)

### Docker Configuration

#### Three Docker Compose Files
1. **docker-compose.yml** - Default (ARM64/Apple Silicon)
2. **docker-compose.arm64.yml** - Explicit ARM64/Apple Silicon config
3. **docker-compose.x86.yml** - Native x86-64 Linux config

**Why?** The Rust backend uses Parity's x86-64 only Docker image. ARM systems need `platform: linux/amd64` for Rosetta 2 emulation.

### Documentation

All documentation is in English:
- ✅ `DOCKER_QUICKSTART.md` - Quick start guide
- ✅ `DOCKER_COMPOSE_README.md` - Docker compose files explanation
- ✅ `QUANTUS_REBRAND.md` - Complete rebrand documentation
- ✅ `README.md` - Updated with Quantus information
- ✅ `CHANGES_SUMMARY.md` - This file

### Technical Details

#### Frontend Changes
- 23 CSS files updated with Quantus styling
- 2 TypeScript/TSX files updated (Header, Chains)
- Font import from Google Fonts (Prompt family)
- CSS variables for theme management
- Responsive design maintained

#### Backend
- No code changes (works as-is)
- Docker configuration adjusted for multi-architecture support

#### Assets
- Quantus logo SVG added
- Favicon updated to Quantus logo

### What Works

✅ All original Substrate Telemetry functionality preserved:
- Real-time node monitoring
- Chain statistics
- Geographic map view
- Settings customization
- Node filtering and sorting
- Multiple chain support
- WebSocket communication

✅ Docker deployment:
- Works on Apple Silicon (M1/M2/M3)
- Works on x86-64 Linux
- Three-tier architecture (frontend, core, shard)

### How to Use

**Quick Start (Apple Silicon):**
```bash
docker compose up --build
# Access at http://localhost:3000
```

**Quick Start (x86-64 Linux):**
```bash
docker compose -f docker-compose.x86.yml up --build
# Access at http://localhost:3000
```

### Repository Structure

```
chain-telemetry/
├── backend/              # Rust backend (telemetry_core, telemetry_shard)
├── frontend/             # React/TypeScript frontend with Quantus branding
├── docker-compose.yml    # Default Docker config (ARM64)
├── docker-compose.arm64.yml  # Explicit ARM64 config
├── docker-compose.x86.yml    # x86-64 config
├── QUANTUS_REBRAND.md    # Rebrand documentation
├── DOCKER_QUICKSTART.md  # Docker quick start
├── DOCKER_COMPOSE_README.md  # Docker compose explanation
└── README.md             # Main readme
```

### Credits

- **Original Project:** [Substrate Telemetry](https://github.com/paritytech/substrate-telemetry) by Parity Technologies
- **Quantus Rebrand:** Quantus Network Team
- **License:** GPL-3.0 (maintained from original)

### Links

- Quantus Network: https://github.com/Quantus-Network
- This Fork: https://github.com/Quantus-Network/chain-telemetry
- Original Project: https://github.com/paritytech/substrate-telemetry

