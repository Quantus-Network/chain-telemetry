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

import { isHiddenChain } from './hiddenChains';

describe('isHiddenChain', () => {
  it('hides Dirac and Heisenberg regardless of case', () => {
    expect(isHiddenChain('Dirac')).toBe(true);
    expect(isHiddenChain('dirac')).toBe(true);
    expect(isHiddenChain('DIRAC')).toBe(true);
    expect(isHiddenChain('HEISENBERG')).toBe(true);
    expect(isHiddenChain('Heisenberg')).toBe(true);
  });

  it('hides uppercase DIRAC and HEISENBERG when the locale is Turkish', () => {
    const toLocaleLowerCase = String.prototype.toLocaleLowerCase;
    String.prototype.toLocaleLowerCase = function (this: string) {
      return toLocaleLowerCase.call(this, 'tr');
    };

    try {
      expect(isHiddenChain('DIRAC')).toBe(true);
      expect(isHiddenChain('HEISENBERG')).toBe(true);
    } finally {
      String.prototype.toLocaleLowerCase = toLocaleLowerCase;
    }
  });

  it('hides chain labels that contain Dirac or Heisenberg', () => {
    expect(isHiddenChain('Quantus Dirac Testnet')).toBe(true);
    expect(isHiddenChain('quantus dirac testnet')).toBe(true);
    expect(isHiddenChain('Quantus Heisenberg Testnet')).toBe(true);
  });

  it('keeps other chain labels visible', () => {
    expect(isHiddenChain('Quantus')).toBe(false);
    expect(isHiddenChain('Planck')).toBe(false);
    expect(isHiddenChain('')).toBe(false);
  });
});
