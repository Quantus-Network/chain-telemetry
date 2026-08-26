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
import {
  contrastRatio,
  declaration,
  gradientStops,
  overlayOn,
  parseCustomProperties,
  resolveColor,
  resolveValue,
} from './cssContrast';

const MIN_NORMAL_TEXT_CONTRAST = 4.5;

const indexCss = fs.readFileSync(path.join(__dirname, '../index.css'), 'utf8');
const allChainsCss = fs.readFileSync(
  path.join(__dirname, './AllChains.css'),
  'utf8'
);

const cssVars = parseCustomProperties(indexCss);

describe('AllChains selected contrast', () => {
  it('gives selected chain labels at least 4.5:1 on every primary gradient stop', () => {
    const label = resolveColor(
      declaration(allChainsCss, '.AllChains-chain-selected', 'color'),
      cssVars
    );
    const stops = gradientStops(
      resolveValue(
        declaration(allChainsCss, '.AllChains-chain-selected', 'background'),
        cssVars
      )
    );

    expect(stops.length).toBeGreaterThanOrEqual(3);
    for (const stop of stops) {
      expect(contrastRatio(label, stop)).toBeGreaterThanOrEqual(
        MIN_NORMAL_TEXT_CONTRAST
      );
    }
  });

  it('gives the selected node-count badge at least 4.5:1', () => {
    const foreground = resolveColor(
      declaration(
        allChainsCss,
        '.AllChains-chain-selected .AllChains-node-count',
        'color'
      ),
      cssVars
    );
    const background = resolveColor(
      declaration(
        allChainsCss,
        '.AllChains-chain-selected .AllChains-node-count',
        'background'
      ),
      cssVars
    );

    expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(
      MIN_NORMAL_TEXT_CONTRAST
    );
  });

  it('gives selected highlighted filter matches a solid 4.5:1 foreground on every primary gradient stop', () => {
    const fill = declaration(
      allChainsCss,
      '.AllChains-chain-selected .AllChains-chain-highlighted-text',
      '-webkit-text-fill-color'
    );
    expect(fill).not.toBe('transparent');
    const foreground = resolveColor(fill, cssVars);
    const stops = gradientStops(
      resolveValue(
        declaration(allChainsCss, '.AllChains-chain-selected', 'background'),
        cssVars
      )
    );

    expect(stops.length).toBeGreaterThanOrEqual(3);
    for (const stop of stops) {
      expect(contrastRatio(foreground, stop)).toBeGreaterThanOrEqual(
        MIN_NORMAL_TEXT_CONTRAST
      );
    }
  });

  it('does not apply the unselected hover fill to the selected chain', () => {
    expect(() =>
      declaration(allChainsCss, '.AllChains-chain:hover', 'background')
    ).toThrow(/Rule not found/);

    const hoverFill = declaration(
      allChainsCss,
      '.AllChains-chain:hover:not(.AllChains-chain-selected)',
      'background'
    );
    expect(hoverFill.startsWith('rgba(')).toBe(true);
  });
});

function pageBackground(): string {
  return resolveColor('var(--color-bg-primary)', cssVars);
}

function modalBackground(): string {
  return overlayOn(
    declaration(allChainsCss, '.AllChains-content', 'background'),
    pageBackground()
  );
}

function fillOnModal(selector: string, property = 'background'): string {
  return overlayOn(
    declaration(allChainsCss, selector, property),
    modalBackground()
  );
}

describe('AllChains unselected contrast', () => {
  it('gives unselected chain labels at least 4.5:1 on the chip', () => {
    const label = resolveColor(
      declaration(allChainsCss, '.AllChains-chain', 'color'),
      cssVars
    );
    expect(
      contrastRatio(label, fillOnModal('.AllChains-chain'))
    ).toBeGreaterThanOrEqual(MIN_NORMAL_TEXT_CONTRAST);
  });

  it('gives unselected highlighted filter matches at least 4.5:1 on every secondary stop', () => {
    const chip = fillOnModal('.AllChains-chain');
    const stops = gradientStops(
      resolveValue(
        declaration(
          allChainsCss,
          '.AllChains-chain-highlighted-text',
          'background'
        ),
        cssVars
      )
    );

    expect(stops.length).toBeGreaterThanOrEqual(2);
    for (const stop of stops) {
      expect(contrastRatio(stop, chip)).toBeGreaterThanOrEqual(
        MIN_NORMAL_TEXT_CONTRAST
      );
    }
  });

  it('gives the unselected node-count badge at least 4.5:1', () => {
    const foreground = resolveColor(
      declaration(allChainsCss, '.AllChains-node-count', 'color'),
      cssVars
    );
    const badge = overlayOn(
      declaration(allChainsCss, '.AllChains-node-count', 'background'),
      fillOnModal('.AllChains-chain')
    );

    expect(contrastRatio(foreground, badge)).toBeGreaterThanOrEqual(
      MIN_NORMAL_TEXT_CONTRAST
    );
  });

  it('gives unselected hover labels and highlights at least 4.5:1', () => {
    const hoverChip = fillOnModal(
      '.AllChains-chain:hover:not(.AllChains-chain-selected)'
    );
    const label = resolveColor(
      declaration(allChainsCss, '.AllChains-chain', 'color'),
      cssVars
    );
    const stops = gradientStops(
      resolveValue(
        declaration(
          allChainsCss,
          '.AllChains-chain-highlighted-text',
          'background'
        ),
        cssVars
      )
    );

    expect(contrastRatio(label, hoverChip)).toBeGreaterThanOrEqual(
      MIN_NORMAL_TEXT_CONTRAST
    );
    for (const stop of stops) {
      expect(contrastRatio(stop, hoverChip)).toBeGreaterThanOrEqual(
        MIN_NORMAL_TEXT_CONTRAST
      );
    }
  });
});

describe('AllChains chrome contrast', () => {
  it('gives empty-state and control text at least 4.5:1 on the modal', () => {
    const color = resolveColor(
      declaration(allChainsCss, '.AllChains-content', 'color'),
      cssVars
    );
    expect(contrastRatio(color, modalBackground())).toBeGreaterThanOrEqual(
      MIN_NORMAL_TEXT_CONTRAST
    );
  });

  it('gives the filter placeholder at least 4.5:1', () => {
    const color = resolveColor(
      declaration(
        allChainsCss,
        '.AllChains-controls input::placeholder',
        'color'
      ),
      cssVars
    );
    const input = overlayOn(
      declaration(allChainsCss, '.AllChains-controls input', 'background'),
      modalBackground()
    );

    expect(contrastRatio(color, input)).toBeGreaterThanOrEqual(
      MIN_NORMAL_TEXT_CONTRAST
    );
  });

  it('gives the active sort control at least 4.5:1 on every secondary gradient stop', () => {
    const color = resolveColor(
      declaration(allChainsCss, '.AllChains-controls-sortby-active', 'color'),
      cssVars
    );
    const stops = gradientStops(
      resolveValue(
        declaration(
          allChainsCss,
          '.AllChains-controls-sortby-active',
          'background'
        ),
        cssVars
      )
    );

    expect(stops.length).toBeGreaterThanOrEqual(2);
    for (const stop of stops) {
      expect(contrastRatio(color, stop)).toBeGreaterThanOrEqual(
        MIN_NORMAL_TEXT_CONTRAST
      );
    }
  });
});
