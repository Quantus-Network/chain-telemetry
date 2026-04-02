# Quantus Rebranding - Chain Telemetry Dashboard

## Overview
This document outlines the rebranding changes made to transform the Substrate/Polkadot Telemetry dashboard into the Quantus Telemetry dashboard, updated to match the current Quantus brand identity from [quantus.com](https://quantus.com).

## Changes Made

### 1. Brand Colors & Theme
**Color Palette:**
- Primary Background: `#0E0E0E` (Quantus near-black)
- Surface: `#1A1A1A` (elevated panels, cards, tooltips)
- Surface Elevated: `#252525` (secondary surfaces)
- Primary Orange: `#FF6B35` (Quantus brand orange)
- Light Orange: `#FF8C5A` (hover states, secondary accents)
- Dark Orange: `#CC5529` (deep accents, gradient anchors)
- Text Primary: `#F5F5F5`
- Text Secondary: `#999999`

**Gradients:**
- Primary Gradient: Dark Orange → Orange → Light Orange
- Secondary Gradient: Orange → Light Orange
- Accent Gradient: Dark Orange → Orange → Light Orange (wider angle)

### 2. Typography
- Font Family: **Prompt** (from Google Fonts)
- Replaced all instances of Roboto, Helvetica, Arial with Prompt
- Updated font weights to match Quantus style

### 3. Component Updates

#### Core Files
- `frontend/src/index.css` - Quantus CSS variables (orange palette) and Google Fonts import
- `frontend/src/App.css` - Updated font family and colors
- `frontend/assets/index.html` - Title "Quantus Telemetry", theme-color `#0E0E0E`

#### Components Updated
- **Chains.css** - Top bar with Quantus orange gradient, modernized tab styles
- **Header.css** - Subtle dark-to-orange translucent gradient background, updated logo container
- **Header.tsx** - New Quantus logo (`quantus-logo-n.svg`) and "Quantus Telemetry" branding text
- **Chain.css** - Content background using `--color-bg-primary`
- **Tab.css** - Orange gradient active states, orange-tinted hover
- **AllChains.css** - Dark glassmorphism panels, orange hover/selection states
- **Stats.css** - Dark surface cards with subtle borders
- **Tile.css** - Orange accent icon borders
- **Filter.css** - Dark glassmorphism popup
- **List/Row.css** - Orange pinned/hover highlights
- **List/THead.css** - Dark headers with orange sort indicators
- **Map/Location.css** - Orange synced-node glow, orange ping animation
- **Settings/Setting.css** - Toggle switches with orange gradient
- **Tooltip.css** - Dark glassmorphism tooltips with backdrop blur
- **OfflineIndicator.css** - Status colors (functional red/green preserved)

### 4. Assets
- Logo (header): `frontend/assets/quantus-logo-n.svg` (solid orange `#FF6B35` mark on dark `#0E0E0E`, matches quantus.com)
- Legacy logo: `frontend/assets/quantus-logo.svg` (Q mark with orange gradients)
- Favicon source: `frontend/assets/favicon.svg`; production HTML uses `/quantus-favicon.svg` so browsers fetch a fresh tab icon (many ignore `?v=` on favicons). `/favicon.svg` is still emitted as a copy for direct links and defaults.

### 5. Package Information
- Updated `frontend/package.json`:
  - Name: `@quantus/telemetry-frontend`
  - Author: `Quantus`
  - Description: "Quantus Telemetry frontend - Fork of Substrate Telemetry"

### 6. Documentation
- Updated `README.md` title and overview to reflect Quantus branding

## Design Features

### Modern UI Elements
1. **Glassmorphism** - Semi-transparent dark surfaces (`rgba(26, 26, 26, 0.97)`) with backdrop blur
2. **Smooth Transitions** - 0.2s ease transitions on interactive elements
3. **Enhanced Shadows** - Deep shadows on dark surfaces
4. **Rounded Corners** - 6-8px border radius on panels and cards
5. **Orange Accents** - Strategic use of Quantus orange throughout
6. **Hover States** - Orange glow effects on hover
7. **Visual Hierarchy** - High contrast text on near-black backgrounds

### Branding Integration
- Logo displayed prominently in header with glassmorphic container
- "Quantus Telemetry" text next to logo
- Consistent orange-on-dark color scheme across all components
- Orange gradient overlays on active/sorted UI elements
- Signature Quantus orange (`#FF6B35`) for active states and highlights

## Technical Improvements
- CSS Custom Properties (CSS Variables) for easy theme management
- Modern CSS features (backdrop-filter, gradients)
- Consistent spacing and sizing
- Neutral dark surfaces replacing the old blue-tinted grays

## Preserved Functionality
All original functionality of the Substrate Telemetry dashboard has been preserved:
- Chain switching
- Node statistics
- Map view
- Settings panel
- Filtering
- Sorting
- Real-time updates

## Brand Evolution
The visual identity was updated from the original pink/blue/yellow multi-color palette to a clean, minimal **orange-on-black** scheme aligned with the current Quantus brand at [quantus.com](https://quantus.com):
- Old: Pink (`#ed4cce`) + Blue (`#0000ff`) + Yellow (`#ffe91f`) on dark blue-black (`#0c1014`)
- New: Orange (`#FF6B35`) on near-black (`#0E0E0E`) -- cleaner, more focused identity

## Credits
Original Substrate Telemetry by Parity Technologies
Quantus Rebranding by Quantus Team
