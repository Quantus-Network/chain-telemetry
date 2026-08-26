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

const MIN_NORMAL_TEXT_CONTRAST = 4.5;

const indexCss = fs.readFileSync(path.join(__dirname, '../index.css'), 'utf8');
const chainsCss = fs.readFileSync(path.join(__dirname, './Chains.css'), 'utf8');

const cssVars = parseCustomProperties(indexCss);

describe('Chains nav contrast', () => {
  it('gives unselected chain labels at least 4.5:1 on every primary gradient stop', () => {
    const label = resolveColor(
      declaration(chainsCss, '.Chains-chain', 'color'),
      cssVars
    );
    const stops = gradientStops(
      resolveValue('var(--gradient-primary)', cssVars)
    );

    expect(stops.length).toBeGreaterThanOrEqual(3);
    for (const stop of stops) {
      expect(contrastRatio(label, stop)).toBeGreaterThanOrEqual(
        MIN_NORMAL_TEXT_CONTRAST
      );
    }
  });

  it('gives the unselected node-count badge at least 4.5:1', () => {
    const foreground = resolveColor(
      declaration(chainsCss, '.Chains-node-count', 'color'),
      cssVars
    );
    const background = resolveColor(
      declaration(chainsCss, '.Chains-node-count', 'background'),
      cssVars
    );

    expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(
      MIN_NORMAL_TEXT_CONTRAST
    );
  });

  it('keeps selected chain labels at least 4.5:1 on the dark tab', () => {
    const label = resolveColor(
      declaration(chainsCss, '.Chains-chain.Chains-chain-selected', 'color'),
      cssVars
    );
    const tab = resolveColor('var(--color-bg-primary)', cssVars);

    expect(contrastRatio(label, tab)).toBeGreaterThanOrEqual(
      MIN_NORMAL_TEXT_CONTRAST
    );
  });

  it('keeps selected node-count text at least 4.5:1 on every secondary gradient stop', () => {
    const foreground = resolveColor(
      declaration(
        chainsCss,
        '.Chains-chain.Chains-chain-selected .Chains-node-count',
        'color'
      ),
      cssVars
    );
    const stops = gradientStops(
      resolveValue(
        declaration(
          chainsCss,
          '.Chains-chain.Chains-chain-selected .Chains-node-count',
          'background'
        ),
        cssVars
      )
    );

    expect(stops.length).toBeGreaterThanOrEqual(2);
    for (const stop of stops) {
      expect(contrastRatio(foreground, stop)).toBeGreaterThanOrEqual(
        MIN_NORMAL_TEXT_CONTRAST
      );
    }
  });
});

function parseCustomProperties(css: string): Record<string, string> {
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

function declaration(css: string, selector: string, property: string): string {
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

function resolveValue(
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

function resolveColor(value: string, vars: Record<string, string>): string {
  const resolved = resolveValue(value, vars).trim();
  return normalizeHex(resolved);
}

function gradientStops(gradient: string): string[] {
  const colors: string[] = [];
  const re = /#(?:[0-9a-f]{3}|[0-9a-f]{6})\b/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(gradient))) {
    colors.push(normalizeHex(match[0]));
  }
  return colors;
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

function contrastRatio(a: string, b: string): number {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}
