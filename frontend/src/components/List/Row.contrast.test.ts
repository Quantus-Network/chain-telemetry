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
  overlayOn,
  parseCustomProperties,
  resolveColor,
} from '../cssContrast';

const MIN_NORMAL_TEXT_CONTRAST = 4.5;

const indexCss = fs.readFileSync(
  path.join(__dirname, '../../index.css'),
  'utf8'
);
const rowCss = fs.readFileSync(path.join(__dirname, './Row.css'), 'utf8');

const cssVars = parseCustomProperties(indexCss);

describe('Row contrast', () => {
  it('gives stale row text at least 4.5:1 on the page and hover backgrounds', () => {
    const foreground = resolveColor(
      declaration(rowCss, '.Row-stale', 'color'),
      cssVars
    );
    const page = resolveColor('var(--color-bg-primary)', cssVars);
    const hover = overlayOn(
      declaration(rowCss, '.Row:hover', 'background'),
      page
    );

    expect(contrastRatio(foreground, page)).toBeGreaterThanOrEqual(
      MIN_NORMAL_TEXT_CONTRAST
    );
    expect(contrastRatio(foreground, hover)).toBeGreaterThanOrEqual(
      MIN_NORMAL_TEXT_CONTRAST
    );
  });
});
