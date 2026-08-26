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
  parseCustomProperties,
  resolveColor,
  resolveValue,
} from './cssContrast';

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
