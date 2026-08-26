// Source code for the Substrate Telemetry Server.
// Copyright (C) 2023 Parity Technologies (UK) Ltd.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.

import * as fs from 'fs';
import * as path from 'path';

const HEADER_IMG_HEIGHT_PX = 40;
const MIN_VISIBLE_MARK_HEIGHT_PX = 32;

function parseViewBox(svg: string): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  const match = svg.match(/viewBox="([^"]+)"/);
  if (!match) {
    throw new Error('SVG is missing a viewBox');
  }
  const parts = match[1]
    .trim()
    .split(/[\s,]+/)
    .map(Number);
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) {
    throw new Error(`Invalid viewBox: ${match[1]}`);
  }
  return { x: parts[0], y: parts[1], width: parts[2], height: parts[3] };
}

function unionBounds(
  a: { minX: number; minY: number; maxX: number; maxY: number },
  b: { minX: number; minY: number; maxX: number; maxY: number }
) {
  return {
    minX: Math.min(a.minX, b.minX),
    minY: Math.min(a.minY, b.minY),
    maxX: Math.max(a.maxX, b.maxX),
    maxY: Math.max(a.maxY, b.maxY),
  };
}

function boundsFromPath(d: string): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
} {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const include = (x: number, y: number) => {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  };

  const tokens = d.match(/[MLCHVZ]|-?\d*\.?\d+/gi);
  if (!tokens) {
    throw new Error('Path has no commands');
  }

  let i = 0;
  let cmd = '';
  let cx = 0;
  let cy = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (/^[MLCHVZ]$/i.test(token)) {
      cmd = token.toUpperCase();
      i += 1;
      if (cmd === 'Z') {
        continue;
      }
    }
    if (cmd === 'M' || cmd === 'L') {
      const x = Number(tokens[i++]);
      const y = Number(tokens[i++]);
      include(x, y);
      cx = x;
      cy = y;
    } else if (cmd === 'C') {
      for (let k = 0; k < 3; k++) {
        const x = Number(tokens[i++]);
        const y = Number(tokens[i++]);
        include(x, y);
        cx = x;
        cy = y;
      }
    } else if (cmd === 'H') {
      const x = Number(tokens[i++]);
      include(x, cy);
      cx = x;
    } else if (cmd === 'V') {
      const y = Number(tokens[i++]);
      include(cx, y);
      cy = y;
    } else {
      throw new Error(`Unsupported path command: ${cmd || token}`);
    }
  }

  return { minX, minY, maxX, maxY };
}

function orangeMarkBounds(svg: string) {
  const pathRegex = /<path d="([^"]+)" fill="#FF6B35"/g;
  let bounds: ReturnType<typeof boundsFromPath> | null = null;
  let match: RegExpExecArray | null;
  while ((match = pathRegex.exec(svg))) {
    const next = boundsFromPath(match[1]);
    bounds = bounds ? unionBounds(bounds, next) : next;
  }
  if (!bounds) {
    throw new Error('No orange mark paths found');
  }
  return bounds;
}

describe('header Quantus logo', () => {
  const logoPath = path.join(__dirname, '../../../assets/quantus-logo-n.svg');
  const cssPath = path.join(__dirname, './Header.css');

  it('crops the viewBox so the orange mark fills the 40px header slot', () => {
    const css = fs.readFileSync(cssPath, 'utf8');
    expect(css).toMatch(/\.Header-logo img\s*\{[^}]*height:\s*40px/);

    const svg = fs.readFileSync(logoPath, 'utf8');
    const viewBox = parseViewBox(svg);
    const mark = orangeMarkBounds(svg);

    expect(viewBox.x).toBeLessThanOrEqual(mark.minX);
    expect(viewBox.y).toBeLessThanOrEqual(mark.minY);
    expect(viewBox.x + viewBox.width).toBeGreaterThanOrEqual(mark.maxX);
    expect(viewBox.y + viewBox.height).toBeGreaterThanOrEqual(mark.maxY);

    const visibleMarkHeightPx =
      ((mark.maxY - mark.minY) / viewBox.height) * HEADER_IMG_HEIGHT_PX;
    expect(visibleMarkHeightPx).toBeGreaterThanOrEqual(
      MIN_VISIBLE_MARK_HEIGHT_PX
    );
  });
});
