# Quantus Rebranding - Chain Telemetry Dashboard

## Overview
This document outlines the rebranding changes made to transform the Substrate/Polkadot Telemetry dashboard into the Quantus Telemetry dashboard.

## Changes Made

### 1. Brand Colors & Theme
**Color Palette:**
- Primary Background: `#0c1014` (Quantus dark blue-black)
- Primary Pink: `#ed4cce`
- Primary Blue: `#0000ff`
- Dark Blue: `#1f1fa3`
- Yellow: `#ffe91f`
- Text Primary: `#f4f6f9`
- Text Secondary: `#d4d3e0`

**Gradients:**
- Primary Gradient: Pink → Blue → Dark Blue
- Secondary Gradient: Pink → Yellow
- Accent Gradient: Blue → Pink → Yellow

### 2. Typography
- Font Family: **Prompt** (from Google Fonts)
- Replaced all instances of Roboto, Helvetica, Arial with Prompt
- Updated font weights to match Quantus style

### 3. Component Updates

#### Core Files
- `frontend/src/index.css` - Added Quantus CSS variables and Google Fonts import
- `frontend/src/App.css` - Updated font family and colors
- `frontend/assets/index.html` - Changed title to "Quantus Telemetry", updated theme-color

#### Components Updated
- **Chains.css** - Updated top bar with Quantus gradient, modernized tab styles
- **Header.css** - Applied accent gradient background, added logo section
- **Header.tsx** - Added Quantus logo and branding text
- **Chain.css** - Updated content background
- **Tab.css** - Applied Quantus gradients to tabs, added hover effects
- **AllChains.css** - Glassmorphism effect, Quantus colors, backdrop blur
- **Stats.css** - Dark theme cards with transparency
- **Tile.css** - Updated accent colors
- **Filter.css** - Glassmorphism popup with Quantus styling
- **List/Row.css** - Updated row colors and hover states
- **List/THead.css** - Dark headers with Quantus accents
- **Map/Location.css** - Updated location pins with Quantus pink glow
- **Settings/Setting.css** - Modernized toggle switches with gradients
- **Tooltip.css** - Glassmorphism tooltips with backdrop blur
- **OfflineIndicator.css** - Updated with gradients

### 4. Assets
- Copied Quantus logo: `frontend/assets/quantus-logo.svg`
- Updated favicon: `frontend/assets/favicon.svg` (using Quantus logo)

### 5. Package Information
- Updated `frontend/package.json`:
  - Name: `@quantus/telemetry-frontend`
  - Author: `Quantus`
  - Description: "Quantus Telemetry frontend - Fork of Substrate Telemetry"

### 6. Documentation
- Updated `README.md` title and overview to reflect Quantus branding

## Design Features

### Modern UI Elements
1. **Glassmorphism** - Semi-transparent backgrounds with backdrop blur
2. **Smooth Transitions** - 0.2s ease transitions on interactive elements
3. **Enhanced Shadows** - Deeper, more dramatic shadows
4. **Rounded Corners** - Increased border radius (4px → 6-8px)
5. **Gradient Accents** - Strategic use of Quantus gradients throughout
6. **Hover States** - Pink glow effects on hover
7. **Visual Hierarchy** - Better contrast and spacing

### Branding Integration
- Logo displayed prominently in header with glassmorphic container
- "Quantus Telemetry" text next to logo
- Consistent color scheme across all components
- Gradient overlays on important UI elements
- Signature Quantus pink used for active states and highlights

## Technical Improvements
- CSS Custom Properties (CSS Variables) for easy theme management
- Modern CSS features (backdrop-filter, gradients)
- Consistent spacing and sizing
- Better accessibility with improved contrast ratios

## Preserved Functionality
All original functionality of the Substrate Telemetry dashboard has been preserved:
- Chain switching
- Node statistics
- Map view
- Settings panel
- Filtering
- Sorting
- Real-time updates

## Next Steps (Optional)
- Add Quantus-specific analytics or metrics
- Integrate with Quantus backend services
- Add custom Quantus network chains
- Implement Quantus-specific features

## Credits
Original Substrate Telemetry by Parity Technologies
Quantus Rebranding by Quantus Team

