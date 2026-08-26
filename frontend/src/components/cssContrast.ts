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

export function parseCustomProperties(css: string): Record<string, string> {
  const root = css.match(/:root\s*\{/);
  if (!root || root.index === undefined) {
    throw new Error('No :root block');
  }
  const body = blockBody(css, root.index + root[0].length - 1);
  const vars: Record<string, string> = {};
  const re = /(--[a-z0-9-]+)\s*:\s*([^;]+);/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(body))) {
    vars[match[1]] = match[2].replace(/\s+/g, ' ').trim();
  }
  return vars;
}

function blockBody(css: string, openBraceIndex: number): string {
  let depth = 0;
  for (let i = openBraceIndex; i < css.length; i++) {
    if (css[i] === '{') {
      depth++;
    } else if (css[i] === '}') {
      depth--;
      if (depth === 0) {
        return css.slice(openBraceIndex + 1, i);
      }
    }
  }
  throw new Error('Unclosed CSS block');
}

export function declaration(
  css: string,
  selector: string,
  property: string
): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(escaped + '\\s*\\{([^}]+)\\}');
  const match = css.match(re);
  if (!match) {
    throw new Error(`Rule not found: ${selector}`);
  }
  const propRe = new RegExp(
    '(?:^|\\s)' + property.replace(/-/g, '\\-') + '\\s*:\\s*([^;]+);'
  );
  const prop = match[1].match(propRe);
  if (!prop) {
    throw new Error(`${property} not found on ${selector}`);
  }
  return prop[1].trim();
}

export function resolveValue(
  value: string,
  vars: Record<string, string>,
  seen: string[] = []
): string {
  return value.replace(/var\(\s*(--[a-z0-9-]+)\s*\)/gi, (_, name: string) => {
    if (seen.includes(name)) {
      throw new Error(`Cycle resolving ${name}`);
    }
    const next = vars[name];
    if (!next) {
      throw new Error(`Unknown custom property ${name}`);
    }
    return resolveValue(next, vars, seen.concat(name));
  });
}

export function resolveColor(
  value: string,
  vars: Record<string, string>
): string {
  const resolved = resolveValue(value, vars).trim();
  return normalizeHex(resolved);
}

export function gradientStops(gradient: string): string[] {
  const colors: string[] = [];
  const re = /#(?:[0-9a-f]{3}|[0-9a-f]{6})\b/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(gradient))) {
    colors.push(normalizeHex(match[0]));
  }
  return colors;
}

type Rgba = { r: number; g: number; b: number; a: number };

export function overlayOn(foreground: string, background: string): string {
  const fg = parseRgba(foreground);
  const bg = parseRgba(background);
  if (bg.a < 1) {
    throw new Error(`Background must be opaque: ${background}`);
  }
  if (fg.a >= 1) {
    return rgbaToHex(fg);
  }
  const a = fg.a;
  return rgbaToHex({
    r: fg.r * a + bg.r * (1 - a),
    g: fg.g * a + bg.g * (1 - a),
    b: fg.b * a + bg.b * (1 - a),
    a: 1,
  });
}

function parseRgba(color: string): Rgba {
  const trimmed = color.trim();
  const rgb = trimmed.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i
  );
  if (rgb) {
    return {
      r: Number(rgb[1]),
      g: Number(rgb[2]),
      b: Number(rgb[3]),
      a: rgb[4] === undefined ? 1 : Number(rgb[4]),
    };
  }
  const hex = normalizeHex(trimmed);
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
    a: 1,
  };
}

function rgbaToHex(color: Rgba): string {
  const ch = (n: number) => Math.round(n).toString(16).padStart(2, '0');
  return `#${ch(color.r)}${ch(color.g)}${ch(color.b)}`;
}

function normalizeHex(color: string): string {
  const named: Record<string, string> = {
    white: '#ffffff',
    black: '#000000',
  };
  const lower = color.toLowerCase();
  if (named[lower]) {
    return named[lower];
  }
  const hex = color.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!hex) {
    throw new Error(`Not a hex color: ${color}`);
  }
  if (hex[1].length === 3) {
    const [r, g, b] = hex[1].split('');
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return `#${hex[1]}`.toLowerCase();
}

function channel(value: number): number {
  const s = value / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex: string): number {
  const n = hex.slice(1);
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: string, b: string): number {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}
